import dayjs from "dayjs";
import {useNavigate} from 'react-router-dom';

/**
 *
 * Components
 * */
import {
    ActionsMenu,
    DefaultButton
} from '@/components';

/**
 *
 * Hooks
 * */
import {useGetSimulationsByModelId} from '@/hooks';


/**
 *
 * Assets
 * */
import classes from '../classes.module.scss';
import EditCalendarOutlinedIcon from '@mui/icons-material/EditCalendarOutlined';
import ModelTrainingOutlinedIcon from '@mui/icons-material/ModelTrainingOutlined';
import ArchitectureIcon from '@mui/icons-material/Architecture';

/**
 *
 * Types
 */
import {
    Action,
    Model
} from '@/types';

export const ProjectModel = (
    {
        id,
        model,
        thumbnail,
        modelActions,
    }: {
        id: number;
        model: Model;
        thumbnail: string;
        modelActions: Action[];
    }) => {

    // fetch all simulations for a given model
    const {data: simulations = [], isFetching} = useGetSimulationsByModelId(model.id);

    const navigate = useNavigate();
    const onOpen = () => {
        navigate(`/editor?modelId=${id}`, {
            state: {
                modelId: id,
            },
        });
    };


    return (
        <div className={classes.model_container}>
            <img
                src={thumbnail}
                className={classes.thumbnail}
            />
            <>
                <div className={classes.model_name}>{model.name}</div>
                <div className={classes.row}>
                    <div className={classes.model_info}>
                        <div className={classes.icon_info}>
                            <ModelTrainingOutlinedIcon/>
                            <div>Contains <b>{(!isFetching && `${simulations.length} ${simulations.length > 1 ? 'simulations' : 'simulation'}`)}</b>
                            </div>
                        </div>
                        <div className={classes.icon_info}>
                            <EditCalendarOutlinedIcon/>
                            <div>Created in <b>{dayjs(model.createdAt).format('MMM DD')}</b></div>
                        </div>
                        <div className={`${classes.icon_info} ${model.hasGeo ? classes.contain: classes.missing}`}>
                            <ArchitectureIcon/>
                            <div>{model.hasGeo ? 'Contains ': 'Missing '} .geo file</div>
                        </div>
                    </div>
                    <div className={classes.actions}>
                        <ActionsMenu
                            id={id}
                            title="Model actions"
                            actions={modelActions}
                        />
                        <DefaultButton
                            label="Open model"
                            onClick={onOpen}
                        />
                    </div>
                </div>
            </>
        </div>
    );
};
