import { useEffect, useRef, useState } from 'react';

/** Context */
import { useMaterialPanelContext, ActionType } from '@/components/UI/MaterialPanel';
import { useSimulationContext } from '@/context/SimulationContext';
import { useEditorContext } from '@/context/EditorContext';

/** Components */
import { LayerRowContent } from './LayerRowContent';

/** Types */
import { MaterialLayer } from '@/types';

/** Hooks */
import { useSelectLayer } from './hooks/useSelectLayer';

export const LayerRow = ({ layer }: { layer: MaterialLayer }) => {
  const groupLayerRef = useRef(null);
  const {
    simulationState: { selectedSimulation },
  } = useSimulationContext();
  const { selectedLayer, isMaterialsLibraryOpen, selectedLayerIndex, dispatch } = useMaterialPanelContext();
  const { focusItem } = useEditorContext();
  const [isChildOpen, setIsChildOpen] = useState(false);
  const [layerChildren, setLayerChildren] = useState<MaterialLayer[]>();

  const selectLayer = useSelectLayer();

  useEffect(() => {
    setLayerChildren([...layer.children]);
  }, [layer]);

  useEffect(() => {
    if (
      (selectedLayer && layer.children.findIndex((x) => x.id === selectedLayer.id) > -1) ||
      layer.children.findIndex((child) => focusItem === child.id) > -1
    ) {
      setIsChildOpen(true);
    } else if (focusItem === null && selectedLayer === null) {
      setIsChildOpen(false);
    }
  }, [selectedLayer, focusItem]);


  const openMaterialPanel = () => {
    selectLayer(layer);
    if (!isMaterialsLibraryOpen) {
      dispatch({
        type: ActionType.SET_MATERIALS_PANEL_OPEN,
        isOpen: true,
      });
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLLIElement>) => {
    if (event.key === 'Enter') {
      openMaterialPanel();
    }
  };

  const toggleParentLayer = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setIsChildOpen(!isChildOpen);
  };

  return (
    <>
      <li
        ref={groupLayerRef}
        style={{ userSelect: `${selectedLayerIndex === null ? 'inherit' : 'none'}` }}
        tabIndex={0}
        onKeyUp={handleKeyUp}
        onDoubleClick={openMaterialPanel}>
        <LayerRowContent
          key={selectedSimulation?.id}
          layer={layer}
          layerChildren={layerChildren}
          toggleParentLayer={toggleParentLayer}
          isChildOpen={isChildOpen}
        />
      </li>
      {layerChildren &&
        layerChildren.length > 1 &&
        isChildOpen &&
        layerChildren.map((childLayer: MaterialLayer) => (
          <li
            style={{ userSelect: `${selectedLayerIndex === null ? 'inherit' : 'none'}` }}
            key={`${childLayer.id}`}
            tabIndex={0}
            onKeyUp={handleKeyUp}
            onDoubleClick={openMaterialPanel}
            data-index={childLayer.layerIndex}>
            <LayerRowContent
              layer={childLayer}
              parentLayer={layer}
              isChildLayer={true}
            />
          </li>
        ))}
    </>
  );
};