import {BufferGeometry, Mesh, MeshStandardMaterial, Object3D, DoubleSide, Material} from 'three';

/* Utils */
import {Rhino3dmLoader} from 'three/examples/jsm/loaders/3DMLoader';
// @ts-ignore
import rhino3dm from 'https://cdn.jsdelivr.net/npm/rhino3dm@7.15.0/rhino3dm.module.js';

/** Components */
import toast from 'react-hot-toast';

/** Types */
import {LayerUserAttribute, ModelFile, ModelLayerGroup} from './types';

export const parseModelAsObject3D = async (modelFile: ModelFile): Promise<Object3D> => {
    const loader = new Rhino3dmLoader();
    return new Promise((resolve, reject) => {
        loader.setLibraryPath(import.meta.env.VITE_WASM_LIB);
        loader.parse(
            modelFile.fileData,
            (model) => {
                resolve(model);
            },
            () => {
                reject(new Error('Could not parse 3D model'));
            }
        );
    });
};

export const parseModelAs3dmFile = async (fileData: ArrayBufferLike): Promise<any> => {
    const file3dm = rhino3dm().then((rhino: any) => {
        const arrayBuffer = new Uint8Array(fileData);
        const doc = rhino.File3dm.fromByteArray(arrayBuffer);
        doc.settings().pageUnitSystem = rhino.UnitSystem.Meters;
        return doc;

    });
    return file3dm;
};

export const createLayerGroupsFromModel = (model3d: Object3D): Array<ModelLayerGroup> => {
    const layers = model3d.userData['layers'] as Array<LayerUserAttribute>;
    const modelLayerGroups: Array<ModelLayerGroup> = [];

    layers
        .forEach((layer) => {
            const surfaces: Array<Mesh<BufferGeometry, MeshStandardMaterial>> = (model3d.children.filter(
                (x) => x.type === 'Mesh' && (layers[x.userData.attributes['layerIndex']]?.id ? layers[x.userData.attributes['layerIndex']].id === layer.id : true)
            ) || []) as Array<Mesh<BufferGeometry, MeshStandardMaterial>>;

            surfaces.forEach((s) => (s.name = 'Layer'));
            if (surfaces.length) {
                modelLayerGroups.push({
                    id: layer.id,
                    name: layer.name,
                    children: surfaces,
                });
            }
        });

    return modelLayerGroups;
};

export const setupAreaAndGroupIntByObjectId = (file3dm: any) => {

    const areaByObjectId: Record<string, number> = {};
    const groupIntegerByObjectId: Record<string, number> = {};

    return {
        areaByObjectId,
        groupIntegerByObjectId,
    };
};

export const getInnerAndOuterMeshes = (meshes: Mesh[]) => {
    const outerMeshes: Object3D[] = [];
    const innerMeshes: Object3D[] = [];

    meshes.forEach((mesh) => {
        (mesh.material as Material).side = DoubleSide;
        outerMeshes.push(mesh)
    });


    return {
        innerMeshes,
        outerMeshes,
    };
};