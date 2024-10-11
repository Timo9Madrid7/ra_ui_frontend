/** Hooks */
import { useReducer, createContext, useContext, ReactNode, useMemo, useEffect } from 'react';

/** Context */
import { useSimulationContext } from '@/context/SimulationContext';
import { useEditorContext } from '@/context/EditorContext';

/** Types */
import { Material, MaterialLayer } from '@/types';
import { Source } from '@/context/EditorContext/types';
import {EMPTY_MATERIAL_NAME} from "@/constants";


enum ActionType {
  SET_MATERIALS_PANEL_OPEN = 'SET_MATERIALS_PANEL_OPEN',
  SET_SELECTED_MATERIAL = 'SET_SELECTED_MATERIAL',
  SET_HIGHLIGHTED_MATERIAL = 'SET_HIGHLIGHTED_MATERIAL',
  CLOSE_MATERIALS_PANEL = 'CLOSE_MATERIALS_PANEL',
  SET_MULTI_SELECT_ITEMS = 'SET_MULTI_SELECT_ITEMS',
  SET_SELECTED_LAYER_INDEX = 'SET_SELECTED_LAYER_INDEX',
}

type LibraryPanelAction =
  | {
      type: ActionType.SET_MATERIALS_PANEL_OPEN;
      isOpen: boolean;
    }
  | {
      type: ActionType.SET_SELECTED_MATERIAL;
      material: Material | null;
      highlightedMaterialId: string | null;
    }
  | {
      type: ActionType.SET_HIGHLIGHTED_MATERIAL;
      highlightedMaterialId: string | null;
    }
  | {
      type: ActionType.CLOSE_MATERIALS_PANEL;
    }
  | {
      type: ActionType.SET_MULTI_SELECT_ITEMS;
      multiSelectedItemIds: string[];
    }
  | {
      type: ActionType.SET_SELECTED_LAYER_INDEX;
      selectedLayerIndex: [number, number | undefined] | null;
    };

type State = {
  isMaterialsLibraryOpen: boolean;
  selectedMaterial: Material | null;
  highlightedMaterialId: string | null;
  selectedLayer: MaterialLayer | null;
  selectedLayerIndex: [number, number | undefined] | null;
  selectedSource: Source | null;
  previouslyAssignedMaterial: Material | null;
  multiSelectedItemIds: string[];
  dispatch: (action: LibraryPanelAction) => void;
};

const initialState: State = {
  isMaterialsLibraryOpen: false,
  selectedMaterial: null,
  selectedLayer: null,
  selectedLayerIndex: null,
  selectedSource: null,
  highlightedMaterialId: null,
  previouslyAssignedMaterial: null,
  multiSelectedItemIds: [],
  dispatch: () => {},
};

const MaterialPanelContext = createContext(initialState);

function handleUnknownAction(action: never): never;
function handleUnknownAction(action: LibraryPanelAction) {
  throw new Error(`Unhandled action type: ${action.type}`);
}

const libraryPanelReducer = (state: State, action: LibraryPanelAction): State => {
  switch (action.type) {
    case ActionType.SET_MATERIALS_PANEL_OPEN: {
      return {
        ...state,
        isMaterialsLibraryOpen: action.isOpen,
      };
    }

    case ActionType.SET_SELECTED_MATERIAL: {
      const previouslyAssignedMaterial =
        action.material?.name !== EMPTY_MATERIAL_NAME ? action.material : state.previouslyAssignedMaterial;
      let highlightedMaterialId = action.highlightedMaterialId ?? state.highlightedMaterialId;
      if (!state.isMaterialsLibraryOpen) highlightedMaterialId = null;
      return {
        ...state,
        selectedMaterial: action.material,
        previouslyAssignedMaterial,
        highlightedMaterialId,
      };
    }

    case ActionType.CLOSE_MATERIALS_PANEL: {
      return {
        ...state,
        isMaterialsLibraryOpen: false,
        highlightedMaterialId: null,
        selectedMaterial: null,
        previouslyAssignedMaterial: null,
        selectedSource: null,
        selectedLayerIndex: null,
      };
    }

    case ActionType.SET_HIGHLIGHTED_MATERIAL: {
      return {
        ...state,
        highlightedMaterialId: action.highlightedMaterialId,
      };
    }

    case ActionType.SET_MULTI_SELECT_ITEMS: {
      return {
        ...state,
        multiSelectedItemIds: [...action.multiSelectedItemIds],
      };
    }

    case ActionType.SET_SELECTED_LAYER_INDEX: {
      return {
        ...state,
        selectedLayerIndex: action.selectedLayerIndex,
      };
    }

    default: {
      handleUnknownAction(action);
    }
  }
};

type MaterialPanelProviderProps = { children: ReactNode };

const MaterialPanelProvider = ({ children }: MaterialPanelProviderProps) => {
  const [libraryPanelState, dispatch] = useReducer(libraryPanelReducer, initialState);
  const {
    simulationState: { surfaceLayers, selectedSimulation },
  } = useSimulationContext();
  const { selected } = useEditorContext();

  useEffect(() => {
    // whenever selected simulation changes we want to reset the state
    dispatch({
      type: ActionType.CLOSE_MATERIALS_PANEL,
    });
  }, [selectedSimulation?.id]);

  useEffect(() => {
    if (selected) {
      dispatch({
        type: ActionType.SET_MULTI_SELECT_ITEMS,
        multiSelectedItemIds: [],
      });
    }
  }, [selected]);

  const selectedLayer = useMemo(() => {
    if (selected?.type === 'Layer') {
      return surfaceLayers.flatMap((s) => s.children).find((x) => x.id === selected.id) || null;
    } else if (selected?.type === 'LayerGroup' && surfaceLayers) {
      return surfaceLayers.find((x) => x.id === selected.id) || null;
    }
    return null;
  }, [selected, surfaceLayers]);

  const value = useMemo(() => {
    return {
      ...libraryPanelState,
      selectedLayer,
      dispatch,
    };
  }, [libraryPanelState, selectedLayer]);

  return <MaterialPanelContext.Provider value={value}>{children}</MaterialPanelContext.Provider>;
};

const useMaterialPanelContext = () => {
  const context = useContext(MaterialPanelContext);
  if (context === undefined) {
    throw new Error('useMaterialPanelContext must be used within MaterialPanelProvider');
  }
  return context;
};

export { MaterialPanelProvider, useMaterialPanelContext, ActionType };
