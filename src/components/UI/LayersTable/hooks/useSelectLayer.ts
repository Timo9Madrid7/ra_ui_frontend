/** Context */
import { useMaterialPanelContext, ActionType } from '@/components/UI/MaterialPanel';
import { useAppContext } from '@/context/AppContext';

/** Types */
import { MaterialLayer } from '@/types';

/** Hooks */
import { useSelectLayerInViewport } from './useSelectLayerInViewport';

import {EMPTY_MATERIAL_ID} from "@/constants";

export const useSelectLayer = () => {
  const {
    appState: { filteredMaterials },
  } = useAppContext();

  const selectLayerInViewport = useSelectLayerInViewport();

  const { selectedLayer, selectedMaterial, dispatch } = useMaterialPanelContext();
  const selectLayer = (layer: MaterialLayer) => {
    const newLayer = layer ? layer : selectedLayer;
    if (newLayer) {
      selectLayerInViewport(newLayer as MaterialLayer);
    }

    // Just select the row, not opening the material panel unless the row has already been clicked
    let newMaterial = null;
    if (layer?.materialId !== EMPTY_MATERIAL_ID && !layer?.isMissingMaterial) {
      newMaterial = filteredMaterials.find((material) => material.id === layer?.materialId) || selectedMaterial;
    }

    dispatch({
      type: ActionType.SET_SELECTED_MATERIAL,
      material: newMaterial,
      highlightedMaterialId: newMaterial?.id ?? null,
    });
  };

  return selectLayer;
};
