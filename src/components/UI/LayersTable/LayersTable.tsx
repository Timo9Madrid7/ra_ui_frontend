/** Hooks */
import {useEffect} from 'react';
import {useCreateSurfaceLayers} from '@/context/hooks/useCreateSurfaceLayers';
import {useGetMissingMaterialInfo} from '@/hooks';

/** Context */
import {useAppContext} from '@/context/AppContext';
import {useSimulationContext, ActionType} from '@/context/SimulationContext';
import {useModelContext} from '@/context/ModelContext';

/** Components */
import {LayerRow} from './LayerRow';

/** Types */
import {MaterialLayer} from '@/types';

/** styles */
import classes from './classes.module.scss';

// TODO: change this to Material Settings component
export const LayersTable = () => {
    const {
        appState: {filteredMaterials},
    } = useAppContext();
    const {
        simulationState: {surfaceLayers, selectedSimulation},
        dispatch,
    } = useSimulationContext();


    const {currentModel3dLayerGroups} = useModelContext();
    const {mutate: getMissingMaterialInfo} = useGetMissingMaterialInfo();
    const createSurfaceLayers = useCreateSurfaceLayers();


    useEffect(() => {
        if (
            currentModel3dLayerGroups?.length &&
            surfaceLayers &&
            surfaceLayers.length === 0 &&
            filteredMaterials.length > 0
        ) {
            const missingMaterialIds = Object.values(selectedSimulation?.layerIdByMaterialId || {}).filter(
                (materialId) => !filteredMaterials.some((m) => m.id === materialId)
            );

            const missingMaterialIdsWithoutDuplicates = [...new Set(missingMaterialIds)];
            if (missingMaterialIdsWithoutDuplicates.length > 0) {
                getMissingMaterialInfo(missingMaterialIdsWithoutDuplicates, {
                    onSuccess: (data) => {
                        const {newLayers, newSimulation} = createSurfaceLayers(
                            currentModel3dLayerGroups,
                            selectedSimulation,
                            filteredMaterials,
                            data
                        );

                        dispatch({
                            type: ActionType.SET_SURFACE_LAYERS,
                            simulation: newSimulation,
                            surfaceLayers: newLayers,
                        });
                        dispatch({
                            type: ActionType.SET_MISSING_MATERIALS,
                            missingMaterials: data,
                        });
                    },
                });

            } else {
                const {newLayers, newSimulation} = createSurfaceLayers(
                    currentModel3dLayerGroups,
                    selectedSimulation,
                    filteredMaterials,
                    []
                );

                dispatch({
                    type: ActionType.SET_SURFACE_LAYERS,
                    simulation: newSimulation,
                    surfaceLayers: newLayers,
                });
                dispatch({
                    type: ActionType.SET_MISSING_MATERIALS,
                    missingMaterials: [],
                });
            }
        }
    }, [surfaceLayers, selectedSimulation?.id, currentModel3dLayerGroups, filteredMaterials]);


    return (
        <div className={classes.layers_container}>
            <div className={classes.head}>
                <div className={`${classes.cell} ${classes.col_1}`}></div>
                <div className={`${classes.cell} ${classes.col_2}`}>Layer</div>
                <div className={`${classes.cell} ${classes.col_3}`}>Material</div>
                <div className={`${classes.cell} ${classes.col_4}`}>View</div>
            </div>
            <ul>
                {surfaceLayers?.map((layer: MaterialLayer) => (
                    <LayerRow key={layer.id} layer={layer}/>
                ))}
            </ul>
        </div>
    );
};
