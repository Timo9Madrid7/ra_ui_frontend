/** Context */
import {useSimulationContext} from '@/context/SimulationContext';

/** Components */
import {RunButton} from './RunButton';
import {ResultsButton} from './ResultsButton';

import styles from './styles.module.scss';
import {useEffect, useState} from 'react';
import dayjs from "dayjs";

export const ToolbarFooter = () => {
    const {
        simulationState: {selectedSimulation, lastSimRunDate, userTouched, originalSim},
    } = useSimulationContext();
    const [simStatus, setSimStatus] = useState<string | null>(null);

    useEffect(() => {
        setSimStatus(selectedSimulation?.status);
    }, [selectedSimulation?.status]);
    return (
        <div className={styles.footer_container}>
            <div className={styles.footer_dates}>
                {selectedSimulation?.createdAt && (
                    <p>Created at: <b>{dayjs(selectedSimulation?.createdAt).format('MMM DD, HH:mm')}</b></p>
                )}
                {lastSimRunDate && (
                    <p>Last run: {dayjs(lastSimRunDate).format('MMM DD, HH:mm')}</p>
                )}
            </div>
            <div className={styles.footer_buttons}>
                <div>
                    <ResultsButton
                        key={selectedSimulation?.id}
                        status={simStatus}
                        selectedSimulation={selectedSimulation}
                        originalSimulation={originalSim}
                        userTouched={userTouched}
                    />
                </div>
                <RunButton status={simStatus} simulation={selectedSimulation}/>
            </div>
        </div>
    );
};
