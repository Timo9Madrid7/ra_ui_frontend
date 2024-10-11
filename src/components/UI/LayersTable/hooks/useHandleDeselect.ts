/** Context */
import { useMaterialPanelContext, ActionType } from '@/components/UI/MaterialPanel';
import { useEditorContext, ActionType as EdActionType } from '@/context/EditorContext';

/** Types */
import { MaterialLayer } from '@/types';
import { SelectedDetails } from '@/context/EditorContext/types';

export const useHandleDeselect = () => {
  const { multiSelected, dispatch: edDispatch } = useEditorContext();
  const { multiSelectedItemIds, dispatch } = useMaterialPanelContext();

  const handleDeselect = (layer: MaterialLayer) => {
    let newMultiSelectedItemIds: string[] = [];
    let newMultiSelected: SelectedDetails[] = [];

    if (layer?.children && layer?.children.length > 1) {
      // if parent layer
      const childIds = layer?.children.map((item) => item.id);
      newMultiSelectedItemIds = multiSelectedItemIds.filter((item) => !childIds.includes(item) && item !== layer.id);
      newMultiSelected = multiSelected.filter((item) => !childIds.includes(item.id) && item.id !== layer.id);
    } else {
      // if child layer
      newMultiSelectedItemIds = multiSelectedItemIds.filter((item) => item !== layer.id && item !== layer.parentId);
      newMultiSelected = multiSelected.filter((item) => item.id !== layer.id && item.id !== layer.parentId);
    }

    dispatch({
      type: ActionType.SET_MULTI_SELECT_ITEMS,
      multiSelectedItemIds: newMultiSelectedItemIds,
    });
    edDispatch({
      type: EdActionType.SET_MULTI_SELECTED,
      multiSelected: newMultiSelected,
    });
  };

  return handleDeselect;
};
