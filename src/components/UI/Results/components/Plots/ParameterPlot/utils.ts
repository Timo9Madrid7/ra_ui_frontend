import { frequenciesDefault} from './constants';
import {ParsedData} from './types';
import {ResultParameters} from '../../types';

const getSpatialAverage = (values: number[]) => {
    // Calculated as documented here: hhttps://www.globalspec.com/reference/77882/203279/3-4-spatial-averaging
    return 10 * Math.log10(values.reduce((a, b) => a + Math.pow(10, b / 10), 0) / values.length);
};

const getNormalAverage = (values: number[]) => {
    return values.reduce((a, b) => a + b) / values.length;
};

export const createPlotlyDataObjects = (
    plotData: ParsedParameterData[],
    selectedParameterKey: string,
) => {
    const initialState: ParsedData = {
        newPlotlyData: [],
    };

    const parsedData = plotData.reduce((accumulator: ParsedData, current: ParsedParameterData) => {
        if (current.frequencies.length && current.resultParametersForReceivers) {
            const plotlydata = {
                name: current.name,
                type: current.type,
                marker: current.marker,
                y: frequenciesDefault.map((x) => {
                    const frequencyIndex = current.frequencies.indexOf(Number(x));

                    let values = current.resultParametersForReceivers.map(
                        (resultParametersForReceivers: ResultParameters) =>
                            resultParametersForReceivers[selectedParameterKey][frequencyIndex]
                    );

                    // Filter out the NaNs
                    values = [...values].filter((x) => !isNaN(x));

                    if (values.length) {
                        if (['c50', 'c80', 'spl_t0_freq'].includes(selectedParameterKey)) {
                            return getSpatialAverage(values);
                        } else {
                            return getNormalAverage(values);
                        }
                    } else {
                        return null;
                    }
                }),
            };

            const parsedData = {
                newPlotlyData: [
                    ...accumulator.newPlotlyData,
                    {
                        ...plotlydata,
                    },
                ],
            };

            return parsedData;
        } else {
            return accumulator;
        }
    }, initialState);

    return {
        newPlotlyData: parsedData.newPlotlyData,
    };
};

