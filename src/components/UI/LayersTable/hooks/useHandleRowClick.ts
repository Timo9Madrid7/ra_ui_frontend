/** Context */
import { useMaterialPanelContext, ActionType } from '@/components/UI/MaterialPanel';

/** Types */
import { MaterialLayer } from '@/types';

/** Hooks */
import { useHandleOutsideClickForRow } from './useHandleOutsideClickForRow';
import { useMultiSelectLayers } from './useMultiSelectLayers';
import { useHandleDeselect } from './useHandleDeselect';
import { useHandleShiftKey } from './useHandleShiftKey';
import { useSelectLayer } from './useSelectLayer';

export const useHandleRowClick = () => {
  const { selectedLayer, multiSelectedItemIds, selectedLayerIndex, dispatch } = useMaterialPanelContext();
  const multiSelectLayers = useMultiSelectLayers();
  const handleOutsideClickForRow = useHandleOutsideClickForRow();
  const selectLayer = useSelectLayer();

  const handleDeselect = useHandleDeselect();
  const handleShiftKey = useHandleShiftKey();

  const handleRowClick = (
    event: React.MouseEvent<HTMLDivElement>,
    layer: MaterialLayer,
    parentIndex: number,
    childIndex?: number
  ) => {
    // Prevent input clicks from selecting the layer
    if (event.target instanceof HTMLInputElement) {
      return;
    }

    // This should live outside because we use this for deselecting a single selected row
    // @ts-ignore prevent global event listener for being added multiple times
    if (!window.eventAddedForOutsideClick) {
      window.addEventListener('click', handleOutsideClickForRow);
      // @ts-ignore prevent global event listener for being added multiple times
      window.eventAddedForOutsideClick = true;
    }

    if (event.ctrlKey || event.metaKey || event.shiftKey) {
      if (multiSelectedItemIds.includes(layer.id)) {
        handleDeselect(layer);
      } else {
        const { childIds, ids }: { childIds: string[]; ids: string[] } = handleShiftKey(
          event,
          selectedLayerIndex,
          parentIndex,
          childIndex
        );
        multiSelectLayers([
          ...(selectedLayer && multiSelectedItemIds.length === 0 ? [selectedLayer.id] : []),
          ...childIds,
          ...ids,
          layer.id,
        ]);
      }
    } else if (!multiSelectedItemIds.includes(layer.id)) {
      selectLayer(layer);
    }
    dispatch({ type: ActionType.SET_SELECTED_LAYER_INDEX, selectedLayerIndex: [parentIndex, childIndex] });
  };

  return handleRowClick;
};
