import {Object3D, Raycaster, Vector3} from 'three';

/** Types */
import {Source as SimSource, Receiver as SimReceiver} from '@/types';
import {Source, Receiver} from '@/context/EditorContext/types';

export const mapToSources = (sources: SimSource[]): Source[] => {
    const newSources: Source[] = [];
    if (sources) {
        sources
            .sort((a, b) => a.orderNumber - b.orderNumber)
            .forEach((s) => {
                newSources.push({
                        id: s.id,
                        label: s.label,
                        x: s.x,
                        y: s.y,
                        z: s.z,
                        isValid: true
                    }
                );
            });
    }

    return newSources;
};

export const mapToReceivers = (receivers: SimReceiver[]): Receiver[] => {
    let newReceivers: Receiver[] = [];

    if (receivers) {
        receivers
            .sort((a, b) => a.orderNumber - b.orderNumber)
            .forEach((r) => {
                newReceivers.push({
                    id: r.id,
                    label: r.label,
                    x: r.x,
                    y: r.y,
                    z: r.z,
                    isValid: true,
                });
            });
    }

    return newReceivers;
};

/** Point validation */

// setting vector in one direction, that is re-used for the point inside model and internal Volume check
// this needs to be in a fixed random direction that is very unlikely to be paralalle to a surface (hence the weird number)
const rayVector = new Vector3(0.9667941475489408, 0.24977617986410142, 0.05404568657731098);

export const isPointInsideModel = (point: Vector3, outerMeshes: Object3D[]) => {
    const raycaster = new Raycaster(point, rayVector);

    const intersects = raycaster.intersectObjects(outerMeshes, false);

    const result = intersects.length % 2 == 0 ? false : true;

    return result;
};

export const isPointInsideInternalVolume = (point: Vector3, innerMeshes: Object3D[]) => {
    const raycaster = new Raycaster(point, rayVector);

    const intersects = raycaster.intersectObjects(innerMeshes, false);

    const result = intersects.length % 2 == 0 ? false : true;

    return result;
};

/** Initialize 480 rays evenly in a sphere for proximity check */
let theta, phi;
const nSample = 480;
const sphericalRaysDirections: Vector3[] = [];

for (let i = 0; i < nSample; i++) {
    phi = Math.acos(-1 + (2 * i) / nSample);
    theta = Math.sqrt(nSample * Math.PI) * phi;
    const v = new Vector3().setFromSphericalCoords(1, phi, theta).normalize();
    sphericalRaysDirections.push(v);
}
// we set a ray that is re-used for the validiy, for speed-up
let ray = new Raycaster(new Vector3(0, 0, 0), new Vector3(0, 0, 0), 0.0, 0);

export const isPointInValidProximity = (point: Vector3, margin: number, meshes: Object3D[]) => {
    ray.far = margin;
    for (let i = 0; i < sphericalRaysDirections.length; i++) {
        ray.set(point, sphericalRaysDirections[i]);

        const intersects = ray.intersectObjects(meshes, false);

        if (intersects.length > 0) return false;
    }

    return true;
};

const sourceReceiverMargin = 0.51;
export const isPointCloseToSource = (point: Vector3, sources: Source[]) => {
    for (let source of sources) {
        if (source.x == null || source.y == null || source.z == null) {
            return false;
        }
        let distance = Math.sqrt(
            Math.pow(Math.abs(source.x - point.x), 2) +
            Math.pow(Math.abs(source.y - point.y), 2) +
            Math.pow(Math.abs(source.z - point.z), 2)
        );
        if (distance < sourceReceiverMargin) {
            return true;
        }
    }
    return false;
};

const directionsMediumSimple = [
    new Vector3(1, 0, 0),
    new Vector3(0, 1, 0),
    new Vector3(0, 0, 1),
    new Vector3(-1, 0, 0),
    new Vector3(0, -1, 0),
    new Vector3(0, 0, -1),
    new Vector3(1, 1, 1).normalize(),
    new Vector3(-1, 1, 1).normalize(),
    new Vector3(1, -1, 1).normalize(),
    new Vector3(-1, -1, 1).normalize(),

    new Vector3(1, 1, -1).normalize(),
    new Vector3(-1, 1, -1).normalize(),
    new Vector3(1, -1, -1).normalize(),
    new Vector3(-1, -1, -1).normalize(),

    new Vector3(1, 1, 0).normalize(),
    new Vector3(-1, 1, 0).normalize(),
    new Vector3(1, -1, 0).normalize(),
    new Vector3(-1, -1, 0).normalize(),
];

const gridReceiverMargin = 0.1;
// we set a ray that is re-used for the validiy, for speed-up
let rayGridReceiver = new Raycaster(new Vector3(0, 0, 0), new Vector3(0, 0, 0), 0.0, gridReceiverMargin);

export const isPointInValidProximityGridReceiver = async (point: Vector3, meshes: Object3D[]) => {
    return new Promise((resolve) => {
        for (let i = 0; i < directionsMediumSimple.length; i++) {
            rayGridReceiver.set(point, directionsMediumSimple[i]);

            const intersects = rayGridReceiver.intersectObjects(meshes, false);

            if (intersects.length > 0) resolve(false);
        }

        resolve(true);
    });
};
