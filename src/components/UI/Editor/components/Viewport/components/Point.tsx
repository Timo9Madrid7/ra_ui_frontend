import {useFrame} from '@react-three/fiber';
import {FC, useEffect, useRef, useState} from 'react';
import {ArrowHelper, Color, DynamicDrawUsage, Euler, MathUtils, Texture, TextureLoader, Vector3} from 'three';

/** Hooks */
import {useObjectClickHandler, useCreatePointLabel} from '../../../hooks';

/** Images for the points in the viewport: sources and receivers  */
import roundImageUrl from '@/assets//images/round.png';
import roundSelectedImageUrl from '@/assets/images/round_selected.png';

/** Types */
import {SourceParams, ValidationError} from '@/context/EditorContext/types';
import {EMPTY_MATERIAL_ID} from "@/constants";

const pointTexture = new TextureLoader().load(roundImageUrl);
const pointSelectedTexture = new TextureLoader().load(roundSelectedImageUrl);
const arrowColor = new Color('rgb(5,5,5)');
const arrowLengthScale = 0.075;

type ArrowProps = {
    azimuth: number;
    elevation: number;
};
const Arrow: FC<ArrowProps> = ({azimuth, elevation}) => {
    const arrowHelperRef = useRef<ArrowHelper>(null!);
    const [rotation, setRotation] = useState(new Euler());

    useEffect(() => {
        const aroundZ = MathUtils.degToRad(azimuth - 90);
        const aroundX = MathUtils.degToRad(elevation);
        const eulerRot = new Euler(aroundX, 0, aroundZ, 'ZXY');
        setRotation(eulerRot);
    }, [azimuth, elevation]);

    useFrame(({camera}) => {
        const currentDistance = camera.position.distanceTo(arrowHelperRef.current.position);
        const arrowLength = currentDistance * arrowLengthScale;
        arrowHelperRef.current.setLength(arrowLength, undefined, arrowLength * 0.1);
        arrowHelperRef.current.setRotationFromEuler(rotation);
    });

    return <arrowHelper ref={arrowHelperRef} args={[new Vector3(0, 1, 0), undefined, 0, arrowColor]}/>;
};

type PointProps = {
    id: string;
    index: number;
    type: 'SourcePoint' | 'ReceiverPoint';
    x: number;
    y: number;
    z: number;
    defaultSize?: number;
    defaultTexture?: Texture;
    params?: SourceParams;
    isSelected?: boolean;
    inEditor?: boolean;
    validationError?: ValidationError;
    onSelect?: (id: string, type: 'SourcePoint' | 'ReceiverPoint') => void;
};
export const Point: FC<PointProps> = (
    {
        id,
        index,
        type,
        x,
        y,
        z,
        defaultSize = 12,
        defaultTexture = pointTexture,
        params,
        isSelected = false,
        inEditor = false,
        validationError,
        onSelect,
    }) => {
    const handleClick = onSelect ? () => onSelect(id, type) : undefined;
    const clickHandlerProps = useObjectClickHandler(handleClick, onSelect && !isSelected && inEditor);

    const pointLabel = useCreatePointLabel(
        (index + 1).toString(),
        type,
        validationError,
        defaultSize > 12 ? 17 : undefined,
        defaultSize > 12 ? -1.7 : undefined
    );

    return (
        <points
            uuid={id}
            name={type}
            position={new Vector3(x, y, z)}
            {...clickHandlerProps}
            renderOrder={!isSelected ? 0 : !inEditor ? 10 : 0}>
            <primitive object={pointLabel} renderOrder={!isSelected ? 0 : !inEditor ? 10 : 0}></primitive>

            <bufferGeometry attach="geometry">
                <bufferAttribute
                    attach="attributes-position"
                    count={1}
                    array={new Float32Array([0, 0, 0])}
                    itemSize={3}
                    usage={DynamicDrawUsage}
                />
            </bufferGeometry>
            <pointsMaterial
                attach="material"
                map={!isSelected ? defaultTexture : pointSelectedTexture}
                color={validationError ? '#f84400' : type === 'SourcePoint' ? 'purple' : 'darkOrange'}
                size={!isSelected ? defaultSize : 17.5}
                sizeAttenuation={false}
                alphaTest={0.2}
                transparent={true}
            />
            {validationError === ValidationError.CloseToSurface && (
                <mesh type="Sphere">
                    <sphereGeometry
                        args={[
                            type === 'SourcePoint' ? 0.5 : 0.1,
                            type === 'SourcePoint' ? 16 : 12,
                            type === 'SourcePoint' ? 16 : 12,
                        ]}
                    />
                    <meshStandardMaterial color={0xf84400} depthTest={false} opacity={0.3} transparent={true}/>
                </mesh>
            )}
            {validationError === ValidationError.CloseToSource && (
                <mesh type="Sphere">
                    <sphereGeometry args={[0.5, 12, 12]}/>
                    <meshStandardMaterial color={0xf84400} depthTest={false} opacity={0.3} transparent={true}/>
                </mesh>
            )}
            {isSelected &&
                params &&
                params.directivityPattern !== EMPTY_MATERIAL_ID &&
                params.directivityPattern !== EMPTY_MATERIAL_ID &&
                <Arrow azimuth={params.azimuth} elevation={params.elevation}/>}
        </points>
    );
};