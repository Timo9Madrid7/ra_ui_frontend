import {useEffect, useState} from 'react';
import {useSimulationContext} from '@/context/SimulationContext';
import {Tooltip} from '@mui/material';
/** Images */
import AutoModeOutlinedIcon from "@mui/icons-material/AutoModeOutlined";
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';

import './styles.scss';
import {Status} from "@/types";

export const RunSimulationBadge = ({status}: { status: string | null }) => {
    const [title, setTitle] = useState('');
    const [icon, setIcon] = useState(<></>);
    const {
        simulationState: {userTouched},
    } = useSimulationContext();


    useEffect(() => {
        switch (status) {
            case Status.Queued:
            case Status.InProgress:
            case Status.ProcessingResults:
                // running
                setIcon(<AutoModeOutlinedIcon className={'purple'}/>);
                setTitle('In progress');
                break;
            case Status.Completed:
                // completed
                setIcon(<CheckCircleOutlinedIcon className={'success'}/>);
                setTitle('Completed');
                break;

            case Status.Cancelled:
                // cancelled
                setIcon(<CancelOutlinedIcon className={'warning'}/>);
                setTitle('Cancelled');
                break;
            case Status.Error:
                // error
                setIcon(<ReportProblemOutlinedIcon className={'danger'}/>);
                setTitle('Error');
                break;

        }
    }, [status, userTouched]);

    return (
        <>
            {status != Status.Created && (
                <Tooltip title={title}>
                    <div className={'icon'}>
                        {icon}
                    </div>
                </Tooltip>
            )}
        </>
    );
};
