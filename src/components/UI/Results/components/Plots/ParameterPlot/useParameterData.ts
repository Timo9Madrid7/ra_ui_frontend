import { useEffect, useState } from 'react';
import { PlotType } from 'plotly.js';

/** Types */
import { ResultComparison, ResultParameters } from '../../types';
import { ParsedParameterData } from './types';

export const useParameterData = (comparisons: ResultComparison[]) => {
  const [parameterData, setParameterData] = useState<ParsedParameterData[]>([]);

  useEffect(() => {
    if (comparisons) {
      // create a new object that we can filter later while the user
      // interacts with the plots
      const newPlotData: ParsedParameterData[] = comparisons.reduce<ParsedParameterData[]>(
        (acc: ParsedParameterData[], curr: ResultComparison) => {
          if (
            curr?.formState?.simulationData?.selectedReceiverObjects?.length &&
            curr?.formState?.simulationData?.selectedSourceObject
          ) {
            // parse the result paramter string to json
            const parsedResultParameters: ResultParameters[] =
              curr.formState.simulationData.selectedReceiverObjects.map((results) =>
                results.parameters
              );

            // get frequencies and the title that we can use later
            const frequencies = curr?.formState?.simulationData?.selectedSourceObject.frequencies;
            const name = curr.formState.title;
            // create a new array with the new object
            return [
              ...acc,
              {
                marker: { color: curr.color },
                resultParametersForReceivers: parsedResultParameters,
                frequencies,
                type: 'bar' as PlotType,
                resultType: curr.formState.resultType,
                name,
                sourcePosition: [
                  curr.formState.simulationData.selectedSourceObject.sourceX ?? 0,
                  curr.formState.simulationData.selectedSourceObject.sourceY ?? 0,
                  curr.formState.simulationData.selectedSourceObject.sourceZ ?? 0,
                ],
                receiverDetails: curr.formState.simulationData.selectedReceiverObjects.map((receiver) => ({
                  label: receiver.label || (receiver.orderNumber !== undefined ? `R${receiver.orderNumber + 1}` : ''),
                  position: [receiver.x ?? 0, receiver.y ?? 0, receiver.z ?? 0],
                })),
              },
            ];
          } else {
            return acc;
          }
        },
        []
      );

      setParameterData(newPlotData);
    }
  }, [comparisons]);

  return parameterData;
};
