import {
    BufferGeometry,
    Vector2,
    Vector3
} from 'three';

/**
 * Constants
 */
import {
    DEFAULT_AXES_COLOR,
    DEFAULT_GRID_AXES_COLOR
} from "@/constants";

/**
 * Setters
 * @param geometry
 */
const setXAxes = (geometry: BufferGeometry) => {
    geometry.setFromPoints([new Vector2(0, 0), new Vector2(50, 0)]);
};

const setYAxes = (geometry: BufferGeometry) => {
    geometry.setFromPoints([new Vector2(0, 0), new Vector2(0, 50)]);
};

const setZAxes = (geometry: BufferGeometry) => {
    geometry.setFromPoints([new Vector3(0, 0, 0), new Vector3(0, 0, 50)]);
};

export const Grid = () => {
    /* This is the small grid as 1*1 for */
    return (
        // position: offset for prevent flickering of the axesHelper
        <group position={new Vector3(-0.005, -0.005, -0.005)}>
            <gridHelper
                rotation-x={Math.PI / 2}
                args={[
                    100, // Size
                    100, // Divisions
                    DEFAULT_GRID_AXES_COLOR.XY_COORDINATE,
                    DEFAULT_GRID_AXES_COLOR.GRID_BOX
                ]}
                material-depthTest={false}
            />
            <gridHelper
                rotation-x={Math.PI / 2}
                args={[
                    100,
                    20,
                    DEFAULT_GRID_AXES_COLOR.XY_COORDINATE,
                    DEFAULT_GRID_AXES_COLOR.XY_COORDINATE
                ]}
                material-depthTest={false}
            />
            <group>
                <line>
                    <bufferGeometry attach="geometry" onUpdate={setXAxes}/>
                    <lineBasicMaterial attach="material" color={DEFAULT_AXES_COLOR.X}/>
                </line>
                <line>
                    <bufferGeometry attach="geometry" onUpdate={setYAxes}/>
                    <lineBasicMaterial attach="material" color={DEFAULT_AXES_COLOR.Y}/>
                </line>
                <line>
                    <bufferGeometry attach="geometry" onUpdate={setZAxes}/>
                    <lineBasicMaterial attach="material" color={DEFAULT_AXES_COLOR.Z}/>
                </line>
            </group>
        </group>
    );
};
