/** Types */
import {Material, MaterialLayer, Simulation} from '@/types';
import {ModelLayerGroup} from '../ModelContext/types';

import {
    EMPTY_MATERIAL_NAME
} from "@/constants";

/** Hooks */
import {useUpdateObjMats} from './useUdateObjMats';
import {MissingMaterialInfo} from '@/hooks';

/** Utils */
import {getLayerMaterialName} from '../utils';

export const useCreateSurfaceLayers = () => {
    const updateObjMats = useUpdateObjMats();

    const createSurfaceLayers = (
        layers: ModelLayerGroup[] | null,
        simulation: Simulation | null,
        materials: Material[],
        missingMaterials: MissingMaterialInfo[]
    ) => {
        if (!simulation?.layerIdByMaterialId || !layers?.length || !materials.length) {
            return {newLayers: [], newSimulation: simulation};
        }

        const undefinedIndex = materials.findIndex((material) => material.name === EMPTY_MATERIAL_NAME);

        const newLayers: MaterialLayer[] = [];
        let newObjMats = {...simulation?.layerIdByMaterialId};

        layers.forEach((layer, layerGroupIndex) => {
            const parentLayer: MaterialLayer = {
                id: layer.id,
                layerIndex: layerGroupIndex,
                type: 'LayerGroup',
                name: layer.name,
                textName: layer.name,
                children: [],
                isMissingMaterial: false,
                parentId: null,
                layerGroupIndex: layerGroupIndex,
            };

            let sameMat = true;

            layer.children.forEach((surface, childIndex) => {
                const objectId = surface.userData.attributes.id;
                const matIndex = materials.findIndex((material) => material.id == simulation?.layerIdByMaterialId[objectId]);

                let missingMatIndex =
                    matIndex < 0 && missingMaterials.length
                        ? missingMaterials.findIndex((material) => material.materialId == simulation?.layerIdByMaterialId[objectId])
                        : -1;

                let mat: Material;

                if (missingMatIndex >= 0) {
                    mat = {
                        // Not sure what to set the rest of the properties to so we default to Unattached
                        ...materials[undefinedIndex],
                        name: missingMaterials[missingMatIndex].materialName,
                        id: missingMaterials[missingMatIndex].materialId,
                        isDeleted: missingMaterials[missingMatIndex].isDeleted,
                        isSharedWithOrganization: missingMaterials[missingMatIndex].isSharedWithOrganization,
                    };
                } else if (matIndex == undefinedIndex || matIndex < 0) {
                    mat = materials[undefinedIndex];
                } else {
                    mat = materials[matIndex];
                }

                // Check if all children have the same material
                if (childIndex > 0 && sameMat && mat.id !== parentLayer.children[childIndex - 1].materialId) {
                    sameMat = false;
                }


                const childLayer: MaterialLayer = {
                    id: objectId,
                    layerIndex: childIndex,
                    name: surface.name,
                    type: surface.type,
                    children: [],
                    materialId: mat.id,
                    materialName: getLayerMaterialName(missingMatIndex >= 0, mat),
                    textName: '~ Surface [' + (childIndex + 1) + ']',
                    isMissingMaterial: missingMatIndex >= 0,
                    parentId: layer.id,
                    layerGroupIndex: layerGroupIndex,
                };

                parentLayer.children.push(childLayer);
                newObjMats = updateObjMats(newObjMats, [childLayer.id], mat.id);
            });

            parentLayer.materialId = sameMat ? parentLayer.children[0].materialId : null;
            parentLayer.materialName = sameMat ? parentLayer.children[0].materialName : '- multiple -';
            parentLayer.isMissingMaterial = sameMat ? parentLayer.children[0].isMissingMaterial : false;

            newLayers.push(parentLayer);
        });

        const newSimulation: Simulation = {
            ...simulation,
            layerIdByMaterialId: newObjMats,
        };

        return {newLayers, newSimulation};
    };

    return createSurfaceLayers;
};
