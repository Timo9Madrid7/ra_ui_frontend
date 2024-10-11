/** Context */
import { useMaterialPanelContext, ActionType } from '@/components/UI/MaterialPanel';
import { useEditorContext, ActionType as EdActionType } from '@/context/EditorContext';
import { SelectedDetails } from '@/context/EditorContext/types';
import { useSimulationContext } from '@/context/SimulationContext';

export const useMultiSelectLayers = () => {
  const { dispatch, multiSelectedItemIds } = useMaterialPanelContext();
  const {
    simulationState: { surfaceLayers },
  } = useSimulationContext();
  const { dispatch: edDispatch, multiSelected } = useEditorContext();

  const multiSelectLayers = (layerIds: string[]) => {
    // @ts-ignore Type 'string' is not assignable to type '[string[], SelectedDetails[]]'
    const [allLayerIds, selectedDetails]: [string[], SelectedDetails[]] = layerIds.reduce(
      // @ts-ignore No overload matches this call
      (acc: [string[], SelectedDetails[]], layerId: string) => {
        const currentLayer = surfaceLayers.find((layer) => layer.id === layerId);
        const layerChildrenIds: string[] =
          currentLayer && currentLayer?.children.length > 1 ? currentLayer?.children.map((child) => child.id) : [];

        let newLayers = [];
        if (currentLayer?.type === 'LayerGroup') {
          newLayers.push({ type: 'LayerGroup', id: currentLayer.id });
          if (currentLayer.children.length > 1) {
            newLayers.push(
              ...currentLayer.children.map((layer) => ({
                type: 'Layer',
                id: layer.id,
              }))
            );
          }
        } else {
          newLayers.push({ type: 'Layer', id: layerId });
        }
        return [
          [...acc[0], ...layerChildrenIds],
          [...acc[1], ...newLayers],
        ];
      },
      [[], []]
    );

    const newMultiSelectedItems = new Set([...allLayerIds, ...multiSelectedItemIds, ...layerIds]);
    dispatch({
      type: ActionType.SET_MULTI_SELECT_ITEMS,
      multiSelectedItemIds: Array.from(newMultiSelectedItems),
    });
    edDispatch({
      type: EdActionType.SET_MULTI_SELECTED,
      multiSelected: [...multiSelected, ...selectedDetails],
    });
    edDispatch({
      type: EdActionType.SET_FOCUS_ITEM,
      focusItem: layerIds[0],
    });
  };

  return multiSelectLayers;
};
