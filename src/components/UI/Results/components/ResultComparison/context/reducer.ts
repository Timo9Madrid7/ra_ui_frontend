/** Types */
import { SolveTask } from '@/types';
import { ResultComparisonState } from '../../../types';

/** Actions */
import { ResultComparisonAction } from './actions';

/** Constants */
import { ActionType } from '../constants';

/** Utils */
import {
  getAvailableResultTypes,
  getDefaultResultType,
  getSourcesAndReceivers,
} from '../utils';

export const ResultComparisonReducer = (
  state: ResultComparisonState,
  action: ResultComparisonAction
): ResultComparisonState => {
  switch (action.type) {
    case ActionType.SELECT_SIMULATION: {
      const { selectedSimulation, projectName, modelName } = action.payload;
      return {
        ...state,
        modelName,
        projectName,
        title: selectedSimulation.name,
        simulationId: selectedSimulation.id,
        selectedSimulation: { ...selectedSimulation },
      };
    }

    case ActionType.UPDATE_SOLVE_RESULTS: {
      const lastSolveResults = action.payload;

      const availableResultTypes = getAvailableResultTypes(lastSolveResults);
      const defaultResultType = getDefaultResultType(availableResultTypes, state.resultType);
      const { selectedSourceObject, selectedReceiverObjects, availableSources, availableReceivers } =
        getSourcesAndReceivers(lastSolveResults, defaultResultType);

      return {
        ...state,
        lastSolveResults,
        availableResultTypes,
        resultType: defaultResultType,
        availableSources,
        sourcePointId: selectedSourceObject.sourcePointId,
        availableReceivers,
        receiverPointIds: state.receiverPointIds ?? selectedReceiverObjects?.map((x) => x.pointId),
        simulationData: {
          ...state.simulationData,
          selectedSourceObject,
          selectedReceiverObjects,
        },
      };
    }

    case ActionType.UPDATE_LABEL: {
      return {
        ...state,
        title: action.payload,
      };
    }
    case ActionType.SELECT_SOURCE: {
      const newSourcePointId = action.payload;
      const { availableReceivers, selectedSourceObject, selectedReceiverObjects } = getSourcesAndReceivers(
        state.lastSolveResults as SolveTask,
        state.resultType,
        newSourcePointId,
        state.receiverPointIds
      );

      return {
        ...state,
        sourcePointId: newSourcePointId,
        availableReceivers,
        receiverPointIds: selectedReceiverObjects?.map((x) => x.pointId) || [],
        simulationData: {
          ...state.simulationData,
          selectedSourceObject,
          selectedReceiverObjects,
        },
      };
    }
    case ActionType.SELECT_RECEIVERS: {
      const receiverPointIds = action.payload;
      const { selectedSourceObject, selectedReceiverObjects } = getSourcesAndReceivers(
        state.lastSolveResults as SolveTask,
        state.resultType,
        state.sourcePointId,
        receiverPointIds
      );

      return {
        ...state,
        receiverPointIds,
        simulationData: {
          ...state.simulationData,
          selectedSourceObject,
          selectedReceiverObjects,
        },
      };
    }



    case ActionType.SELECT_RESULT_TYPE:
      // when the result type changes we need to select new sources,
      // new receivers and new simulation data
      const resultType = action.payload as string;
      const { selectedSourceObject, selectedReceiverObjects, availableSources, availableReceivers } =
        getSourcesAndReceivers(
          state.lastSolveResults as SolveTask,
          resultType,
          state.sourcePointId,
          state.receiverPointIds
        );

      return {
        ...state,
        resultType,
        availableSources,
        sourcePointId: selectedSourceObject.sourcePointId,
        availableReceivers,
        receiverPointIds: selectedReceiverObjects?.map((x) => x.pointId) || [],
        simulationData: {
          ...state.simulationData,
          selectedSourceObject,
          selectedReceiverObjects,
        },
      };
  }
};
