import {Box} from '@mui/material';

import {RecentSimulationStatus} from './RecentSimulationStatus';
import ModelTrainingOutlinedIcon from '@mui/icons-material/ModelTrainingOutlined';
import {Loading} from '@/components'
import {useGetSimulationRunStatuses} from '@/hooks';

import {SimulationRunStatus} from '@/types';

/** Styles */
import classes from './styles.module.scss';

let hasLoadedOnce = false;


export const RecentSimulationsContent = () => {
    const {data: recentSimulations, isFetching: isFetchingTaskStatuses} = useGetSimulationRunStatuses(6);

    if (!isFetchingTaskStatuses && recentSimulations) {
        hasLoadedOnce = true;
    }

    return (
        <div className={classes.recent_simulations_container}>
            {isFetchingTaskStatuses && !hasLoadedOnce ? (
                <div>
                    <Loading/>
                </div>
            ) : (
                <>
                    <h4 className={classes.recent_simulations_header}>
        <Box
            component="div"
            display={'flex'}
            alignItems={'center'}
            justifyContent={'space-between'}
            gap={1}
        >
            <ModelTrainingOutlinedIcon/> <span>Recent Simulations</span>
        </Box>
    </h4>
                    <div className={classes.recent_simulations_list}>
                        {recentSimulations && hasLoadedOnce && (
                            <>
                                {recentSimulations.length > 0 ? (
                                    recentSimulations
                                        .map((simulationRunStatus: SimulationRunStatus) => (
                                        <RecentSimulationStatus
                                            key={simulationRunStatus.id}
                                            simulationRunStatus={simulationRunStatus}/>
                                    ))
                                ) : (
                                    <Box component="div" padding={'16px 20px 20px 20px'}>
                                        There are no recent simulations
                                    </Box>
                                )}
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};
