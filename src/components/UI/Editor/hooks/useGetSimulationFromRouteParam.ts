import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';

/** Context */
import { useSimulationContext, ActionType } from '@/context/SimulationContext';
import { useEditorContext, ActionType as EdActionType } from '@/context/EditorContext';

/** Types */
import { Simulation } from '@/types';

/** Hook to share logic to get simulation based on route params */
export const useGetSimulationFromRouteParam = () => {
  const {
    dispatch,
    simulationState: { selectedSimulation, availableSimulations },
  } = useSimulationContext();
  const { dispatch: edDispatch } = useEditorContext();

  const { id: routeModelId = '' } = useParams();
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryModelId = searchParams.get('modelId') || '';
  const currentModelId = routeModelId || queryModelId;
  const currentSimId = searchParams.get('simulationId') || '';

  useEffect(() => {
    let newSelectedSim: Simulation | null = null;
    // available simulations always updates whenever a simulation prop change
    if (availableSimulations && availableSimulations.length > 0 && availableSimulations[0].modelId == currentModelId) {
      if (currentSimId != '' && selectedSimulation?.id != currentSimId) {
        newSelectedSim = availableSimulations.find((simulation) => simulation.id == currentSimId) || null;
        if (!newSelectedSim) {
          // when the simulation doesn't exist anymore... maybe they shouldn't be returned even?
          // this should only happen when users are clicking on recent simulation runs
          toast.error(`Simulation with id \n${currentSimId} could not be found`, { className: 'editor-toast' });
          newSelectedSim = availableSimulations[availableSimulations.length - 1];
          if (searchParams.get('modelId')) {
            setSearchParams({ modelId: newSelectedSim.modelId, simulationId: newSelectedSim.id }, { replace: true });
          } else {
            setSearchParams({ simulationId: newSelectedSim.id }, { replace: true });
          }
        }
      } else if (currentSimId == '') {
        newSelectedSim = availableSimulations[availableSimulations.length - 1];
        const modelId = searchParams.get('modelId');
        // Backwards compatible for SketchUp
        if (modelId) {
          setSearchParams({ modelId: modelId, simulationId: newSelectedSim.id }, { replace: true });
        } else {
          setSearchParams({ simulationId: newSelectedSim.id }, { replace: true });
        }
      }

      if (newSelectedSim) {
        dispatch({
          type: ActionType.SET_SELECTED_SIMULATION,
          simulation: newSelectedSim,
        });
        edDispatch({
          type: EdActionType.CLEAR_SELECTED,
        });
      }

      if (pathname === '/results') {
        newSelectedSim = availableSimulations.find((simulation) => simulation.id === currentSimId) || null;
        dispatch({
          type: ActionType.SET_ORIGINAL_SIMULATION,
          simulation: newSelectedSim ? { ...newSelectedSim } : null,
        });
      }
    }
  }, [availableSimulations, currentModelId, currentSimId, pathname]);
};
