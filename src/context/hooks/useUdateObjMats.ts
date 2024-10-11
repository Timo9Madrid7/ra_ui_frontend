import { useSimulationContext } from '../SimulationContext';

export const useUpdateObjMats = () => {
  const {
    simulationState: { surfaceLayers },
  } = useSimulationContext();

  const updateObjMats = (simObjMats: { [key: string]: string }, layerIds: string[], materialId: string) => {
    const objMats = { ...simObjMats };

    const updateMaterialId = (id: string) => {
      if (objMats[id] !== materialId) {
        objMats[id] = materialId;
      }
    };

    layerIds.forEach((layerId) => {
      let currLayer = surfaceLayers.find((layer) => layerId === layer.id);

      if (currLayer?.children?.length) {
        // if the layer has mesh object children
        currLayer.children.forEach((child) => {
          if (child.type === 'Mesh') {
            updateMaterialId(child.id);
          }
        });
      } else {
        // if it's a single mesh object
        updateMaterialId(layerId);
      }
    });

    return objMats;
  };

  return updateObjMats;
};
