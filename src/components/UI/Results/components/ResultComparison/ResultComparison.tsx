import {MouseEventHandler, useEffect, useState} from 'react';
import {useSearchParams} from 'react-router-dom';

/** Hooks */
import {
    useGetLastSolveResultsBySimulationId,
    useGetSimulationById,
} from '@/hooks';

/** Components */
import {IconButton} from '@mui/material';
import {DownloadResults} from '../DownloadResults/DownloadResults';
import {SimulationForm} from './SimulationForm';

/** Types */
import {ModelInformation, SourceResults} from '@/types';
import {ResultComparisonState} from '../../types';

/** Reducer actions */
import {ActionType} from './constants';

/** Context */
import {ActionType as ResultsActionType, useResultsContext} from '../../context/ResultsContext';
import {useResultComparisonContext} from './context/ResultComparisonContext';

/** Styles */
import classes from './styles.module.scss';

type ResultComparison = {
    modelInformationData: ModelInformation;
    defaultState: ResultComparisonState | null;
    index: number;
    color: string;
    isSelected: boolean;
};
import {DeleteSweepOutlined} from "@mui/icons-material";

export const ResultComparison = ({
                                     color,
                                     defaultState,
                                     modelInformationData,
                                     index,
                                     isSelected,
                                 }: ResultComparison) => {
    const {allProjectsWithSims, dispatch: resultsDispatch} = useResultsContext();

    const [searchParams] = useSearchParams();

    const {dispatch, state} = useResultComparisonContext();


    // fetch the last solve result by a simulation id
    // once the user selects a simulation
    const [modelName, setModelName] = useState('');
    const [projectName, setProjectName] = useState('');
    const [simulationId, setSimulationId] = useState( '');

    const {data: newSimulationObject} = useGetSimulationById(`${simulationId}`, true);
    const {data: lastSolveResults, isLoading: loadingSolveResults} = useGetLastSolveResultsBySimulationId(
        `${simulationId}`
    );

    useEffect(() => {
        if (newSimulationObject) {
            dispatch({
                type: ActionType.SELECT_SIMULATION,
                payload: {
                    modelName,
                    projectName,
                    selectedSimulation: newSimulationObject,
                },
            });
        }
    }, [newSimulationObject]);


    useEffect(() => {
        if (index > 0 && defaultState) {
            console.log(defaultState)
            const {modelName, projectName, selectedSimulation} = defaultState;
            if (selectedSimulation) {
                setModelName(modelName);
                setProjectName(projectName);
                setSimulationId(selectedSimulation.id);
            }
        }
    }, [index, defaultState]);

    useEffect(() => {

        if (index === 0) {
            const paramSimulationId = searchParams.get('simulationId');
            if (allProjectsWithSims.length > 0 && paramSimulationId) {
                const project = allProjectsWithSims.find((x) => x.simulations.filter((y) => y.id === paramSimulationId));
                if (project) {
                    setModelName(project.modelName);
                    setProjectName(project.projectName);
                    setSimulationId(paramSimulationId);
                }
            }
        }

    }, [index, searchParams, allProjectsWithSims, modelInformationData]);

    useEffect(() => {
        if (lastSolveResults?.length) {
            dispatch({
                type: ActionType.UPDATE_SOLVE_RESULTS,
                payload: lastSolveResults,
            });
        }
    }, [lastSolveResults]);


    useEffect(() => {
        // when the simulation data gets updated we want to let the
        // parent know so the next child can copy the same state
        // Also we use this to let the plots know if the title changed
        if (state.simulationData !== null) {
            resultsDispatch({type: ResultsActionType.UPDATE_COMPARISON, update: {color, formState: state}});
        }
    }, [state.simulationData, state.title]);

    const removeComparison: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.stopPropagation();
        resultsDispatch({type: ResultsActionType.REMOVE_COMPARISON, color});
    };

    const handleSelect = () => {
        resultsDispatch({type: ResultsActionType.SET_SELECTED_COMPARISON_INDEX, selectedComparisonIndex: index});
    };



    return (
        <div className={classes.box_container} onClick={handleSelect}>
            <SimulationForm
                projectName={state.projectName}
                modelName={state.modelName}
                color={color}
            />
            <div>
                {state.simulationData?.selectedSourceObject ? (
                    <DownloadResults
                        selectedSimulation={state.selectedSimulation}
                        solveResultId={
                            (state.simulationData?.selectedSourceObject as SourceResults).responses?.[0]?.solveResultId
                        }
                        simulationId={state.simulationId}
                    />
                ) : null}
                {index > 0 ? (
                    <IconButton
                        onClick={removeComparison}
                        name="Remove comparison"
                    >
                        <DeleteSweepOutlined />
                    </IconButton>
                ) : null}
            </div>
        </div>
    )
};
