import {useState, useEffect} from 'react';

/** Context */
import {useSimulationContext} from '@/context/SimulationContext';
import {
    useMaterialPanelContext,
    ActionType as LibraryActionType
} from '@/components/UI/MaterialPanel';

/** Types */
import {Material} from '@/types';
/** Components */

/** Hooks */
import {useAssignNewMaterial} from '../hooks/useAssignNewMaterial';


import classes from '../classes.module.scss'
import {Done} from "@mui/icons-material";
import {EMPTY_MATERIAL_ID} from "@/constants";

export const MaterialRow = (
    {
        material,
        index,
        categoryIndex,
    }: {
        material: Material;
        index: number;
        categoryIndex: number;
    }) => {
    const [isAssigned, setIsAssigned] = useState(false);
    const [isHighlighted, setIsHighlighted] = useState(false);
    const {
        simulationState: {selectedSimulation},
    } = useSimulationContext();
    const {selectedMaterial, selectedLayer, multiSelectedItemIds, highlightedMaterialId, previouslyAssignedMaterial} =
        useMaterialPanelContext();

    const assignNewMaterial = useAssignNewMaterial();

    const {dispatch: dispatch} = useMaterialPanelContext();

    useEffect(() => {
        if (highlightedMaterialId === material.id) {
            setIsHighlighted(true);
        } else if (highlightedMaterialId === null || highlightedMaterialId === EMPTY_MATERIAL_ID) {
            // if the layer has Unattached material
            // check if there is a previously assigned material
            if (previouslyAssignedMaterial?.id === material.id) {
                setIsHighlighted(true);
                // if not pick the topmost material
            } else if (!previouslyAssignedMaterial && index === 0 && categoryIndex === 0) {
                setIsHighlighted(true);
            } else {
                setIsHighlighted(false);
            }
        } else {
            setIsHighlighted(false);
        }
    }, [highlightedMaterialId, previouslyAssignedMaterial, selectedLayer]);

    useEffect(() => {
        if (selectedMaterial && selectedMaterial.id === material.id) {
            setIsAssigned(true);
        } else {
            setIsAssigned(false);
        }
    }, [selectedMaterial, selectedLayer]);

    const assignMaterial = async () => {
        const selectedLayers = multiSelectedItemIds.length > 0
            ? multiSelectedItemIds
            : selectedLayer && [selectedLayer.id];
        if (selectedLayers) {
            await assignNewMaterial(selectedSimulation, material, selectedLayers);
        }
    };

    return (
        <>
            <li
                onDoubleClick={assignMaterial}
                onClick={() => {
                    dispatch({
                        type: LibraryActionType.SET_HIGHLIGHTED_MATERIAL,
                        highlightedMaterialId: material.id,
                    })
                }}
                title='Double click to assign or click on assign button!'
                className={`${classes.material_row} ${isHighlighted ? classes.selected : ''}`}
            >

                <div className={classes.name_with_plot}>
                    <div className={classes.plot}>
                        {material.absorptionCoefficients.map(
                            // @ts-expect-error: it comes with value always
                            (singleAbs: number, index: number) => {
                                const ab = Math.floor(singleAbs * 16);
                                return (
                                    <svg key={index} height="10" className={classes.circle}>
                                        <circle
                                            r="1.3"
                                            stroke="black"
                                            fill="none"
                                            cx="1.5"
                                            cy={10 - (ab + 0.5)}
                                            strokeWidth="1"/>
                                    </svg>
                                );
                            })}
                    </div>
                    <p className={classes.material_name}>{material.name}</p>

                </div>
                <div className={classes.action}>
                    {isAssigned ? (
                        <Done color='action'/>
                    ) : (
                        <button
                            onClick={assignMaterial}>
                            Assign
                        </button>
                    )}
                </div>
            </li>

        </>
    );
};
