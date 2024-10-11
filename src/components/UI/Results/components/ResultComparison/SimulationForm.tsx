import {ChangeEventHandler, FC} from 'react';

/** Context */
import {useResultComparisonContext} from './context/ResultComparisonContext';

/** Reducer actions */
import {ActionType} from './constants';

/** Contants */
import {ResultComparisonLabels} from './constants';

/** Types */
import {Select} from '@/components';
/** Styles */
import classes from './styles.module.scss';
import {Divider, FormControl, InputAdornment, TextField} from "@mui/material";
import ModelTrainingOutlinedIcon from "@mui/icons-material/ModelTrainingOutlined";
import {SubdirectoryArrowRightRounded} from "@mui/icons-material";
import GraphicEqOutlinedIcon from "@mui/icons-material/GraphicEqOutlined";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";

interface SimulationForm {
    color: string;
    projectName: string;
    modelName: string;
}



export const SimulationForm: FC<SimulationForm> = ({color, projectName, modelName}) => {
    const {dispatch, state} = useResultComparisonContext();

    const {
        title,
        availableSources,
        sourcePointId,
        availableReceivers,
        receiverPointIds,
        selectedSimulation,
    } = state;

    const handleSelectFormControlChange = (value: string) => {
        if (value) {
            dispatch({
                type: ActionType.SELECT_SOURCE,
                payload: value,
            });
        }
    };

    const handleReceiversChanged = (value: string) => {
        dispatch({
            type: ActionType.SELECT_RECEIVERS,
            payload: value,
        });
    };

    const handleTextFieldFormControlChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event) => {
        const {value, name} = event?.target;

        switch (name) {
            case ResultComparisonLabels.LABEL:
                dispatch({type: ActionType.UPDATE_LABEL, payload: value});
                return;
        }
    };

    return (
        <form>
            <div className={classes.info_container}>
                <h4>Simulation info</h4>
                <div className={classes.selected_sim_info}>
                    <div className={classes.info_icon}>
                        <FolderOutlinedIcon color='error'/>
                        <span>{projectName}</span>
                    </div>
                    <div className={classes.indent}>
                        <div className={classes.info_icon}>
                            <SubdirectoryArrowRightRounded/>
                            <GraphicEqOutlinedIcon color='error'/>
                            <span>{modelName}</span>
                        </div>
                        <div className={classes.indent}>
                            <div className={classes.info_icon}>
                                <SubdirectoryArrowRightRounded/>
                                <ModelTrainingOutlinedIcon color='error'/>
                                <span>{selectedSimulation?.name}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Divider />
            <div className={classes.sources_select}>
                <FormControl fullWidth>
                    <TextField
                        name={ResultComparisonLabels.LABEL}
                        label={ResultComparisonLabels.LABEL}
                        value={title}
                        onChange={handleTextFieldFormControlChange}
                        InputProps={
                            color
                                ? {
                                    startAdornment: (
                                        <InputAdornment position="start" style={{marginRight: 0}}>
                                            <div className={classes.comparison_color}
                                                 style={{backgroundColor: color}}></div>
                                        </InputAdornment>
                                    ),
                                }
                                : undefined
                        }
                    />
                </FormControl>
                <div className={classes.comparison_form_fields}>

                    <Select
                        disabled={!sourcePointId}
                        value={sourcePointId || ''}
                        setValue={handleSelectFormControlChange}
                        label={ResultComparisonLabels.SOURCE}
                        items={availableSources}
                        className={classes.font_sm}
                    />

                    <Select
                        disabled={!sourcePointId}
                        value={receiverPointIds || ''}
                        setValue={handleReceiversChanged}
                        label={ResultComparisonLabels.RECEIVERS}
                        className={classes.font_sm}
                        items={availableReceivers}
                    />
                </div>
            </div>
        </form>
    );
};
