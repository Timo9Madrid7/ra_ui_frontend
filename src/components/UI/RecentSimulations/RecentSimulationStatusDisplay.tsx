import dayjs from 'dayjs';

/** Components */
import AutoModeOutlinedIcon from "@mui/icons-material/AutoModeOutlined";
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';

/** Styles */
import classes from './styles.module.scss';
import {Status} from "@/types";

interface RecentSimlationStatusDisplayProps {
    taskStatus?: any;
    simulationStatus?: string;
    percentage?: number;
    parent?: string;
}

export const RecentSimulationStatusDisplay = (
    {
        taskStatus,
        simulationStatus,
        percentage,
        parent,
    }: RecentSimlationStatusDisplayProps) => {

    return (
        <>
            <div className={classes.status}>
                {(!simulationStatus || simulationStatus === Status.Created) && (
                    <>
                        {parent !== 'Nav' && simulationStatus && <AutoModeOutlinedIcon/>}
                        <p className={classes.status_text}>
                            {!simulationStatus ? `Created` : `Started`}
                            {` `}
                            {dayjs(taskStatus.createdAt).format('MMM DD HH:mm')}
                        </p>
                    </>
                )}
                {simulationStatus === Status.Completed && (
                    <>
                        <CheckCircleOutlinedIcon/>
                        <p className={classes.status_text}>
                            Completed
                            <span title="Finished at">
                {` ${String.fromCharCode(183)} `}
                                {dayjs(taskStatus.completedAt).format('MMM DD HH:mm')}
              </span>
                        </p>
                    </>
                )}
                {(simulationStatus === Status.InProgress|| simulationStatus === Status.Queued) && (
                    <>
                        {parent !== 'Nav' && <AutoModeOutlinedIcon/>}
                        <span className={classes.status_percentage}>{`Progress: ${percentage}%`}</span>
                        <strong className={classes.status_percentage}>{`Status: ${simulationStatus}`}</strong>

                    </>
                )}
                {simulationStatus === Status.ProcessingResults && (
                    <>
                        {parent !== 'Nav' && <AutoModeOutlinedIcon/>}
                        <span className={classes.status_percentage}>{`${simulationStatus}`}</span>
                    </>
                )}
                {simulationStatus === 'Cancelled' && (
                    <>
                        <CancelOutlinedIcon/>
                        <p className={classes.status_text}>
                            Cancelled
                            <span title="Started at">
                {` ${String.fromCharCode(183)} `}
                                {dayjs(taskStatus.createdAt).format('MMM DD HH:mm')}
              </span>
                        </p>
                    </>
                )}
                {(simulationStatus === 'Error' || simulationStatus === 'TaskError') && (
                    <>
                        <ReportProblemOutlinedIcon/>
                        <p className={classes.status_text}>
                            Error
                            <span title="Started at">
                {` ${String.fromCharCode(183)} `}
                                {dayjs(taskStatus.createdAt).format('MMM DD HH:mm')}
              </span>
                        </p>
                    </>
                )}
            </div>
        </>
    );
};
