import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import dayjs from 'dayjs';

/** Components */
import {RecentSimulationStatusDisplay} from './RecentSimulationStatusDisplay';

/** Types */
import {SimulationRunStatus, TaskStatus, Status} from '@/types';

/** Styles */
import classes from './styles.module.scss';
import {Tooltip} from "@mui/material";
import InsertChartOutlinedSharpIcon from "@mui/icons-material/InsertChartOutlinedSharp";

interface RecentSimulationStatusProps {
    simulationRunStatus: SimulationRunStatus;
}

export const RecentSimulationStatus = ({simulationRunStatus}: RecentSimulationStatusProps) => {
    const [latestTaskRun, setlatestTaskRun] = useState<TaskStatus | null>(null);
    const [status, setStatus] = useState<string>(Status.Completed);
    const [percentage, setPercentage] = useState<number>(0);

    const setStatusFunc = (sim: any) => {
        setStatus(sim.status);

        if (
            sim.status === Status.InProgress ||
            sim.status === Status.Created ||
            sim.status === Status.ProcessingResults ||
            sim.status === Status.Queued
        ) {
            setPercentage(sim.percentage);
            // show 99% done before showing 100% processing results
            if (sim.status !== Status.ProcessingResults && sim.percentage == 100) setPercentage(99);
        }
    };

    const getLatestTaskRun = (sources: any[]) => {
        sources.map((item) => {
            item.taskStatuses.sort(
                (taskA: TaskStatus, taskB: TaskStatus) => dayjs(taskB.completedAt).unix() - dayjs(taskA.completedAt).unix()
            )[0];
        });
        let latestTaskStatus = sources.length ? sources[0].taskStatuses[0] : '';

        sources.forEach((source) => {
            if (
                source.taskStatuses[0] &&
                dayjs(source.taskStatuses[0].completedAt).unix() > dayjs(latestTaskStatus.completedAt).unix()
            )
                latestTaskStatus = source.taskStatuses[0];
        });

        return latestTaskStatus;
    };

    useEffect(() => {
        if (simulationRunStatus) {
            setStatusFunc(simulationRunStatus);
            const latestTaskRun = getLatestTaskRun([...(simulationRunStatus.sources || [])]);
            setlatestTaskRun(latestTaskRun);
        }
    }, [simulationRunStatus]);


    return (
        <div className={classes.recent_simulations_status}>
            <Link
                to={`/editor?modelId=${simulationRunStatus.simulation.modelId}&simulationId=${simulationRunStatus.simulation.id}`}
                title={
                    simulationRunStatus.simulation.model.projectTag +
                    ' › ' +
                    simulationRunStatus.simulation.model.modelName +
                    ' › ' +
                    simulationRunStatus.simulation.model.modelName
                }>
                <p className={classes.simulation_name}>
                    <span>{simulationRunStatus.simulation.model.projectName} › {simulationRunStatus.simulation.model.modelName} › </span>
                    {simulationRunStatus.simulation.name}
                </p>
            </Link>

            {(simulationRunStatus || status == Status.Created) && (
                <div className={classes.row}>
                    <RecentSimulationStatusDisplay
                        simulationStatus={status}
                        taskStatus={simulationRunStatus}
                        percentage={percentage}
                        parent="Sidebar"
                    />
                    {status == Status.Completed && (
                        <>
                            <div className={classes.button_container}>
                                <Tooltip title="Open results">
                                    <Link
                                        to={`/results?modelId=${simulationRunStatus.simulation.modelId}&simulationId=${simulationRunStatus.simulation.id}`}>
                                        <button className={classes.quick_btn}>
                                            <InsertChartOutlinedSharpIcon/>
                                        </button>
                                    </Link>
                                </Tooltip>
                            </div>
                        </>
                    )}
                </div>
            )
            }

        </div>
    )
        ;
};
