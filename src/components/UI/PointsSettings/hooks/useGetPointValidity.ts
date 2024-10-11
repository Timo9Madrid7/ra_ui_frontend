import { Vector3 } from 'three';

/** Context */
import { useModelContext } from '@/context/ModelContext';


/** Types */
import { Source, ValidationError } from '@/context/EditorContext/types';

/** Utils */
import {
  isPointInsideInternalVolume,
  isPointInsideModel,
  isPointInValidProximity,
  isPointCloseToSource,
} from '../utils';

export const useGetPointValidity = () => {
  const { innerMeshes, outerMeshes, meshes } = useModelContext();

  const getPointValidity = (
    x: number,
    y: number,
    z: number,
    type: 'SourcePoint' | 'ReceiverPoint',
    sources?: Source[],
  ): Promise<null | ValidationError> => {
    return new Promise((resolve) => {
      let sourceProximity = 0.5;

      const point3D = new Vector3(x, y, z);
      if (outerMeshes?.length && !isPointInsideModel(point3D, outerMeshes)) {
        resolve(ValidationError.NotInsideModel);
      } else if (type === 'ReceiverPoint' && sources && isPointCloseToSource(point3D, sources)) {
        resolve(ValidationError.CloseToSource);
      } else if (innerMeshes?.length && isPointInsideInternalVolume(point3D, innerMeshes)) {
        resolve(ValidationError.InsideInnerVolume);
      } else if (
        (type == 'SourcePoint' || type == 'ReceiverPoint') &&
        meshes?.length &&
        !isPointInValidProximity(point3D, type == 'SourcePoint' ? sourceProximity : 0.1, meshes)
      ) {
        resolve(ValidationError.CloseToSurface);
      }

      resolve(null);
    });
  };

  return getPointValidity;
};
