import { createContext, useContext, ReactNode, useState, useEffect, useReducer } from 'react';

import * as THREE from 'three';

/** Types */
import { Receiver, ResultsView, SelectedDetails, Source, View3DType } from './types';
import { Simulation, Source as SourceDTO } from '@/types';
import { Vector3 } from 'three';
import {View3D} from "@/enums";

type EditorProviderProps = { children: ReactNode };

enum ActionType {
  RESET_STATE = 'RESET_STATE',
  SET_SELECTED = 'SET_SELECTED',
  SET_FOCUS_ITEM = 'SET_FOCUS_ITEM',
  SET_MULTI_SELECTED = 'SET_MULTI_SELECTED',
  CLEAR_SELECTED = 'CLEAR_SELECTED',
  SET_SOURCES = 'SET_SOURCES',
  SET_RECEIVERS = 'SET_RECEIVERS',
  SET_IS_IN_RESULTS_MODE = 'SET_IS_IN_RESULTS_MODE',
  SET_RESULTS_VIEW = 'SET_RESULTS_VIEW', // to set full result mode or side by side view with model
  SHOW_EDIT_MODAL = 'SHOW_EDIT_MODAL',
  SET_3D_VIEW = 'SET_3D_VIEW',
  SET_TASK_TYPE = 'SET_TASK_TYPE',
}

type EditorContextAction =
  | {
      type: ActionType.RESET_STATE;
    }
  | {
      type: ActionType.SET_SELECTED;
      selected: SelectedDetails | null;
    }
  | {
      type: ActionType.SET_MULTI_SELECTED;
      multiSelected: SelectedDetails[];
    }
  | { type: ActionType.SET_FOCUS_ITEM; focusItem: string | null }
  | { type: ActionType.CLEAR_SELECTED }
  | { type: ActionType.SET_SOURCES; sources: Source[] }
  | { type: ActionType.SET_RECEIVERS; receivers: Receiver[] }
  | { type: ActionType.SET_IS_IN_RESULTS_MODE; payload: boolean }
  | { type: ActionType.SET_RESULTS_VIEW; payload: ResultsView }
  | { type: ActionType.SHOW_EDIT_MODAL; editSimulation: EditModal }
  | { type: ActionType.SET_3D_VIEW; view3D: View3DType }
  | { type: ActionType.SET_TASK_TYPE; taskType: string };

type EditModal = {
  showDialog: boolean;
  updatedSimulation: Simulation | null;
};

type State = {
  selected: SelectedDetails | null;
  multiSelected: SelectedDetails[];
  focusItem: string | null;
  isLoading: boolean;
  sources: Source[];
  receivers: Receiver[];
  dispatch: (action: EditorContextAction) => void;
  isInResultsMode: boolean;
  resultsView: ResultsView;
  isCreateMenuOpen: boolean;
  editSimulation: EditModal;
  view3D: View3DType;
  taskType: string;
};

const initialState: State = {
  selected: null,
  multiSelected: [],
  focusItem: null,
  isLoading: false,
  sources: [],
  receivers: [],
  dispatch: () => {},
  isInResultsMode: false,
  resultsView: ResultsView.ResultsModelView,
  isCreateMenuOpen: false,
  editSimulation: {
    showDialog: false,
    updatedSimulation: null,
  },
  hiddenSurfaceReceivers: [],
  view3D: View3D.GHOSTED,
  taskType: '',
};

const EditorContext = createContext(initialState);

function handleUnknownAction(action: never): never;
function handleUnknownAction(action: EditorContextAction) {
  throw new Error(`Unhandled action type: ${action.type}`);
}

const editorReducer = (state: State, action: EditorContextAction): State => {
  switch (action.type) {
    case ActionType.RESET_STATE: {
      return {
        ...initialState,
      };
    }
    case ActionType.SET_IS_IN_RESULTS_MODE: {
      return {
        ...state,
        isInResultsMode: action.payload,
      };
    }
    case ActionType.SET_RESULTS_VIEW: {
      return {
        ...state,
        resultsView: action.payload,
      };
    }
    case ActionType.SET_SOURCES: {
      return {
        ...state,
        sources: action.sources,
      };
    }
    case ActionType.SET_RECEIVERS: {
      return {
        ...state,
        receivers: action.receivers,
      };
    }

    case ActionType.SET_SELECTED: {
      return {
        ...state,
        selected: action.selected,
        multiSelected: [],
        focusItem: null,
      };
    }
    case ActionType.SET_MULTI_SELECTED: {
      return {
        ...state,
        multiSelected: action.multiSelected,
        selected: null,
      };
    }

    case ActionType.SET_FOCUS_ITEM: {
      return {
        ...state,
        focusItem: action.focusItem,
      };
    }

    case ActionType.CLEAR_SELECTED: {
      return {
        ...state,
        selected: initialState.selected,
        multiSelected: initialState.multiSelected,
        focusItem: initialState.focusItem,
      };
    }

    case ActionType.SHOW_EDIT_MODAL: {
      return {
        ...state,
        editSimulation: { ...action.editSimulation },
      };
    }

    case ActionType.SET_3D_VIEW: {
      return {
        ...state,
        view3D: action.view3D,
      };
    }

    case ActionType.SET_TASK_TYPE: {
      return {
        ...state,
        taskType: action.taskType,
      };
    }

    default: {
      handleUnknownAction(action);
    }
  }
};

const EditorProvider = ({ children }: EditorProviderProps) => {
  const [editorState, dispatch] = useReducer(editorReducer, initialState);
  const [isLoading, setIsLoading] = useState(true);

  THREE.Object3D.DEFAULT_UP.set(0, 0, 1);

  const setup = async () => {
    setIsLoading(true);
    setIsLoading(false);
  };

  useEffect(() => {
    setup();
  }, []);

  const value = { ...editorState, isLoading, dispatch };

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
};

const useEditorContext = () => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditorContext must be used within EditorProvider');
  }
  return context;
};

export { EditorProvider, useEditorContext, ActionType };
