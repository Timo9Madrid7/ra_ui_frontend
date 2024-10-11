import {ModelLayerGroup as ModelLayerGroupType, SelectedDetails, View3DType} from "@/context";
import {HiddenLayer} from "@/types";
import {View3D} from "@/enums";
import {ModelLayer} from "./ModelLayer.tsx";

type Model3dLayerGroupProps = {
    layerGroup: ModelLayerGroupType;
    hiddenLayers: HiddenLayer[];
    view3D?: View3DType;
    selectedDetails?: SelectedDetails | null;
    layerColors: Record<string, string>;
};
export const ModelLayerGroup: React.FC<Model3dLayerGroupProps> = (
    {
        layerGroup,
        view3D = View3D.SHADED,
        selectedDetails = null,
        hiddenLayers,
        layerColors,
    }) => {
    return (
        <group uuid={layerGroup.id} name={layerGroup.name}>
            {layerGroup.children.map((layer, i) => {
                const isSelected =
                    (selectedDetails?.type === 'LayerGroup' && selectedDetails.id === layerGroup.id) ||
                    (selectedDetails?.type === 'Layer' && selectedDetails.id === layer.userData.attributes.id);

                const isHidden =
                    hiddenLayers.findIndex((x) => x.id === layer.userData.attributes.id || x.id === layerGroup.id) > -1;

                const color = layerColors[layer.userData.attributes.id] ?? '#ffffff';
                return (
                    <ModelLayer
                        key={layer.uuid}
                        layer={layer}
                        color={color}
                        isSelected={isSelected}
                        isHidden={isHidden}
                        view3D={view3D}
                    />
                );
            })}
        </group>
    );
};