import {CircularProgress, DialogActions, DialogContent, LinearProgress,} from '@mui/material';
import {FC, useEffect, useRef, useState} from 'react';
import toast from 'react-hot-toast';

import {ConfirmationDialog, Dialog, startMeshTask, PrimaryButton, SuccessButton} from "@/components";
import {ActionType, useSimulationContext} from '@/context/SimulationContext';
import {useGetSimulationById} from '@/hooks';
import {
    useStartSolveTask,
    useGetSimulationRunStatusById
} from './hooks'

import {Simulation, SimulationRun, Status} from '@/types';
import {useMeshContext} from '@/context/MeshContext';
import {MeshContextActionType} from '@/enums'
import image from '@/assets/images/3d-model-thumb2.png'
import dayjs from "dayjs";
import classes from './classes.module.scss'
import {EMPTY_SIMULATION_RUN, SIMULATION_STATUS_1_In_PENDING} from "@/constants";


type SimulationRunDialogProps = {
    selectedSimulation: Simulation;
    activeSimulationRun: SimulationRun | null;
    onClose: () => void;
};

export const SimulationRunDialog: FC<SimulationRunDialogProps> = (
    {
        selectedSimulation,
        activeSimulationRun,
        onClose,
    }) => {
    const [simulationRunDetails, setSimulationRunDetails] = useState<SimulationRun | null>(
        activeSimulationRun != null
            ? activeSimulationRun
            : null
    );
    const {completedMeshTasks, dispatch: meshDispatch} = useMeshContext();
    const {dispatch} = useSimulationContext();

    const {data: newSimulationObject, refetch: refetchSimulation} = useGetSimulationById(selectedSimulation.id, false);

    const [confirmOverwrite, setConfirmOverwrite] = useState(false);
    const [confirmOverwriteDialog, setConfirmOverwriteDialog] = useState(false);
    const [send, setSend] = useState(false);
    const initialRender = useRef(true);
    const simulationInProgress = (status: Status) => {
        return SIMULATION_STATUS_1_In_PENDING.includes(status)
    };

    const {data: simulationRunStatus} = useGetSimulationRunStatusById(
        simulationRunDetails?.id || '',
        simulationRunDetails && simulationInProgress(simulationRunDetails?.status) || false,
        500
    );

    useEffect(() => {
        if (selectedSimulation?.status === Status.Completed) {
            setConfirmOverwrite(true);
        } else {
            setConfirmOverwrite(false);
        }
    }, [selectedSimulation]);


    useEffect(() => {
        if (simulationRunStatus) {
            setSimulationRunDetails(simulationRunStatus);
            if (!simulationInProgress(simulationRunStatus.status)) {
                refetchSimulation().then((response) => {
                    // TODO: you can not change the selected simulation whenever you want
                    // There might be a time that someone change the selected simulation while this is running! Fix this
                    dispatch({
                        type: ActionType.UPDATE_AVAILABLE_SIMULATIONS,
                        simulation: response.data
                    })
                    if (response.data?.simulationRun)
                        dispatch({
                            type: ActionType.SET_LAST_SIMULATION_RUN,
                            simulationRun: response.data?.simulationRun,
                        });
                })
            }
        }
    }, [simulationRunStatus]);


    const {mutate: startSolveTask} = useStartSolveTask();

    const createNewMesh = async (modelId: string) => {
        setSend(true)
        const meshTask = await startMeshTask(modelId);
        const newActiveMeshTasks = [
            ...completedMeshTasks,
            {
                id: meshTask.id,
            },
        ];
        meshDispatch({
            type: MeshContextActionType.SET_COMPLETED_MESH_TASKS,
            completedMeshTasks: newActiveMeshTasks,
        });


    };
    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
            if (!(completedMeshTasks && completedMeshTasks.length)) {
                createNewMesh(selectedSimulation?.modelId);
            }
            return;
        }
    })

    useEffect(() => {
        if (newSimulationObject?.simulationRun) {
            dispatch({
                type: ActionType.SET_LAST_SIMULATION_RUN,
                simulationRun: newSimulationObject.simulationRun,
            });
        }
    }, [newSimulationObject]);

    const handleStartSimulation = () => {
        // @ts-expect-error: minimum required attributes
        setSimulationRunDetails(EMPTY_SIMULATION_RUN);
        startSolveTask({
                simulationId: selectedSimulation.id
            },
            {
                onSuccess: (simulationRun) => {
                    if (simulationRun) {
                        setSimulationRunDetails(simulationRun);
                        refetchSimulation().then((response) => {
                            dispatch({
                                type: ActionType.UPDATE_AVAILABLE_SIMULATIONS,
                                simulation: response.data
                            })
                            dispatch({
                                type: ActionType.SET_LAST_SIMULATION_RUN,
                                simulationRun: simulationRun,
                            });
                        })
                    } else {
                        toast.error('There is an error coming from the method!');
                        throw 'Error';
                    }
                },
                onError: () => toast.error('Error running the simulation!'),
            }
        );
    };

    return (
        <>
            <Dialog
                fullWidth
                maxWidth={'sm'}
                open={true}
                title={'Simulation run management'}
                onClose={onClose}
            >
                <DialogContent>

                    <div className={classes.container}>
                        <h3>Simulation name: {selectedSimulation.name.toUpperCase()}</h3>
                        <h4> Running every simulation takes time from 1 minute to hours!</h4>
                        <p className={classes.note}> Currently we don't have any estimation process!</p>
                        <div className={classes.image_container}>
                            <img src={image}/>
                        </div>
                    </div>

                    {!simulationRunDetails ? (
                        <>
                            <p>Mesh status:</p>
                            <div className={classes.mesh_status}>
                                {completedMeshTasks && !completedMeshTasks.length ? (
                                    <>
                                        <CircularProgress size={15}/> <span> Creating Mesh...</span>
                                    </>
                                ) : <>Mesh has been created!</>
                                }
                            </div>
                        </>
                    ) : (
                        <div className={classes.running_container}>
                            <div className={classes.running_header}>
                                <p>Status: <strong>{simulationRunDetails.status}</strong></p>
                                <p>Progress: <strong>{simulationRunDetails.percentage}</strong> %</p>
                            </div>
                            <div className={classes.progress_container}>
                                <div className={classes.progress_bar}>
                                    <LinearProgress
                                        color="success"
                                        variant="determinate"
                                        value={simulationRunDetails.percentage || 0}/>
                                </div>
                            </div>
                            <div>
                                <p>Started at:
                                    <strong>
                                        {dayjs(simulationRunDetails.createdAt).format('MMM DD, HH:mm') || '--'}
                                    </strong>
                                </p>
                                <p>Completed at:
                                    <strong>
                                        {simulationRunDetails.completedAt
                                            ? dayjs(simulationRunDetails.completedAt).format('MMM DD, HH:mm')
                                            : '--'}
                                    </strong>
                                </p>
                            </div>
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <div></div>
                    <SuccessButton
                        className={classes.start_button}
                        disabled={!(completedMeshTasks && completedMeshTasks.length)}
                        label="Start Simulation"
                        onClick={() => (confirmOverwrite ? setConfirmOverwriteDialog(true) : handleStartSimulation())}
                        sx={{visibility: simulationRunDetails ? 'hidden' : undefined}}
                    />
                    {simulationRunDetails?.completedAt && !simulationInProgress(simulationRunDetails.status) && (
                        <PrimaryButton
                            className={classes.start_button}
                            label="Okay and Close"
                            onClick={onClose}
                        />
                    )}
                </DialogActions>
            </Dialog>


            {confirmOverwriteDialog && (
                <ConfirmationDialog
                    title="Confirm overwrite"
                    message={() => (
                        <> Are you sure you want to run this simulation <br/>
                            and overwrite previous results?
                        </>
                    )}
                    onConfirm={() => {
                        handleStartSimulation();
                        setConfirmOverwriteDialog(false);
                    }}
                    onCancel={() => setConfirmOverwriteDialog(false)}
                />
            )}
        </>
    );
};
