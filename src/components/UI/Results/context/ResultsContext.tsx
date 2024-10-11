import {useReducer, createContext, useContext, ReactNode, useEffect, useState} from 'react';
import {NewComparion, ProjectSimulationsDto, ResultComparison} from '../types';
import {MAX_COMPARISONS, comparisonsColors} from '../constants';

/** Hooks */
import {useGetAllProjectSimulations} from '../hooks/useGetAllProjectSimulations';

type ResultsProviderProps = { children: ReactNode; isInResultsMode?: boolean };

enum ActionType {
    SET_SELECTED_COMPARISON_INDEX = 'SET_SELECTED_COMPARISON_INDEX',
    ADD_COMPARISON = 'ADD_COMPARISON',
    REMOVE_COMPARISON = 'REMOVE_COMPARISON',
    UPDATE_COMPARISON = 'UPDATE_COMPARISON',
    RESET_STATE = 'RESET_STATE',
    SET_SURFACE_RECEIVERS_IS_INTERPOLATED = 'SET_SURFACE_RECEIVERS_IS_INTERPOLATED',
    SET_SURFACE_RECEIVERS_PARAMETER = 'SET_SURFACE_RECEIVERS_PARAMETER',
    SET_SURFACE_RECEIVERS_FREQUENCY = 'SET_SURFACE_RECEIVERS_FREQUENCY',
    SET_SURFACE_RECEIVERS_NC_CURVE = 'SET_SURFACE_RECEIVERS_NC_CURVE',
}

type ResultsContextAction =
    | { type: ActionType.RESET_STATE }
    | { type: ActionType.SET_SELECTED_COMPARISON_INDEX; selectedComparisonIndex: number }
    | { type: ActionType.ADD_COMPARISON; newComparison: NewComparion }
    | { type: ActionType.REMOVE_COMPARISON; color: string }
    | { type: ActionType.UPDATE_COMPARISON; update: ResultComparison }
    | { type: ActionType.SET_SURFACE_RECEIVERS_IS_INTERPOLATED; isInterpolated: boolean }
    | { type: ActionType.SET_SURFACE_RECEIVERS_PARAMETER; parameter: string | null }
    | { type: ActionType.SET_SURFACE_RECEIVERS_FREQUENCY; frequency: string | null }
    | { type: ActionType.SET_SURFACE_RECEIVERS_NC_CURVE; payload: string | null };

type State = {
    selectedComparisonIndex: number;
    availableComparisons: ResultComparison[];
    surfaceReceiversIsInterpolated: boolean;
    surfaceReceiversSelectedParameter: string | null;
    surfaceReceiversSelectedFrequency: string | null;
    surfaceReceiversSelectedNcCurve: string | null;
    dispatch: (action: ResultsContextAction) => void;
    allProjectsWithSims: ProjectSimulationsDto[];
};

const initialState: State = {
    selectedComparisonIndex: 0,
    availableComparisons: [{color: comparisonsColors[0], formState: null, additionalColor: comparisonsColors}],
    surfaceReceiversIsInterpolated: true,
    surfaceReceiversSelectedParameter: null,
    surfaceReceiversSelectedFrequency: null,
    surfaceReceiversSelectedNcCurve: null,
    dispatch: () => {
    },
    allProjectsWithSims: [] as ProjectSimulationsDto[],
};

const ResultsContext = createContext(initialState);

const resultsReducer = (state: State, action: ResultsContextAction): State => {
    switch (action.type) {
        case ActionType.RESET_STATE: {
            return {
                ...initialState,
            };
        }

        case ActionType.SET_SURFACE_RECEIVERS_IS_INTERPOLATED: {
            return {
                ...state,
                surfaceReceiversIsInterpolated: action.isInterpolated,
            };
        }

        case ActionType.SET_SURFACE_RECEIVERS_FREQUENCY: {
            return {
                ...state,
                surfaceReceiversSelectedFrequency: action.frequency,
            };
        }

        case ActionType.SET_SURFACE_RECEIVERS_PARAMETER: {
            return {
                ...state,
                surfaceReceiversSelectedParameter: action.parameter,
            };
        }

        case ActionType.SET_SURFACE_RECEIVERS_NC_CURVE: {
            return {
                ...state,
                surfaceReceiversSelectedNcCurve: action.payload,
            };
        }

        case ActionType.SET_SELECTED_COMPARISON_INDEX: {
            return {
                ...state,
                selectedComparisonIndex: action.selectedComparisonIndex,
            };
        }

        case ActionType.ADD_COMPARISON: {
            const {selectedSimulation, modelName, projectName} = action.newComparison;
            const index = state.availableComparisons.length;

            // There can only be max 6 comparisons
            if (index < MAX_COMPARISONS) {
                const colorsInUse = state.availableComparisons.map((comp) => comp.color);
                const nextColor = comparisonsColors.filter((color) => !colorsInUse.includes(color));

                const newComparison: ResultComparison = {
                    color: nextColor[0],
                    formState: {
                        simulationId: selectedSimulation.id,
                        selectedSimulation: selectedSimulation,
                        resultType: '',
                        title: selectedSimulation.name,
                        modelName,
                        projectName,
                    },
                    additionalColor: comparisonsColors.slice(1)
                };
                return {
                    ...state,
                    availableComparisons: [...state.availableComparisons, newComparison],
                    selectedComparisonIndex: state.availableComparisons.length,
                };
            }
            return {...state}
        }

        case ActionType.REMOVE_COMPARISON: {
            // @ts-ignore do not know why this isn't working
            const color = action.color;
            const newComparisons = [...state.availableComparisons];
            const deletedComparisonIndex = newComparisons.findIndex((comp) => comp.color === color);
            if (deletedComparisonIndex > -1) {
                newComparisons.splice(deletedComparisonIndex, 1);
            }

            return {
                ...state,
                availableComparisons: newComparisons,
                selectedComparisonIndex:
                    state.selectedComparisonIndex === deletedComparisonIndex
                        ? 0
                        : state.selectedComparisonIndex > deletedComparisonIndex
                            ? state.selectedComparisonIndex - 1
                            : state.selectedComparisonIndex,
            };
        }

        case ActionType.UPDATE_COMPARISON: {

            const {color, formState} = action.update;
            const index = state.availableComparisons.findIndex((comp) => comp.color === color);
            if (index !== -1) {
                const newComparisons = [...state.availableComparisons];
                newComparisons[index] = {
                    color,
                    formState,
                    additionalColor: comparisonsColors
                };

                return {
                    ...state,
                    availableComparisons: [...newComparisons],
                };
            }
            break

        }

        default: {
            throw new Error(`Unhandled action type: ${action.type}`);
        }
    }
};

const ResultsProvider = ({children, isInResultsMode}: ResultsProviderProps) => {
    const [state, dispatch] = useReducer(resultsReducer, initialState);
    const [allProjectsWithSims, setAllProjectsWithSims] = useState<ProjectSimulationsDto[]>([] as ProjectSimulationsDto[]);

    // Not triggered on render, but only when entering results mode
    const {data: allProjectSimulations, refetch} = useGetAllProjectSimulations(false);

    useEffect(() => {
        if (allProjectSimulations && allProjectSimulations.length > 0) {
            getAllSimulations(allProjectSimulations);
        }
    }, [allProjectSimulations]);

    useEffect(() => {
        if (isInResultsMode) {
            refetch();
        }
    }, [isInResultsMode, refetch]);

    const getAllSimulations = async (allProjectSimulations: ProjectSimulationsDto[]) => {
        const orderedProjects = [...allProjectSimulations];
        orderedProjects.sort((projectSimA: ProjectSimulationsDto, projectSimB: ProjectSimulationsDto) => {
            const groupNameA = projectSimA.group.toLowerCase();
            const groupNameB = projectSimB.group.toLowerCase();
            return groupNameA < groupNameB ? -1 : groupNameA > groupNameB ? 1 : 0;
        });
        orderedProjects.forEach((project) => {
            if (project.simulations.length > 0)
                project.simulations = project.simulations.filter(sim => sim.simulationRun != null).sort((simA, simB) => {
                    return new Date(simB.createdAt) > new Date(simA.createdAt) ? 1 : -1;
                });
        });
        setAllProjectsWithSims(orderedProjects.filter((project) => project.simulations.length > 0));
    };

    const value = {...state, allProjectsWithSims, dispatch};

    return <ResultsContext.Provider value={value}>{children}</ResultsContext.Provider>;
};

// Custom Context hook to easily access the state and dispatch actions
const useResultsContext = () => {
    const context = useContext(ResultsContext);
    if (context === undefined) {
        throw new Error('useResultsContext must be used within ResultsProvider');
    }
    return context;
};

export {ResultsProvider, useResultsContext, ActionType};
