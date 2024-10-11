/** Context */
import {ActionType, useSimulationContext} from '@/context/SimulationContext';

/** Types */
import {MaterialLayer} from '@/types';
import {SyntheticEvent} from 'react';
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {Tooltip} from "@mui/material";

import classes from './classes.module.scss';

export const HideLayerCell = (
    {
        layer,
        isHidden,
        parentLayer,
    }: {
        layer: MaterialLayer;
        isHidden: boolean;
        parentLayer?: MaterialLayer;
    }) => {
    const {
        dispatch,
        simulationState: {hiddenLayers},
    } = useSimulationContext();

    const handleToggleHidden = (isHidden: boolean) => {
        let newHiddenLayers = [...hiddenLayers];
        if (isHidden) {
            newHiddenLayers.push({type: layer.type as 'Layer' | 'LayerGroup' | 'Mesh', id: layer.id});
            if (layer.type === 'LayerGroup') {
                // If parent was hidden then we add all child layers as hidden
                layer.children.forEach((childLayer) => {
                    if (newHiddenLayers.findIndex((x) => x.id === childLayer.id) === -1) {
                        newHiddenLayers.push({type: 'Layer', id: childLayer.id});
                    }
                });
            } else if (parentLayer?.children.every((x) => newHiddenLayers.findIndex((l) => l.id === x.id) > -1)) {
                // If child layer was hidden then we check if all children are hidden and then add the parent
                newHiddenLayers.push({type: 'LayerGroup', id: layer.parentId as string});
            }
        } else {
            newHiddenLayers = newHiddenLayers.filter((x) => x.id !== layer.id);
            if (layer.type === 'LayerGroup') {
                // If parent was "unhidden" we make sure all children are unhidden as well
                newHiddenLayers = newHiddenLayers.filter((x) => !layer.children.map((x) => x.id).includes(x.id));
            } else {
                // If child was "unhidden" we make sure the parent is no longer marked as hidden
                newHiddenLayers = newHiddenLayers.filter((x) => x.id !== layer.parentId);
            }
        }

        dispatch({
            type: ActionType.SET_HIDDEN_LAYERS,
            payload: newHiddenLayers,
        });
    };

    const toggleVisibility = (event: SyntheticEvent) => {
        event.stopPropagation();
        handleToggleHidden(!isHidden);
    };

    return (
        <div className={`${classes.cell} ${classes.col_4}`}>
            <Tooltip placement={'right'} title={isHidden ? 'Show' : 'Hide'}>
                <div onClick={toggleVisibility}>
                    {isHidden
                        ? <VisibilityOffOutlinedIcon color={'action'} fontSize={'small'}/>
                        : <VisibilityOutlinedIcon fontSize={'small'}/>
                    }
                </div>
            </Tooltip>
        </div>
    );
};
