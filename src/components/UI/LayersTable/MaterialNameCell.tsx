/** Components */
import {Tooltip} from '@mui/material';

/** Context */
import {useAppContext} from '@/context/AppContext';
import {ActionType, useMaterialPanelContext} from '@/components/UI/MaterialPanel';

/** Types */
import {MaterialLayer} from '@/types';

/** Hooks */
import {useHandleRowClick} from './hooks/useHandleRowClick';
import {EMPTY_MATERIAL_NAME} from "@/constants";

const maxTextLength = 19;

import classes from './classes.module.scss';

export const MaterialNameCell = (
    {
        layer,
        isSelected,
        index,
        childIndex,
    }: {
        layer: MaterialLayer;
        isSelected: boolean;
        index: number;
        childIndex?: number;
    }) => {
    const {dispatch, isMaterialsLibraryOpen} = useMaterialPanelContext();
    const {
        appState: {filteredMaterials},
    } = useAppContext();
    const handleRowClick = useHandleRowClick();

    const openMaterials = (event: React.MouseEvent<HTMLDivElement>, layer: MaterialLayer) => {
        if (event.ctrlKey || event.metaKey || event.shiftKey) {
            return;
        }
        handleRowClick(event, layer, index, childIndex);
        // If the panel is already open and the user clicks on the same layer, close the panel
        const selectedMaterial = filteredMaterials.find((material) => material.id === layer?.materialId);
        dispatch({
            type: ActionType.SET_SELECTED_MATERIAL,
            material: selectedMaterial && selectedMaterial?.name !== EMPTY_MATERIAL_NAME ? selectedMaterial : null,
            highlightedMaterialId: selectedMaterial ? selectedMaterial.id : null,
        });

        if (!isMaterialsLibraryOpen) {
            dispatch({
                type: ActionType.SET_MATERIALS_PANEL_OPEN,
                isOpen: true,
            });
        }
    };

    const materialName = layer.materialName ?? '';

    return (
        <div
            onClick={(event) => openMaterials(event, layer)}
            className={`${classes.cell} ${classes.col_3}`}>
            {materialName.length >= maxTextLength ? (
                <Tooltip disableInteractive title={materialName}>
                    <p
                        className={`
                        ${(materialName === EMPTY_MATERIAL_NAME) && classes.danger} 
                        ${isSelected && 'selected'}
                        `}>{materialName}
                    </p>
                </Tooltip>
            ) : (
                <p
                    className={`
                        ${(materialName === EMPTY_MATERIAL_NAME) && classes.danger} 
                        ${isSelected && 'selected'}
                        `}>{materialName}
                </p>
            )}
        </div>
    );
};
