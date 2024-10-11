import { useEffect, useState } from 'react';

/** Utils */
import { createPlotlyObject } from './utils';

/** Types */
import { TaskResultForReceiver } from '@/types';
import { ParsedResponseData } from './types';
import { ResultComparison } from '../../types';

export const useResponseData = (comparisons: ResultComparison[]) => {
  const [responseData, setResponseData] = useState<ParsedResponseData[]>([]);

  useEffect(() => {
    if (comparisons) {
      // Batching the promises to keep the state updates
      // less complicated and so it's more responsive when
      // add or removing comparisons
      const batchedPromises: Promise<ParsedResponseData | null>[] = [];
      // For each comparison we make a network call, parse the response
      // and return a Promise that resolves in a plotly object we can use
      // to populate Plotly
      comparisons.forEach((comparison) => {
        if (comparison?.formState?.simulationData?.selectedReceiverObjects?.length === 1) {
          const selectedReceiver: TaskResultForReceiver =
            comparison?.formState?.simulationData.selectedReceiverObjects[0];
          const color = comparison.color;
          const title = comparison.formState.title;
          const colors = comparison.additionalColor

          selectedReceiver.receiverResults?.forEach((result) => {
            const color_item = colors.pop()
            colors.unshift(color_item)
            const newPromise = createPlotlyObject(result, color_item, title);
            batchedPromises.push(newPromise);
          });
        }
      });

      Promise.all(batchedPromises).then((batchResults) => {
        const responses: ParsedResponseData[] = batchResults.filter(
          (result: ParsedResponseData | null) => result !== undefined && result !== null
        ) as ParsedResponseData[];
        setResponseData(responses);
      });
    }
  }, [comparisons]);

  return responseData;
};
