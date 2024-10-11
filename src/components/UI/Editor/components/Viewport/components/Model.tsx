/** Types */
import {SelectedDetails, View3DType} from '@/context/EditorContext/types';

/** Constants */
import {useThree} from "@react-three/fiber";
import {useAppContext, useModelContext, useSimulationContext} from "@/context";
import {ModelLayerGroup} from "./ModelLayerGroup.tsx";
import {MaterialCategoryColors} from "@/enums";
import {Material} from "@/types";

type Model3DProps = {
    view3D?: View3DType;
    selectedDetails?: SelectedDetails | null;
};


export const Model: React.FC<Model3DProps> = (
    {
        view3D,
        selectedDetails,
    }) => {
    useThree(({gl}) => {
        gl.setClearColor(0x676853);
        let g = gl.getContext();
        g.enable(g.BLEND);
        g.blendFunc(g.SRC_ALPHA, g.ONE_MINUS_SRC_ALPHA);
    });

    const {currentModel3dLayerGroups} = useModelContext();
    const {
        appState: {filteredMaterials},
    } = useAppContext();

    const {
        simulationState: {hiddenLayers, selectedSimulation},
    } = useSimulationContext();

    const layerColors = getLayerColors(selectedSimulation?.layerIdByMaterialId, filteredMaterials)
    const layerGroups = currentModel3dLayerGroups ?? []
    return (
        <group name="Geometry of the room">
            {layerGroups.map((layerGroup, i) => {
                return (
                    <ModelLayerGroup
                        key={layerGroup.id}
                        layerGroup={layerGroup}
                        view3D={view3D}
                        selectedDetails={selectedDetails}
                        hiddenLayers={hiddenLayers}
                        layerColors={layerColors}
                    />
                );
            })}
        </group>
    );
};


const getLayerColors = (
    materialIdByObjectId:
        | {
        [key: string]: number;
    }
        | undefined,
    materials: Material[]
) => {
    const layerColors: Record<string, string> = {};
    if (materialIdByObjectId) {
        Object.keys(materialIdByObjectId).forEach((objectId) => {
            const materialId = materialIdByObjectId[objectId];
            const material = materials.find((material) => material.id === materialId);
            if (material) {
                switch (material.category) {
                    case 'Carpet':
                        layerColors[objectId] = MaterialCategoryColors.Carpet;
                        break;
                    case 'Curtains':
                        layerColors[objectId] = MaterialCategoryColors.Curtains;
                        break;
                    case 'Natural materials':
                        layerColors[objectId] = MaterialCategoryColors.Natural;
                        break;
                    case 'Rigid':
                        layerColors[objectId] = MaterialCategoryColors.Rigid;
                        break;
                    case 'Other':
                        layerColors[objectId] = MaterialCategoryColors.Other;
                        break;
                    case 'Perforated panels':
                        layerColors[objectId] = MaterialCategoryColors.PerforatedPanels;
                        break;
                    case 'Furnishing':
                        layerColors[objectId] = MaterialCategoryColors.Furnishing;
                        break;
                    case 'Gypsum':
                        layerColors[objectId] = MaterialCategoryColors.Gypsum;
                        break;
                    case 'Porous':
                        layerColors[objectId] = MaterialCategoryColors.Porous;
                        break;

                    case 'Windows':
                        layerColors[objectId] = MaterialCategoryColors.Windows;
                        break;
                    case 'Wood':
                        layerColors[objectId] = MaterialCategoryColors.Wood;
                        break;
                    default:
                        layerColors[objectId] = MaterialCategoryColors.Default;
                        break;
                }
            }
        });
    }
    return layerColors;
};




