import {BufferGeometry, Color, EdgesGeometry, LineBasicMaterial, LineSegments, Mesh, MeshStandardMaterial} from "three";
import {View3DType} from "@/context";
import {View3D} from "@/enums";
import {useEffect} from "react";

type Model3DLayerProps = {
    layer: Mesh<BufferGeometry, MeshStandardMaterial>;
    isSelected: boolean;
    isHidden: boolean;
    view3D: View3DType;
    color: string;
    onRendered?: () => void;
};

const lineBasic = new LineBasicMaterial({
    color: 0x1a1a1a,
    linewidth: 1,
    opacity: 1,
    transparent: true,
});


export const ModelLayer: React.FC<Model3DLayerProps> = (
    {
        layer,
        isSelected,
        isHidden,
        view3D,
        color,
        onRendered
    }) => {
    lineBasic.color.set(new Color(0x5a5a5a));

    let opacity = 0.5,
        transparent = true,
        depthWrite = false;

    if (view3D === View3D.SHADED) {
        depthWrite = true;

        opacity = 0.8;
    } else if (view3D === View3D.WIREFRAME) {
        opacity = 0.1;
        lineBasic.color.set(new Color(0xd3c743));
    }

    useEffect(() => {
        const geo = new EdgesGeometry(layer.geometry);
        const wireframe = new LineSegments(geo, lineBasic);

        layer.add(wireframe);

        if (onRendered) {
            onRendered();
        }
    }, []);
    return !isHidden ? (
        <primitive
            object={layer}
            material-opacity={opacity}
            material-transparent={transparent}
            material-depthWrite={depthWrite}
            material-color={isSelected ? '#5ff562' : color}
            material-emissive={isSelected ? '#70d946' : 0x000000}
            visible={!isHidden}
            renderOrder={5}
        />
    ) : null;
};