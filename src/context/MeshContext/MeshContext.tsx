import {
    ReactNode,
    useEffect,
    useReducer,
    useContext,
    createContext
} from 'react';

import {useSimulationContext} from '../SimulationContext';

/**
 * Hooks
 * */
import {
    useGetCompletedMeshTasks
} from './hooks/useGetCompletedMeshTasks';

/**
 * Types
 * */
type MeshProviderProps = { children: ReactNode };
import {Mesh} from '@/types'
import {MeshContextActionType} from '@/enums'

type MeshContextAction = {
    type: MeshContextActionType.SET_COMPLETED_MESH_TASKS;
    completedMeshTasks: Mesh[]
}

type State = {
    completedMeshTasks: Mesh[];
    dispatch: (action: MeshContextAction) => void;
};

const initialState: State = {
    completedMeshTasks: [],
    dispatch: () => {
    },
};

const MeshContext = createContext(initialState);

function handleUnknownAction(action: never): never;
function handleUnknownAction(action: MeshContextAction) {
    throw new Error(`Unhandled action type: ${action.type}`);
}

const meshReducer = (state: State, action: MeshContextAction): State => {
    switch (action.type) {
        case MeshContextActionType.SET_COMPLETED_MESH_TASKS: {
            return {
                ...state,
                completedMeshTasks: [...action.completedMeshTasks],
            };
        }
        default: {
            handleUnknownAction(action.type);
        }
    }
};

const MeshProvider = ({children}: MeshProviderProps) => {
    const [meshState, dispatch] = useReducer(meshReducer, initialState);
    const {
        simulationState: {selectedSimulation},
    } = useSimulationContext();
    const {data: completedMeshTasks} = useGetCompletedMeshTasks(selectedSimulation?.modelId || '');

    useEffect(() => {
        if (completedMeshTasks) {
            dispatch({
                type: MeshContextActionType.SET_COMPLETED_MESH_TASKS,
                completedMeshTasks,
            });
        }
    }, [completedMeshTasks]);

    const value = {...meshState, dispatch};

    return <MeshContext.Provider value={value}>{children}</MeshContext.Provider>;
};

const useMeshContext = () => {
    const context = useContext(MeshContext);
    if (context === undefined) {
        throw new Error('useMeshContext must be used within MeshProvider');
    }
    return context;
};

export {MeshProvider, useMeshContext};
