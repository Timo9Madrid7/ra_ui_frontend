import { createContext, ReactNode, useContext, useReducer } from 'react';
import { Object3D } from 'three';

/** Components */
import toast from 'react-hot-toast';

/** Types */
import { ModelFile, ModelLayerGroup } from './types';
import { ModelInformation } from '@/types';

/** Utils */
import {
  createLayerGroupsFromModel,
  getInnerAndOuterMeshes,
  parseModelAs3dmFile,
  parseModelAsObject3D,
  setupAreaAndGroupIntByObjectId,
} from './utils';

enum ModelActionType {
  ADD_MODEL = 'ADD_MODEL',
  SET_CURRENT_MODEL_ID = 'SET_CURRENT_MODEL_ID',
  UPDATE_MODEL_INFORMATION = 'UPDATE_MODEL_INFORMATION',
}

type ModelAction =
  | { type: ModelActionType.ADD_MODEL; modelId: string; model: Object3D; rhino3dm: any }
  | { type: ModelActionType.SET_CURRENT_MODEL_ID; modelId: string }
  | { type: ModelActionType.UPDATE_MODEL_INFORMATION; modelInformation: ModelInformation };

type ModelState = {
  currentModelId: string | null;
  models3d: Record<string, Object3D>;
  models3dLayerGroups: Record<string, Array<ModelLayerGroup>>;
  rhino3dmFiles: Record<string, any>;

  modelInformation: ModelInformation | null;
  meshes: Object3D[] | null;
  innerMeshes: Object3D[] | null;
  outerMeshes: Object3D[] | null;
  areaByObjectId: Record<string, number> | null;
  groupIntegerByObjectId: Record<string, number> | null;
  // Derived properties
  currentModel3d: Object3D | null;
  currentModel3dLayerGroups: Array<ModelLayerGroup> | null;
  currentRhino3dmFile: any;
  isModelLoaded: boolean;

  dispatch: React.Dispatch<ModelAction>;
  addModelFromFile: (modelId: string, modelFile: ModelFile, onSuccess?: () => void) => Promise<void>;
};

const initialState: ModelState = {
  currentModelId: null,
  models3d: {},
  models3dLayerGroups: {},
  rhino3dmFiles: {},

  modelInformation: null,
  meshes: null,
  innerMeshes: null,
  outerMeshes: null,
  areaByObjectId: null,
  groupIntegerByObjectId: null,
  // Derived properties
  currentModel3d: null,
  currentModel3dLayerGroups: null,
  currentRhino3dmFile: null,
  isModelLoaded: false,

  dispatch: () => null,
  addModelFromFile: async () => undefined,
};

const ModelContext = createContext<ModelState | undefined>(undefined);

const modelReducer = (state: ModelState, action: ModelAction): ModelState => {
  switch (action.type) {
    case ModelActionType.ADD_MODEL: {
      const layerGroups = createLayerGroupsFromModel(action.model);

      return {
        ...state,
        models3d: {
          ...state.models3d,
          [action.modelId]: action.model,
        },
        models3dLayerGroups: {
          ...state.models3dLayerGroups,
          [action.modelId]: layerGroups,
        },
        rhino3dmFiles: {
          ...state.rhino3dmFiles,
          [action.modelId]: action.rhino3dm,
        },
      };
    }
    case ModelActionType.SET_CURRENT_MODEL_ID: {
      return {
        ...state,
        currentModelId: action.modelId,
      };
    }
    // only used in Editor
    case ModelActionType.UPDATE_MODEL_INFORMATION:
      return {
        ...state,
        modelInformation: action.modelInformation,
      };
  }
};

type ModelProviderProps = {
  children: ReactNode;
};

const ModelProvider: React.FC<ModelProviderProps> = ({ children }) => {
  const [modelState, dispatch] = useReducer(modelReducer, initialState);

  const addModelFromFile = async (modelId: string, modelFile: ModelFile, onSuccess?: () => void) => {
    if (modelFile.fileData.byteLength !== 0) {
      try {
        const rhino3dm = await parseModelAs3dmFile(modelFile.fileData);
        const model = await parseModelAsObject3D(modelFile);

        dispatch({
          type: ModelActionType.ADD_MODEL,
          modelId: modelId,
          rhino3dm,
          model,
        });

        if (onSuccess) {
          onSuccess();
        }
      } catch (e) {
        toast.error('Failed to load the model');
      }
    }
  };

  // Extract current model details from state
  const currentModel3d =
    modelState.currentModelId && modelState.currentModelId in modelState.models3d
      ? modelState.models3d[modelState.currentModelId]
      : null;
  const currentRhino3dmFile =
    modelState.currentModelId && modelState.currentModelId in modelState.rhino3dmFiles
      ? modelState.rhino3dmFiles[modelState.currentModelId]
      : null;
  const currentModel3dLayerGroups =
    modelState.currentModelId && modelState.currentModelId in modelState.models3dLayerGroups
      ? modelState.models3dLayerGroups[modelState.currentModelId]
      : null;

  const meshes = currentModel3dLayerGroups ? currentModel3dLayerGroups.flatMap((g) => g.children) : null;
  const { areaByObjectId, groupIntegerByObjectId } = currentRhino3dmFile
    ? setupAreaAndGroupIntByObjectId(currentRhino3dmFile)
    : { areaByObjectId: null, groupIntegerByObjectId: null };

  const { innerMeshes, outerMeshes } = getInnerAndOuterMeshes(meshes || [], groupIntegerByObjectId || {});

  const value: ModelState = {
    ...modelState,
    currentModel3d,
    currentModel3dLayerGroups,
    currentRhino3dmFile,
    isModelLoaded: modelState.currentModelId && modelState.currentModelId in modelState.models3d ? true : false,
    meshes: currentModel3dLayerGroups ? currentModel3dLayerGroups.flatMap((g) => g.children) : null,
    areaByObjectId,
    groupIntegerByObjectId,
    innerMeshes,
    outerMeshes,
    dispatch,
    addModelFromFile,
  };

  return <ModelContext.Provider value={value}>{children}</ModelContext.Provider>;
};

const useModelContext = () => {
  const context = useContext(ModelContext);
  if (!context) {
    throw new Error('useModelContext must be used within ModelProvider');
  }
  return context;
};

export { ModelProvider, useModelContext, ModelActionType };
