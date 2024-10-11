import {FC, useRef} from 'react';
import {Canvas} from '@react-three/fiber';

/**
 * Components
 * */
import {
    Grid,
    Model,
    PointContainer,
    ViewportControls
} from './components';

/**
 * Hooks
 * */
import {useObjectClickHandler, useClickMeshHandler} from '../../hooks';

/**
 * Context
 * */
import {ActionType, useEditorContext} from '@/context/EditorContext';
import {useModelContext} from '@/context/ModelContext';


/**
 * Constants
 * */
import {
    DEFAULT_GL_SETTINGS,
    DEFAULT_THREE_SCENE_SETTINGS,
    DEFAULT_CAMERA_SETTINGS
} from "@/constants";


export const Viewport: FC = () => {
    const {dispatch, selected, isInResultsMode, view3D} =
        useEditorContext();
    const {isModelLoaded} = useModelContext();

    const clickMeshHandler = useClickMeshHandler();

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleOutsideClick = () => {
        if (isInResultsMode) return;
        if (selected) {
            dispatch({
                type: ActionType.CLEAR_SELECTED,
            });
        }
    };

    const clickHandlerProps = useObjectClickHandler((event) => {
        if (event.object.type === 'Mesh') {
            clickMeshHandler(event.object);
        }
    }, !isInResultsMode);

    return (
        <Canvas
            gl={DEFAULT_GL_SETTINGS} // Props that go into the default webGL-renderer
            scene={DEFAULT_THREE_SCENE_SETTINGS} // Three.js scene settings
            camera={DEFAULT_CAMERA_SETTINGS}  // Props that go into the default camera
            frameloop="demand" // Render mode: always, demand, never
            id="viewport"
            ref={canvasRef}
        >
            <hemisphereLight
                name="Light"
                args={[0xffffff, 0xffffff, Math.PI]}
                position={[50, 0, 50]}
            />

            <Grid />

            {isModelLoaded && (
                <>
                    <group onPointerMissed={handleOutsideClick} {...clickHandlerProps}>
                        <Model view3D={view3D} selectedDetails={selected}/>
                        <PointContainer/>
                    </group>
                    <ViewportControls/>
                </>
            )}
        </Canvas>
    );
};
