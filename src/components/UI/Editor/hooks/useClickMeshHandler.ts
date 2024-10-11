/** Contexts */
import { useAppContext } from '@/context/AppContext';
import { useEditorContext, ActionType as EditorActionType } from '@/context/EditorContext';
import { useSimulationContext } from '@/context/SimulationContext';
import { useMaterialPanelContext, ActionType } from '@/components/UI/MaterialPanel';

/** Types */
import { MaterialLayer, Material } from '@/types';

import {EMPTY_MATERIAL_ID} from "@/constants";

export const useClickMeshHandler = () => {
  const {
    appState: { filteredMaterials },
  } = useAppContext();
  const {
    simulationState: { surfaceLayers },
  } = useSimulationContext();
  const { dispatch: editorDispatch } = useEditorContext();
  const { isMaterialsLibraryOpen, dispatch } = useMaterialPanelContext();

  const clickMeshHandler = (object: any) => {
    const isLayerGroup = object.parent.children.length > 1 ? false : true;
    const selectedLayerId = isLayerGroup ? object.parent.uuid : object.userData.attributes?.id;

    editorDispatch({
      type: EditorActionType.SET_SELECTED,
      selected: {
        type: isLayerGroup ? 'LayerGroup' : 'Layer',
        id: selectedLayerId,
      },
    });
    if (isMaterialsLibraryOpen) {
      let selectedLayer: MaterialLayer | null = null;
      let selectedMaterial: Material | null = null;

      if (isLayerGroup) {
        selectedLayer = surfaceLayers.find((layerGroup) => layerGroup.id === selectedLayerId) || selectedLayer;
      } else {
        for (const layerGroup of surfaceLayers) {
          for (const layer of layerGroup.children) {
            if (layer.id === selectedLayerId) {
              selectedLayer = layer;
              break;
            }
          }
        }
      }

      if (selectedLayer?.materialId !== EMPTY_MATERIAL_ID) {
        selectedMaterial =
          filteredMaterials.find((material) => material.id === selectedLayer?.materialId) || selectedMaterial;
      }

      dispatch({
        type: ActionType.SET_MATERIALS_PANEL_OPEN,
        isOpen: true,
        material: selectedMaterial,
        highlightedMaterialId: selectedMaterial?.id ?? null,
      });
    }
  };

  return clickMeshHandler;
};
