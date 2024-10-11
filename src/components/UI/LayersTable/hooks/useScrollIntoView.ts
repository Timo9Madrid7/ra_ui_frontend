import { useEffect } from 'react';

/** Context */
import { useEditorContext } from '@/context/EditorContext';
import { useMaterialPanelContext } from '@/components/UI/MaterialPanel';
import { MaterialLayer } from '@/types';

export const useScrollIntoView = (layer: MaterialLayer, layerItem: React.MutableRefObject<null>) => {
  const { selected } = useEditorContext();
  const { selectedLayer } = useMaterialPanelContext();

  useEffect(() => {
    if (
      (selected?.type === 'LayerGroup' || selected?.type === 'Layer') &&
      layerItem.current &&
      selectedLayer?.id === layer.id
    ) {
      //@ts-ignore Property 'scrollIntoView' does not exist on type 'never'.
      layerItem.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'start',
      });
    }
  }, [selected, layerItem]);
};
