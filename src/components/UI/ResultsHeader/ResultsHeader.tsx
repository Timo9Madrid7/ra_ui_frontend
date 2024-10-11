import {useState} from 'react';
import {ActionType, useEditorContext} from '@/context/EditorContext';

/**
 * Components
 * */
import {Button} from "@mui/material";


/**
 * Assets
 * */
import styles from './styles.module.scss';
import DoorSlidingOutlinedIcon from '@mui/icons-material/DoorSlidingOutlined';
import SsidChartOutlinedIcon from '@mui/icons-material/SsidChartOutlined';

/**
 * Types
 * */
import {ResultsView} from '@/context/EditorContext/types';

export const ResultsHeader = () => {
    const {dispatch} = useEditorContext();
    const [mode, setMode] = useState(1);

    /**
     * Handler: setter for result view
     * dispatch an action in editor context
     *
     * @param {string} selection The button value that is selected
     */
    const handleClick = (selection: string) => {
        if (Object.values(ResultsView).includes(selection as ResultsView)) {
            dispatch({
                type: ActionType.SET_RESULTS_VIEW,
                payload: selection as ResultsView,
            });
        }
    };

    return (
        <div className={styles.mode_container}>
            <Button
                color={'secondary'}
                startIcon={<SsidChartOutlinedIcon/>}
                className={mode ? '' : styles.active}
                onClick={(e) => {

                    // @ts-expect-error: The event always comes with value
                    if (e.target.value !== ResultsView.ResultsReportView) {
                        handleClick(ResultsView.ResultsReportView);
                        setMode(0);
                    }
                }}>
                Result view only
            </Button>

            <Button
                className={mode ? styles.active : ''}
                startIcon={<DoorSlidingOutlinedIcon/>}
                color={'secondary'}
                onClick={(e) => {
                    // @ts-expect-error: The event always comes with value
                    if (e.target.value !== ResultsView.ResultsModelView) {
                        handleClick(ResultsView.ResultsModelView);
                        setMode(1);
                    }
                }}>
                Result vs. Model
            </Button>
        </div>
    );
};
