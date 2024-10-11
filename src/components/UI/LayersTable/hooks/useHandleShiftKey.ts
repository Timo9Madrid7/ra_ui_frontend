/** Types */
import { MaterialLayer } from '@/types';

/** Context */
import { useSimulationContext } from '@/context/SimulationContext';

export const useHandleShiftKey = () => {
  const {
    simulationState: { surfaceLayers },
  } = useSimulationContext();
  const handleShiftKey = (
    event: React.MouseEvent<HTMLDivElement>,
    selectedLayerIndex: [number, number | undefined] | null,
    currParentIndex: number,
    currChildIndex: number | undefined
  ) => {
    if (event.shiftKey && selectedLayerIndex) {
      // If the Shift key is pressed and there's a last selected item:
      // - Determine the range between the last selected item and the current item.
      const previousParentIndex = selectedLayerIndex[0];
      const previousChildIndex = selectedLayerIndex[1] ?? 0;
      const firstIndex = previousParentIndex < currParentIndex ? previousParentIndex : currParentIndex;
      const lastIndex = previousParentIndex < currParentIndex ? currParentIndex : previousParentIndex;

      // Find all layerGroups between the 2 indices
      const idsBetweenIndexes = surfaceLayers.slice(firstIndex + 1, lastIndex);
      const ids = idsBetweenIndexes.map((layer) => layer.id);
      let childLayers = null;
      let prevChildLayers: MaterialLayer[] = [];
      let currChildLayers: MaterialLayer[] = [];

      // Find all child layers between the 2 child indices - if any
      if (previousParentIndex === currParentIndex && currChildIndex) {
        const currentLayer = surfaceLayers[currParentIndex];
        const firstIndex = previousChildIndex < currChildIndex ? previousChildIndex : currChildIndex + 1;
        const lastIndex = previousChildIndex < currChildIndex ? currChildIndex : previousChildIndex;

        currChildLayers = currentLayer.children.slice(firstIndex, lastIndex);
      } else {
        if (previousChildIndex) {
          const previouslySelectedLayer = surfaceLayers[previousParentIndex];

          const firstIndex = previousParentIndex < currParentIndex ? previousChildIndex : 0;
          const lastIndex =
            previousParentIndex < currParentIndex ? previouslySelectedLayer.children.length : previousChildIndex;

          prevChildLayers = previouslySelectedLayer.children.slice(firstIndex, lastIndex);
        }
        if (currChildIndex) {
          const currentLayer = surfaceLayers[currParentIndex];
          const firstIndex = previousParentIndex < currParentIndex ? 0 : currChildIndex;
          const lastIndex = previousParentIndex < currParentIndex ? currChildIndex : currentLayer.children.length;
          currChildLayers = currentLayer.children.slice(firstIndex, lastIndex);
        }
      }

      childLayers = [...prevChildLayers, ...currChildLayers];

      const childIds = childLayers ? childLayers.map((layer) => layer.id) : [];

      return { childIds, ids };
    } else {
      return { childIds: [], ids: [] };
    }
  };

  return handleShiftKey;
};
