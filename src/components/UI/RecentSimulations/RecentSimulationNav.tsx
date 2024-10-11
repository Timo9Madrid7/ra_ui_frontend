import {useEffect, useMemo, useState} from 'react';
import {Link, useLocation, useParams, useSearchParams} from 'react-router-dom';
import { useTour } from '@reactour/tour'

/** Context */
import {useSimulationContext, ActionType} from '@/context/SimulationContext';

/** Hooks */
import {getSimulationRunById, useGetSimulationRunStatuses} from '@/hooks';
import {useGetAllProjectSimulations} from '@/components';

/** Components */
import {Badge, Drawer, IconButton} from '@mui/material';
import {RecentSimulationStatusDisplay} from './RecentSimulationStatusDisplay';
import {RecentSimulationsContent} from './RecentSimulationsContent';
import toast from 'react-hot-toast';
import ModelTrainingOutlinedIcon from '@mui/icons-material/ModelTrainingOutlined';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

/** Types */
import {RunStatus, SimulationRun, SimulationRunStatus, SourceStatus, Status, TaskStatus} from '@/types';

/** Utils */
import {useQueries} from '@tanstack/react-query';
import dayjs from 'dayjs';

import classes from './styles.module.scss';
import {SIMULATION_STATUS_1_In_PENDING} from "@/constants";

let hasLoadedOnce = false;

const isRunningStatus = (status: RunStatus) => {
    return [Status.InProgress, Status.Created, Status.ProcessingResults, Status.Queued].includes(status);
};
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

export const RecentSimulationNav = () => {
    const { setIsOpen } = useTour()
    const location = useLocation();
    const {
        simulationState: {selectedSimulation},
        dispatch,
    } = useSimulationContext();
    const routeParams = useParams();
    const [searchParams] = useSearchParams();
    const [isSidebarActive, setIsSidebarActive] = useState(false);

    function openSidebar() {
        setIsSidebarActive(true);
    }

    function closeSidebar() {
        setIsSidebarActive(false);
    }

    let {data: recentSimulations, isFetching: isFetchingTaskStatuses, refetch} = useGetSimulationRunStatuses(6);
    const {refetch: refetchAllProjectsSimulations} = useGetAllProjectSimulations(false);

    const [runningSimulations, setRunningsimulations] = useState<Array<SimulationRunStatus>>([]);
    const [latestSimRunStatus, setlatestSimRunStatus] = useState<SimulationRunStatus | null>(null);
    const [latestTaskRun, setlatestTaskRun] = useState<TaskStatus | null>(null);

    const [percentage, setPercentage] = useState<number>(0);

    useEffect(() => {
        if (selectedSimulation?.simulationRun && SIMULATION_STATUS_1_In_PENDING.includes(selectedSimulation?.status)) {
            refetch();
        }
    }, [selectedSimulation?.simulationRun, selectedSimulation?.status]);

    if (!isFetchingTaskStatuses && recentSimulations) {
        if (recentSimulations.length) {
            hasLoadedOnce = true;
        }
    }

    useEffect(() => {
        // every time route params change we close the recent simulation sidebar so it doesn't overlap the content
        setIsSidebarActive(false);
    }, [routeParams]);

    const currentModelId = useMemo(() => {
        if (location.pathname.includes('/editor')) {
            const {id: paramModelId = ''} = routeParams;
            const queryModelId = searchParams.get('mid') || '';

            return paramModelId || queryModelId;
        }
    }, [location.pathname]);

    // Map through all recent simulations that were previously running but are have now stopped running
    // Load the simulation run object for each of the completed ones to update in simulation context
    const completedSimulationRuns = useQueries({
        queries: recentSimulations?.length
            ? recentSimulations
                .filter(
                    (simRunStatus) =>
                        simRunStatus.status != null &&
                        !isRunningStatus(simRunStatus.status) &&
                        runningSimulations.findIndex((s) => s.id === simRunStatus.id) > -1
                )
                .map((simRunStatus) => {
                    return {
                        queryKey: ['simulationRun', simRunStatus.id],
                        queryFn: () => getSimulationRunById(simRunStatus.id),

                        onSuccess: (simRun: SimulationRun) => {
                            // Only trigger update if this is a simulation for current model
                            if (currentModelId === simRunStatus.modelId) {
                                dispatch({
                                    type: ActionType.SET_LAST_SIMULATION_RUN,
                                    simulationRun: simRun,
                                });
                            }

                            if (simRun.status === Status.Completed) {
                                if (location.pathname.includes('/results')) {
                                    refetchAllProjectsSimulations();
                                }

                                toast.success(
                                    <Link
                                        to={`/results?modelId=${simRunStatus.simulation.modelId}&simulationId=${simRunStatus.simulation.id}`}>
                                        <p>{`Simulation: ${simRunStatus.simulation.name}} completed! \n Click to see the results!`}</p>
                                    </Link>
                                );
                            }
                        },
                    };
                })
            : [],
    });

    const isFetchingCompletedSimulationRun = completedSimulationRuns.some((r) => r.isFetching);

    const getLatestTaskRun = (sources: SourceStatus[]): TaskStatus | null => {
        let latestTaskStatus: null | TaskStatus = null;

        sources.forEach((item) => {
            if (item.taskStatuses?.length) {
                // Sort the tasks for each source by completedAt
                item.taskStatuses?.sort(
                    (taskA: TaskStatus, taskB: TaskStatus) => dayjs(taskB.completedAt).unix() - dayjs(taskA.completedAt).unix()
                );

                // If the latestTaskStatus is not set or this source contains a later completedAt date we assign it
                if (
                    latestTaskStatus === null ||
                    dayjs(item.taskStatuses[0].completedAt).unix() > dayjs(latestTaskStatus.completedAt).unix()
                ) {
                    latestTaskStatus = item.taskStatuses[0];
                }
            }
        });

        return latestTaskStatus;
    };

    useEffect(() => {
        // We need to wait for the simulation run fetch to complete so we don't mess up the useQueries above
        if (!isFetchingCompletedSimulationRun) {
            const orderedSimulationsInProgress =
                recentSimulations
                    ?.filter((s) => s.status != null && s.sources?.length && isRunningStatus(s.status))
                    .sort((a, b) => +b.createdAt - +a.createdAt) || [];
            setRunningsimulations(orderedSimulationsInProgress);
            const latestSimRunStatus = orderedSimulationsInProgress.length ? orderedSimulationsInProgress[0] : null;

            setlatestSimRunStatus(latestSimRunStatus);


            // show 99% done before showing 100% processing results
            if (
                latestSimRunStatus &&
                latestSimRunStatus.status !== Status.ProcessingResults &&
                latestSimRunStatus.percentage == 100
            ) {
                setPercentage(99);
            } else {
                setPercentage(latestSimRunStatus?.percentage || 0);
            }

            const latestTaskRun = latestSimRunStatus ? getLatestTaskRun(latestSimRunStatus.sources!) : null;
            setlatestTaskRun(latestTaskRun);
        }
    }, [recentSimulations, isFetchingCompletedSimulationRun]);

    const handleChildClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
        e.stopPropagation();
    };


    return (
        <>
            {hasLoadedOnce && (
                <>
                    <div className={classes.recent_simulation_nav_container}>
                        <button onClick={openSidebar}
                                className={classes.recent_simulations_button}>

                            {latestSimRunStatus ? (
                                <Badge badgeContent={runningSimulations.length.toString()} color="primary"
                                       anchorOrigin={{
                                           vertical: 'top',
                                           horizontal: 'left',
                                       }}
                                >
                                    <ModelTrainingOutlinedIcon></ModelTrainingOutlinedIcon>
                                    <div
                                        className={classes.recent_simulation_nav}
                                        title={latestSimRunStatus.groupName + ' › ' + latestSimRunStatus.modelName}>
                                        <>
                                            {currentModelId && latestSimRunStatus.modelId === currentModelId ? (
                                                <p className={classes.simulation_name}>{latestSimRunStatus.simulationName}</p>
                                            ) : (
                                                <a
                                                    href={`/editor?modelId=${latestSimRunStatus.modelId}`}
                                                    onClick={handleChildClick}
                                                    title={'Go to ' + latestSimRunStatus.groupName + ' › ' + latestSimRunStatus.modelName}>
                                                    <p className={classes.simulation_name}>{latestSimRunStatus.simulationName}</p>
                                                </a>
                                            )}
                                        </>
                                        {(latestTaskRun || latestSimRunStatus.status == Status.Created) && (
                                            <RecentSimulationStatusDisplay
                                                simulationStatus={latestSimRunStatus.status || Status.Completed}
                                                taskStatus={latestTaskRun}
                                                percentage={percentage}
                                                timeEstimate={latestSimRunStatus.timeEstimate || null}
                                                startedAt={latestSimRunStatus.createdAt}
                                                completedAt={latestSimRunStatus.completedAt}
                                                parent="Nav"
                                            />
                                        )}
                                    </div>
                                </Badge>
                            ) : (
                                <>
                                    <ModelTrainingOutlinedIcon></ModelTrainingOutlinedIcon>
                                    <div className={classes.recent_simulation_nav} title="Open Recent Simulations">
                                        <h4>Recent Simulations</h4>
                                    </div>
                                </>
                            )}
                        </button>

                        <IconButton onClick={() =>setIsOpen(true)}>
                            <HelpOutlineIcon className={classes.blinking_button}/>
                        </IconButton>
                    </div>
                    <Drawer
                        open={isSidebarActive}
                        anchor="left"
                        onClose={closeSidebar}
                        PaperProps={{
                            style: {
                                position: 'absolute',
                                width: '360px',
                                background: '#dcf6f2',
                                boxShadow: '0px 6px 20px rgb(0 0 0 / 50%)',
                            },
                        }}
                        BackdropProps={{style: {position: 'absolute', backdropFilter: 'blur(5px)'}}}
                        ModalProps={{
                            container: document.getElementsByClassName('page-layout')[0],
                            style: {
                                position: 'fixed',
                                height: '100%',
                                width: '100%',
                            },
                            keepMounted: true,
                        }}
                        variant="temporary">
                        <RecentSimulationsContent/>
                        <IconButton className={classes.close_btn} aria-label="close" onClick={closeSidebar}>
                            <CloseRoundedIcon/>
                        </IconButton>
                    </Drawer>
                </>
            )}
        </>
    );
};
