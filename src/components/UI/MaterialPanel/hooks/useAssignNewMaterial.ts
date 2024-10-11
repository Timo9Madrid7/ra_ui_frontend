/** Context */
import {ActionType, useSimulationContext} from '@/context/SimulationContext';
import {useMaterialPanelContext, ActionType as LibraryActionType} from '@/components/UI/MaterialPanel';
import { useEditorContext, ActionType as EditorActionType } from '@/context/EditorContext';

/** Hooks */
import {useUpdateSurfaceLayers} from '@/context/hooks/useUpdateSurfaceLayers';
import {useSaveUpdatedSimulation, useConfirmEdit} from '@/hooks';

/** Types */
import {Material, Simulation} from '@/types';

/** Helpers */
import {useUpdateObjMats} from '@/context/hooks/useUdateObjMats';

const newMaterialIdByObjectId: { [key: string]: { [key: string]: string } } = {};

export const useAssignNewMaterial = () => {
    const saveSimulation = useSaveUpdatedSimulation();
    const confirmEdit = useConfirmEdit();
    const {dispatch} = useSimulationContext();
    const {dispatch: editorDispatch} = useEditorContext();
    const {dispatch: libraryDispatch, isMaterialsLibraryOpen} = useMaterialPanelContext();
    const updateSurfaceLayers = useUpdateSurfaceLayers();
    const updateObjMats = useUpdateObjMats();

    const assignNewMaterial = async (
        simulation: Simulation | null,
        material: Material,
        layerIds: string[],
    ) => {
        const canContinue = await confirmEdit();

        return new Promise<Simulation | null>((resolve) => {
            if (simulation) {
                const newSurfaceLayers = updateSurfaceLayers(layerIds, material);


                newMaterialIdByObjectId[simulation.id] = {
                    ...simulation?.layerIdByMaterialId,
                    ...newMaterialIdByObjectId[simulation.id],
                };


                const newObjMats = updateObjMats(newMaterialIdByObjectId[simulation.id], layerIds, material.id);

                newMaterialIdByObjectId[simulation.id] = {
                    ...newObjMats,
                };


                const updatedSimulation = {
                    ...simulation,
                    layerIdByMaterialId: newMaterialIdByObjectId[simulation.id],
                    solverSettings: {
                        ...simulation.solverSettings,
                        deSettings: {
                            ...simulation.solverSettings.deSettings,
                            impulseLengthSeconds: 0,
                        },
                        dgSettings: {
                            ...simulation.solverSettings.dgSettings,
                            impulseLengthSeconds: 0,
                        },
                    },
                };

                if (canContinue) {
                    dispatch({
                        type: ActionType.UPDATE_SURFACE_LAYERS,
                        newSurfaceLayers: newSurfaceLayers,
                    });

                    if (!isMaterialsLibraryOpen) {
                        libraryDispatch({
                            type: LibraryActionType.SET_MATERIALS_PANEL_OPEN,
                            isOpen: true,
                        });
                    }

                    libraryDispatch({
                        type: LibraryActionType.SET_SELECTED_MATERIAL,
                        material: material,
                        highlightedMaterialId: material.id,
                    });
                    saveSimulation(updatedSimulation, 'Material attached!');

                    resolve(null);
                } else {
                    editorDispatch({
                        type: EditorActionType.SHOW_EDIT_MODAL,
                        editSimulation: {showDialog: true, updatedSimulation},
                    });
                }
                resolve(updatedSimulation);
            }
        });
    };

    return assignNewMaterial;
};
