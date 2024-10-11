import {Material, MaterialLayer} from '@/types';
import {useSimulationContext} from '../SimulationContext';

export const useUpdateSurfaceLayers = () => {
    const {
        simulationState: {surfaceLayers},
    } = useSimulationContext();
    const updateSurfaceLayers = (selectedLayersIds: string[], material: Material) => {
        const newSurfaceLayers = [...surfaceLayers];

        selectedLayersIds.forEach((layerId) => {
            let currLayer = newSurfaceLayers.find((layer) => layerId === layer.id);

            let childLayer: MaterialLayer | undefined;

            if (currLayer === undefined) {
                newSurfaceLayers.forEach((layer) => {
                    layer.children.forEach((child) => {
                        if (child.id === layerId) {
                            currLayer = layer;
                            childLayer = child;
                        }
                    });
                });
            }

            let newCurrLayer: MaterialLayer = {} as MaterialLayer;

            if (currLayer?.children && childLayer === undefined) {
                newCurrLayer = {
                    ...currLayer,
                    materialId: material.id,
                    materialName: material.name,
                    isMissingMaterial: false,
                };
                newCurrLayer.children.forEach((child) => {
                    child.materialName = material.name;
                    child.materialId = material.id;
                    child.isMissingMaterial = false;
                });
            } else if (currLayer && childLayer) {
                currLayer.children[childLayer.layerIndex] = {
                    ...childLayer,
                    materialName: material.name,
                    materialId: material.id,
                    isMissingMaterial: false,
                };

                const hasSameMaterialName = currLayer.children.every(
                    (child) => child.materialName === currLayer?.children[0].materialName
                );

                newCurrLayer = {
                    ...currLayer,
                    materialName: hasSameMaterialName ? currLayer.materialName : '- multiple -',
                };
            }
            newSurfaceLayers[newCurrLayer.layerGroupIndex] = newCurrLayer;
        });

        return newSurfaceLayers;
    };

    return updateSurfaceLayers;
};
