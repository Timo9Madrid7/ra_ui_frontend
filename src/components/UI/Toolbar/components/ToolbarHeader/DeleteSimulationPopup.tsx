/** Hooks */
import { useDeleteSimulation } from '@/hooks';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

/** Context */
import { ActionType, useSimulationContext } from '@/context/SimulationContext';

/** Components */
import { ConfirmationDialog } from '@/components';
import toast from 'react-hot-toast';

export const DeleteSimulationPopup = ({
  showDeleteConfirmation,
  setShowDeleteConfirmation,
  setIsDisabled,
}: {
  showDeleteConfirmation: boolean;
  setShowDeleteConfirmation: (show: boolean) => void;
  setIsDisabled: (show: boolean) => void;
}) => {
  const {
    simulationState: { selectedSimulation, availableSimulations },
    dispatch,
  } = useSimulationContext();

  let [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { mutate: deleteSimulation } = useDeleteSimulation();

  const deleteSimulationFunc = (simulationId?: string) => {
    if (!simulationId) return;
    setIsDisabled(true);
    deleteSimulation(simulationId, {
      onSuccess: () => {
        if (availableSimulations) {
          const newSimulations = availableSimulations.filter((simulations) => simulations.id !== simulationId);
          dispatch({
            type: ActionType.SET_MODEL_SIMULATIONS,
            simulations: newSimulations,
          });
          const newSim = newSimulations[newSimulations.length - 1];
          if (newSim) {
            // Backwards compatible for SketchUp
            if (searchParams.get('modelId')) {
              setSearchParams({ modelId: newSim.modelId, simulationId: newSim.id }, { replace: true });
            } else {
              setSearchParams({ simulationId: newSim.id }, { replace: true });
            }
          } else {
            const modelIdPath = location.search.split('&simulationId=')[0];
            navigate(`${location.pathname}${modelIdPath}`, { replace: true });
          }
          toast.success(`'${selectedSimulation?.name}' deleted`, { className: 'editor-toast' });
        }
      },
      onError: () => {
        toast.error('An error occurred while deleting simulation');
      },
    });
  };

  return (
    <>
      {showDeleteConfirmation && (
        <ConfirmationDialog
          title="Delete Simulation"
          message={() => (
            <span>
              Are you sure you want to delete <b>{selectedSimulation?.name}</b> ?
            </span>
          )}
          onConfirm={() => {
            deleteSimulationFunc(selectedSimulation?.id);
            setShowDeleteConfirmation(false);
          }}
          onCancel={() => setShowDeleteConfirmation(false)}
        />
      )}
    </>
  );
};
