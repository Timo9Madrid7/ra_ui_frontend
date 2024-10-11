import { useEditorContext, ActionType } from '@/context/EditorContext';

/** Types */
import { MaterialLayer } from '@/types';

export const useSelectLayerInViewport = () => {
  const { dispatch } = useEditorContext();

  const selectLayerInViewport = (layer: MaterialLayer) => {
    dispatch({
      type: ActionType.SET_SELECTED,
      selected: { type: layer.type === 'LayerGroup' ? 'LayerGroup' : 'Layer', id: layer.id },
    });
  };

  return selectLayerInViewport;
};
