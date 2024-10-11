import { useEffect, useState } from 'react';
import { Data } from 'plotly.js';

/** Utils */
import { sortData } from './utils';

/** Types */
import { ParsedResponseData, PlotType, ResultType } from './types';

export const useResponsePlot = (
  responseData: ParsedResponseData[],
  selectedPlotType: PlotType,
  frequencyFilter: string[]
) => {
  const [plotlyData, setPlotlyData] = useState<Data[]>([]);

  // If the parsed data changes or the selected plot type
  useEffect(() => {
    if (selectedPlotType !== 'Spatial decay' && responseData.length > 0) {

      let filteredParsedData = responseData.filter((data) => data.resultType === ResultType[selectedPlotType]);

      let filteredPlotData = filteredParsedData;

      if (selectedPlotType === 'EDC' && frequencyFilter.length) {
        filteredPlotData = filteredPlotData.filter((x) => frequencyFilter.includes(x.frequency.toString()));
      } else if (selectedPlotType === 'EDC' && frequencyFilter.length === 0) {
        filteredPlotData = [];
      }

      const orderedData = [...filteredPlotData].sort(sortData)
      const toPlotlyData: Data[] = orderedData.map((data) => {
        return {
          marker: data.marker,
          y: data.y,
          x: data.x,
          type: data.type,
          mode: data.mode,
          name: data.name,
        };
      });
      setPlotlyData(toPlotlyData);
    } else {
      setPlotlyData([]);
    }
  }, [responseData, selectedPlotType, frequencyFilter]);

  return plotlyData;
};
