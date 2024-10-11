import {useEffect, useState} from 'react';

/**
 * Context
 * */
import {useAppContext} from '@/context/AppContext';

/**
 * Types
 * */
import {Material} from '@/types';

/**
 * Assets
 * */
import classes from '../classes.module.scss';

import {EMPTY_MATERIAL_ID, FREQUENCIES} from '@/constants';

export const MaterialDetails = ({materialId}: { materialId: string }) => {
    const {
        appState: {filteredMaterials},
    } = useAppContext();

    const [material, setMaterial] = useState<Material | undefined>(undefined);

    useEffect(() => {
        if (materialId && filteredMaterials) {
            setMaterial(
                filteredMaterials.find((material) => material.id === materialId)
            );
        }
    }, [materialId, filteredMaterials]);

    return (
        <>
            {(materialId && materialId != EMPTY_MATERIAL_ID) && (
                <div className={classes.material_details}>
                    <div className={classes.header}>
                        <h4>Material Details</h4>
                    </div>
                    <table className={classes.details_table}>
                        <tbody>
                        <tr>
                            <th>freq</th>
                            {FREQUENCIES.map((frequency: string) => (
                                <th key={frequency}>{frequency}</th>
                            ))}
                        </tr>
                        {(material?.absorptionCoefficients && material?.absorptionCoefficients.length > 0) && (
                            <tr>
                                <th>abs</th>
                                {material?.absorptionCoefficients.map(
                                    (absorptionCoefficient: number | undefined, index: number) => (
                                        <td key={index}>{absorptionCoefficient}</td>
                                    )
                                )}
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
};
