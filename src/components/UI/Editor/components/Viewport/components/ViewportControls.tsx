import {GizmoHelper, GizmoViewport, Html, OrbitControls, TransformControls} from '@react-three/drei';
import {useThree} from '@react-three/fiber';
import {useRef} from 'react';

/** Context */
import {useEditorContext} from '@/context/EditorContext';

/** Hooks */
import {useReceivers} from '@/components';
import {useSources} from '@/components';


/** Styles */
import styles from './styles.module.scss';
import {DEFAULT_AXES_COLOR} from "@/constants";


export const ViewportControls = () => {

    const controlRef = useRef<any>();

    const transformControlRef = useRef<any>();

    const {selected, sources, receivers} = useEditorContext();

    const {scene} = useThree();


    const {handleSourceCoordinateChange} = useSources();
    const {handleReceiverCoordinateChange} = useReceivers();

    const selectedPointId =
        selected &&
        (selected.type === 'ReceiverPoint' || selected.type === 'SourcePoint')
            ? selected.id
            : null;
    const pointIndex = selectedPointId
        ? selected!.type === 'SourcePoint'
            ? sources.findIndex((s) => s.id === selectedPointId)
            : receivers.findIndex((r) => r.id === selectedPointId)
        : null;

    return (
        <>
            <OrbitControls
                ref={controlRef}
                makeDefault={true}
                minPolarAngle={0}
                maxPolarAngle={Math.PI}
                dampingFactor={0.25}
            />
            {selectedPointId && (
                <TransformControls
                    ref={transformControlRef}
                    object={scene.getObjectByProperty('uuid', selectedPointId)}
                    size={0.325}
                    mode={'translate'}
                    matrixAutoUpdate={false}
                    onMouseUp={(e) => {
                        if (pointIndex != null && transformControlRef.current) {
                            const {positionStart, offset} = transformControlRef.current;
                            if (selected!.type === 'SourcePoint') {
                                handleSourceCoordinateChange(
                                    pointIndex,
                                    +(positionStart.x + offset.x).toFixed(2),
                                    +(positionStart.y + offset.y).toFixed(2),
                                    +(positionStart.z + offset.z).toFixed(2)
                                );
                            } else if (selected!.type === 'ReceiverPoint') {
                                handleReceiverCoordinateChange(
                                    pointIndex,
                                    +(positionStart.x + offset.x).toFixed(2),
                                    +(positionStart.y + offset.y).toFixed(2),
                                    +(positionStart.z + offset.z).toFixed(2)
                                );
                            }
                            transformControlRef.current.offset.set(0, 0, 0);
                        }
                    }}
                />
            )}
            <GizmoHelper alignment="top-right" onTarget={() => controlRef.current.target}>
                <GizmoViewport
                    scale={25}
                    axisColors={[DEFAULT_AXES_COLOR.X, DEFAULT_AXES_COLOR.Y, DEFAULT_AXES_COLOR.Z]}/>
                <Html className={styles.gizmo_viewport}>
                    Grid size: 1x1 m
                </Html>
            </GizmoHelper>
        </>
    );
};
