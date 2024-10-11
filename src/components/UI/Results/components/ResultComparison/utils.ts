import {
  SolveTask,
  SourceResults,
  ResultType,
  PointResult,
  ResulTypeOption,
} from '@/types';
import { resultTypes } from './constants';

const getAvailableSources = (sourceResult: SourceResults[]) => {
  const uniqueSources: PointResult[] = [];

  sourceResult
    .sort((a: any, b: any) => a.orderNumber - b.orderNumber)
    .forEach((s) => {
      if (uniqueSources.findIndex((x) => x.id === s.sourcePointId) === -1) {
        uniqueSources.push({
          id: s.sourcePointId,
          name: `${s.label ? s.label : 'Source ' + (uniqueSources.length + 1)}`,
          coords: `(${s.sourceX}, ${s.sourceY}, ${s.sourceZ})`,
        });
      }
    });

  return uniqueSources;
};

const getAvailableReceivers = (selectedSource: SourceResults) => {
  const receiverResults = selectedSource.responses
    ?.sort((a: any, b: any) => a.orderNumber - b.orderNumber)
    .map((receiver, index) => ({
      id: receiver.pointId,
      name: `${receiver.label ? receiver.label : 'Receiver ' + (index + 1)}`,
      coords: `(${receiver.x}, ${receiver.y}, ${receiver.z})`,
    }));

  return receiverResults;
};



export const getSourcesAndReceivers = (
  lastSolveResults: SolveTask,
  selectedResultType: string,
  selectedSourcePointId?: string,
  selectedReceiverPointIds?: string[]
) => {
  const availableSources = getAvailableSources(lastSolveResults);
  // If no source is selected we default to the first one in the list
  const sourcePointId = selectedSourcePointId || availableSources[0].id;

  const selectedSourceObject = lastSolveResults?.find(
    (source: SourceResults) => source.sourcePointId === sourcePointId && source.resultType === selectedResultType
  ) as SourceResults;

  const availableReceivers = getAvailableReceivers(selectedSourceObject);

  // When initializing we default to having the first receiver selected (given that we have some receivers to select from)
  let receiverPointIds: string[] = [];
  if (selectedReceiverPointIds === undefined && availableReceivers.length) {
    receiverPointIds = [availableReceivers[0].id];
  } else if (selectedReceiverPointIds?.length) {
    receiverPointIds = selectedReceiverPointIds;
  }

  const selectedReceiverObjects = selectedSourceObject?.responses?.filter((receiver) =>
    receiverPointIds.includes(receiver.pointId)
  );

  return {
    selectedSourceObject,
    selectedReceiverObjects,
    availableSources,
    availableReceivers,
  };
};


/** Filter available result types based on what we have in the simulation results */
export const getAvailableResultTypes = (results: SourceResults[]) => {
  const availableResultTypes: Array<ResulTypeOption> = [];

  resultTypes.forEach((x) => {
    if (results.some((r) => r.resultType === x.id)) {
      availableResultTypes.push(x);
    }
  });

  return availableResultTypes;
};

/** Sets the default result type when new results have been loaded.
 * If we already had a result type selected we try to keep that selection if it's in the list of available result types.
 * If nothing was selected previously we default to Hybrid.
 * If Hybrid is not in the simulation we default to whatever type we have there.
 */
export const getDefaultResultType = (availableResultTypes: Array<ResulTypeOption>, selectedResultType?: string) => {
  let defaultResultType = selectedResultType || ResultType.BOTH;

  if (!availableResultTypes.some((x) => x.id === defaultResultType)) {
    defaultResultType = availableResultTypes[0].id;
  }

  return defaultResultType;
};
