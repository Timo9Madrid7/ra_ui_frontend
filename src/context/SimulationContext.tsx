import {useReducer, createContext, useContext, ReactNode, useEffect} from 'react';
import {useLocation} from 'react-router-dom';

/** Context */
import {useEditorContext, ActionType as EditorActionType} from './EditorContext';
import {useModelContext} from './ModelContext';

/** Hooks */
import {useGetPointValidity} from '@/components';
import {MissingMaterialInfo} from '@/hooks';

/** Types */
import {HiddenLayer, MaterialLayer, Simulation, SimulationRun} from '@/types';
import {Receiver, Source} from './EditorContext/types';

/** Utils */
import {getStatusBySimulationRun, sortAndOrderSimulation} from './utils';
import {mapToReceivers, mapToSources} from '@/components';

declare global {
    interface Window {
        debuggerSimSelected: any;
    }
}

export const initialState: State = {
    originalSim: null,
    lastSimRunDate: '',
    selectedSimulation: null,
    availableSimulations: null,
    hiddenLayers: [],
    surfaceLayers: [],
    missingMaterials: [],
    userTouched: false,
};

enum ActionType {
    SET_SELECTED_SIMULATION = 'SET_SELECTED_SIMULATION',
    SET_ORIGINAL_SIMULATION = 'SET_ORIGINAL_SIMULATION',
    UPDATE_SELECTED_SIMULATION = 'UPDATE_SELECTED_SIMULATION',
    UPDATE_AVAILABLE_SIMULATIONS = 'UPDATE_AVAILABLE_SIMULATIONS',
    SET_LAST_SIMULATION_RUN = 'SET_LAST_SIMULATION_RUN',
    UPDATE_MESH_TASK_ID = 'UPDATE_MESH_TASK_ID',
    SET_MODEL_SIMULATIONS = 'SET_MODEL_SIMULATIONS',
    SET_HIDDEN_LAYERS = 'SET_HIDDEN_LAYERS',
    UPDATE_SURFACE_LAYERS = 'UPDATE_SURFACE_LAYERS',
    SET_SURFACE_LAYERS = 'SET_SURFACE_LAYERS',
    SET_MISSING_MATERIALS = 'SET_MISSING_MATERIALS',
    SET_USER_TOUCHED = 'SET_USER_TOUCHED',
}

type SimulationAction =
    | { type: ActionType.SET_SELECTED_SIMULATION; simulation: Simulation }
    | { type: ActionType.SET_ORIGINAL_SIMULATION; simulation: Simulation | null }
    | { type: ActionType.UPDATE_SELECTED_SIMULATION; simulation: Simulation | null }
    | { type: ActionType.SET_LAST_SIMULATION_RUN; simulationRun: SimulationRun }
    | { type: ActionType.UPDATE_MESH_TASK_ID; meshId: string | null }
    | { type: ActionType.SET_MODEL_SIMULATIONS; simulations: Simulation[] }
    | { type: ActionType.UPDATE_AVAILABLE_SIMULATIONS; simulation: Simulation }
    | { type: ActionType.SET_USER_TOUCHED; userTouched: boolean }
    | { type: ActionType.SET_HIDDEN_LAYERS; payload: HiddenLayer[] }
    | { type: ActionType.UPDATE_SURFACE_LAYERS; newSurfaceLayers: MaterialLayer[] }
    | {
    type: ActionType.SET_SURFACE_LAYERS;
    surfaceLayers: MaterialLayer[];
    simulation: Simulation | null;
}
    | { type: ActionType.SET_MISSING_MATERIALS; missingMaterials: MissingMaterialInfo[] }

type State = {
    lastSimRunDate: string | null;
    selectedSimulation: Simulation | null;
    originalSim: Simulation | null;
    availableSimulations: Simulation[] | [];
    surfaceLayers: MaterialLayer[];
    missingMaterials: MissingMaterialInfo[];
    hiddenLayers: HiddenLayer[];
    userTouched: boolean;
};

type SimulationProviderProps = { children: ReactNode };

type Dispatch = (action: SimulationAction) => void;

const SimulationContext = createContext<{ simulationState: State; dispatch: Dispatch } | undefined>(undefined);

const simulationReducer = (state: State, action: SimulationAction): State => {
    switch (action.type) {
        case ActionType.SET_SELECTED_SIMULATION: {
            const newSelectedSimulation = action.simulation;

            const userTouched = newSelectedSimulation.hasBeenEdited === null ? false : newSelectedSimulation.hasBeenEdited;
            window.debuggerSimSelected = newSelectedSimulation;

            return {
                ...state,
                userTouched,
                // @ts-ignore
                selectedSimulation: {...newSelectedSimulation},
                surfaceLayers: [],
            };
        }

        case ActionType.SET_ORIGINAL_SIMULATION: {
            return {
                ...state,
                originalSim: action.simulation,
            };
        }

        case ActionType.UPDATE_SELECTED_SIMULATION: {
            if (action.simulation) {
                const newAvailableSimulations = state.availableSimulations?.map((s) =>
                    s.id === action.simulation.id ? action.simulation : s
                );

                const sortedSimulations = newAvailableSimulations ? sortAndOrderSimulation(newAvailableSimulations) : null;

                window.debuggerSimSelected = action.simulation;
                return {
                    ...state,
                    availableSimulations: sortedSimulations,
                    userTouched: action.simulation.hasBeenEdited ? action.simulation.hasBeenEdited : false,
                    selectedSimulation: {...action.simulation},
                };
            } else {
                return {...state};
            }
        }

        case ActionType.SET_LAST_SIMULATION_RUN: {
            const newStatus = getStatusBySimulationRun(action.simulationRun);
            const newAvailableSimulations =
                state.availableSimulations?.map((s) =>
                    s.simulationRunId === action.simulationRun.id
                        ? {
                            ...s,
                            simulationRun: action.simulationRun,
                        }
                        : s
                ) || null;

            const updatedSimulation =
                state.selectedSimulation !== null && state.selectedSimulation.simulationRunId === action.simulationRun.id
                    ? {
                        ...state.selectedSimulation,
                        simulationRun: action.simulationRun,
                    }
                    : state.selectedSimulation;

            window.debuggerSimSelected = updatedSimulation;

            return {
                ...state,
                userTouched: newStatus === 2 || newStatus === 5 ? false : state.userTouched,
                availableSimulations: newAvailableSimulations,
                selectedSimulation: updatedSimulation,
            };
        }

        case ActionType.UPDATE_MESH_TASK_ID: {
            const updatedSimulation =
                state.selectedSimulation !== null
                    ? {
                        ...state.selectedSimulation,
                        meshId: action.meshId
                    }
                    : null;
            window.debuggerSimSelected = updatedSimulation;
            return {
                ...state,
                selectedSimulation: updatedSimulation,
            };
        }

        // This changes all the simulations for that particular model
        case ActionType.SET_MODEL_SIMULATIONS: {
            const sortedSimulations = sortAndOrderSimulation(action.simulations);
            const updatedSimulation = sortedSimulations.length === 0 ? null : state.selectedSimulation;
            window.debuggerSimSelected = updatedSimulation;
            return {
                ...state,
                availableSimulations: [...sortedSimulations],
                selectedSimulation: updatedSimulation,
            };
        }

        // This changes all the simulations for that particular model
        case ActionType.UPDATE_AVAILABLE_SIMULATIONS: {
            if (action.simulation) {
                const newAvailableSimulations = state.availableSimulations?.map((s) =>
                    s.id === action.simulation.id ? action.simulation : s
                );

                const sortedSimulations = newAvailableSimulations ? sortAndOrderSimulation(newAvailableSimulations) : null;

                const updatedSimulation =
                    state.selectedSimulation !== null && state.selectedSimulation.id === action.simulation.id
                        ? action.simulation
                        : state.selectedSimulation;
                window.debuggerSimSelected = updatedSimulation;

                return {
                    ...state,
                    availableSimulations: sortedSimulations,
                    selectedSimulation: updatedSimulation,
                };
            } else {
                return {...state};
            }
        }

        case ActionType.SET_HIDDEN_LAYERS: {
            return {
                ...state,
                hiddenLayers: action.payload,
            };
        }

        case ActionType.UPDATE_SURFACE_LAYERS: {
            return {
                ...state,
                surfaceLayers: [...action.newSurfaceLayers],
            };
        }

        case ActionType.SET_SURFACE_LAYERS: {
            const updatedSimulation = action.simulation ? {...action.simulation} : state.selectedSimulation;
            window.debuggerSimSelected = updatedSimulation;
            return {
                ...state,
                surfaceLayers: [...action.surfaceLayers],
                selectedSimulation: updatedSimulation,
            };
        }

        case ActionType.SET_MISSING_MATERIALS: {
            return {
                ...state,
                missingMaterials: action.missingMaterials,
            };
        }

        case ActionType.SET_USER_TOUCHED: {
            return {
                ...state,
                userTouched: action.userTouched,
            };
        }
    }
};

const SimulationProvider = ({children}: SimulationProviderProps) => {
    const {dispatch: editorDispatch} = useEditorContext();

    const {isModelLoaded} = useModelContext();
    const [simulationState, dispatch] = useReducer(simulationReducer, initialState);
    const getPointValidity = useGetPointValidity();
    const {pathname} = useLocation();

    useEffect(() => {
        // When a new simulation is loaded, we create sources, receivers and grid receivers points, only once.
        // These then get updated through hooks but are always referenced from the editor context.
        // The reason why we want these values to live in a context is because that is a shared state
        // but Hooks do not share state between the components using them.
        let selectedSimulation = simulationState.selectedSimulation;

        if (isModelLoaded && selectedSimulation) {
            // if page is Results or Auralizer, then set simulationRun as the selectedSimulation
            // if (pathname === '/results' || pathname === '/auralizer') {
            //   selectedSimulation = getSimFromLastSimRun(selectedSimulation) ?? selectedSimulation;
            // }

            const sources = mapToSources(selectedSimulation.sources);
            const receivers = mapToReceivers(selectedSimulation.receivers);

            // if page is Results or Auralizer, then set the sources/receivers without validating them
            if (pathname === '/results' || pathname === '/auralizer') {
                editorDispatch({
                    type: EditorActionType.SET_SOURCES,
                    sources,
                });

                editorDispatch({
                    type: EditorActionType.SET_RECEIVERS,
                    receivers: receivers,
                });
            }
        }
    }, [simulationState.selectedSimulation?.id, isModelLoaded, simulationState.userTouched, pathname]);

    useEffect(() => {
        let selectedSimulation = simulationState.selectedSimulation;

        // if page is Editor then validate the sources/receivers before setting them
        if (isModelLoaded && selectedSimulation && pathname === '/editor') {
            const sources = mapToSources(selectedSimulation.sources);
            const receivers = mapToReceivers(selectedSimulation.receivers);

            if (sources.length > 0) {
                validateSources(sources, selectedSimulation);
            } else {
                editorDispatch({
                    type: EditorActionType.SET_SOURCES,
                    sources: [],
                });
            }
            if (receivers.length > 0) {
                checkValidReceivers(receivers, sources, selectedSimulation);
            } else {
                editorDispatch({
                    type: EditorActionType.SET_RECEIVERS,
                    receivers: [],
                });
            }

            editorDispatch({
                type: EditorActionType.SET_TASK_TYPE,
                taskType: selectedSimulation.taskType || '',
            });
        }
    }, [
        isModelLoaded,
        simulationState.selectedSimulation?.id,
        simulationState.selectedSimulation?.taskType,
        simulationState.userTouched,
        pathname,
    ]);

    // Explanation of the setTimeout "hack": Javascript uses something called the "Event Loop".
    // There is a single thread that executes the code for each event as it occurs.
    // You can use setTimeout to make your Javascript code run in a future iteration of the loop.
    // One trick that some developers use to keep the UI responsive during a long-running Javascript task
    // is to periodically invoke code to be run with a timeout of zero.
    const checkValidReceivers = (receivers: Receiver[], sources: Source[] = [], sim: Simulation | null) => {
        const validatedReceivers = [...receivers];

        validatedReceivers.forEach((receiver: Receiver) => {
            setTimeout(async () => {
                // @ts-ignore
                const validationError = await getPointValidity(receiver.x, receiver.y, receiver.z, 'ReceiverPoint', sources);
                receiver.isValid = validationError === null;
                receiver.validationError = validationError || undefined;
            }, 0);

            editorDispatch({
                type: EditorActionType.SET_RECEIVERS,
                receivers: validatedReceivers,
            });
        });
    };

    const validateSources = (sources: Source[], sim: Simulation | null) => {
        const validatedSources = [...sources];

        validatedSources.forEach((source: Source) => {
            setTimeout(async () => {
                const validationError = await getPointValidity(
                    // @ts-ignore
                    source.x,
                    source.y,
                    source.z,
                    'SourcePoint',
                    undefined,
                    sim?.taskType
                );
                source.isValid = validationError === null;
                source.validationError = validationError || undefined;
            }, 0);

            editorDispatch({
                type: EditorActionType.SET_SOURCES,
                sources: validatedSources,
            });
        });
    };

    const value = {
        simulationState: {
            ...simulationState,
        },
        dispatch,
    };

    return <SimulationContext.Provider value={value}>{children}</SimulationContext.Provider>;
};

const useSimulationContext = () => {
    const context = useContext(SimulationContext);
    if (context === undefined) {
        throw new Error('useSimulationContext must be used within SimulationProvider');
    }
    return context;
};

export {SimulationProvider, useSimulationContext, ActionType};
