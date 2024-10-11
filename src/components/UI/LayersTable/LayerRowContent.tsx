import {useEffect, useRef, useState} from 'react';

/** Context */
import {useSimulationContext} from '@/context/SimulationContext';
import {useMaterialPanelContext} from '@/components/UI/MaterialPanel';

/** Components */
import {MaterialNameCell} from './MaterialNameCell';
import {HideLayerCell} from './HideLayerCell';
import ArrowRightRoundedIcon from '@mui/icons-material/ArrowRightRounded';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import {IconButton, Tooltip} from "@mui/material";

/** Types */
import {MaterialLayer} from '@/types';

/** Hooks */
import {useHandleRowClick} from './hooks/useHandleRowClick';
import {useScrollIntoView} from './hooks/useScrollIntoView';

import classes from './classes.module.scss';

export const LayerRowContent = (
    {
        layer,
        parentLayer,
        layerChildren,
        toggleParentLayer,
        isChildOpen,
        isChildLayer = false
    }: {
        layer: MaterialLayer;
        parentLayer?: MaterialLayer;
        layerChildren?: MaterialLayer[];
        toggleParentLayer?: (event: React.MouseEvent<HTMLElement>) => void;
        isChildOpen?: boolean;
        isChildLayer?: boolean;
    }) => {
    const layerItem = useRef(null);

    const {
        simulationState: {hiddenLayers},
    } = useSimulationContext();
    const {selectedLayer, multiSelectedItemIds} = useMaterialPanelContext();
    const [isSelected, setIsSelected] = useState(false);
    const handleRowClick = useHandleRowClick();
    useScrollIntoView(layer, layerItem);

    useEffect(() => {
        setIsSelected(!!(selectedLayer?.id === layer.id || multiSelectedItemIds?.includes(layer.id) || (parentLayer && parentLayer.id === selectedLayer?.id)));
    }, [multiSelectedItemIds, selectedLayer]);

    useEffect(() => {
        if (layerItem.current && isSelected) {
            (layerItem.current as HTMLElement)?.focus();
        }
    }, [layerItem, isSelected]);

    return (
        <div
            ref={layerItem}
            className={`${classes.row} ${isSelected && classes.selected}`}
            onClick={(e) => handleRowClick(e, layer, layer.layerIndex)}>

            <div className={`${classes.cell} ${classes.col_1}`}>
                {!isChildLayer && layerChildren && layerChildren.length > 1 && (
                    <IconButton onClick={toggleParentLayer} tabIndex={-1}>
                        {isChildOpen ? <ArrowDropDownRoundedIcon/> : <ArrowRightRoundedIcon/>}
                    </IconButton>
                )}
            </div>
            <div className={`${classes.cell} ${classes.col_2}`}>
                {layer.textName.length >= 14 ? (
                    <Tooltip disableInteractive title={layer.textName}>
                        <p>{layer.textName}</p>
                    </Tooltip>
                ) : (
                    <p>{layer.textName}</p>
                )}
            </div>
            <MaterialNameCell
                layer={layer}
                isSelected={isSelected}
                index={isChildLayer ? layer.layerGroupIndex : layer.layerIndex}
                childIndex={isChildLayer ? layer.layerIndex : undefined}
            />
            <HideLayerCell
                layer={layer}
                parentLayer={parentLayer}
                isHidden={hiddenLayers.findIndex((x) => x.id === layer.id) > -1}
            />
        </div>
    );
};