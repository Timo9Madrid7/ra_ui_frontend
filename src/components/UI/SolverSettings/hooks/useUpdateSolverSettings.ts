import {useSaveUpdatedSimulation, useConfirmEdit} from '@/hooks';
import { useEditorContext, ActionType } from '@/context/EditorContext';
import { Simulation } from '@/types';
import { cloneDeep } from 'lodash';

export const useUpdateSolverSettings = () => {
  const saveSimulation = useSaveUpdatedSimulation();
  const confirmEdit = useConfirmEdit();
  const { dispatch } = useEditorContext();

  const updateSolverSettings = async (simulation: Simulation | null) => {
    const canContinue = await confirmEdit();
    if (simulation) {
      const updatedSimulation: Simulation = cloneDeep(simulation);

      if (canContinue) {
        saveSimulation(updatedSimulation, 'Settings updated!');
      } else {
        dispatch({
          type: ActionType.SHOW_EDIT_MODAL,
          editSimulation: { showDialog: true, updatedSimulation},
        });
      }
    }
  };

  return updateSolverSettings;
};
