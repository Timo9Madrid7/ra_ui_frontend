import linspace from 'exact-linspace';
import {WaveFile} from 'wavefile';

/** Types */
import {ReceiverResults} from '@/types';
import {AxisType, DataTitle, Layout, PlotType as PlotlyPlotType} from 'plotly.js';
import {ParsedResponseData, PlotType, ResultType} from './types';

/** Contants */
import toast from 'react-hot-toast';
import {
    FREQUENCY_VALUES_FOR_RESPONSE_PLOT,
    TICK_TEXT_FOR_RESPONSE_PLOT,
} from './constants';


export const createPlotlyObject = async (
    results: ReceiverResults,
    color: string,
    title: string
): Promise<ParsedResponseData | null> => {


    switch (results.type) {
        case ResultType['Impulse response']: {
            const toastId = `${results.id}-impulse`;
            const {
                samples,
                finalTime
            } = await downloadAndDecodeWavFiles(results.uploadUrl, toastId, 'Impulse response');
            if (samples) {
                const {xAxis, yAxis} = parseWaveData(
                    samples,
                    finalTime,
                    // NOTE: division by FS
                    irNormalization / 32000
                );

                // Crate a normal number array out of the float64Data
                const yAxisNormal = [].slice.call(yAxis);

                const newTrace = createScatterTrace(xAxis, yAxisNormal, color, title, results.resultType);
                return newTrace;
            }
        }

        case ResultType['EDC']: {
            const toastId = `${results.id}-edc`;
            // the Frequency can be 0 for some reason, which we filter out
            if (results.frequency > 0) {
                const xAxis = results.t
                const yAxis = results.data
                const newTrace = createScatterTrace(xAxis, yAxis, color, title, results.type, results.frequency);
                return newTrace;

                // const {samples, finalTime} = await downloadAndDecodeWavFiles(results.uploadUrl, toastId, 'EDC');
                // if (samples) {
                //     const {xAxis, yAxis} = parseWaveData(samples, finalTime);
                //
                //     // Crate a normal number array out of the float64Data
                //     const yAxisNormal = [].slice.call(yAxis);
                //
                //     const newTrace = createScatterTrace(xAxis, yAxisNormal, color, title, results.resultType, results.frequency);
                //     return newTrace;
                // }
            } else {
                return null;
            }
        }

        case ResultType['Frequency response']: {
            const toastId = `${results.id}-frequency`;
            const [xAxis, yAxis] = await downloadAndDecodeTextFiles(results.uploadUrl, toastId, 'Frequency response');
            const newTrace = createScatterTrace(xAxis, yAxis, color, title, results.type, results.frequency);
            return newTrace;
        }

        default:
            return null;
    }
    return null
};

const downloadAndDecodeTextFiles = async (uploadUrl: string, toastId: string, type: string) => {
    try {
        const response = await fetch(uploadUrl);
        // read the response as text
        const text = await response.text();

        const splitStringArray = text.split(/\b\s+/);
        // @ts-ignore beacuse filter can't handle that we are parsing numbers and filtering
        const xAxis: number[] = splitStringArray.filter((splitString, index) => {
            if (index % 2 === 0) {
                return parseInt(splitString) + 1;
            }
        });
        // @ts-ignore beacuse filter can't handle that we are parsing numbers and filtering
        const yAxis: number[] = splitStringArray.filter((splitString, index) => {
            if (index % 2 !== 0) {
                return parseFloat(splitString);
            }
        });

        return [xAxis, yAxis];
    } catch (error) {
        toast.error(`Error reading results for ${type} graph. Please refresh the browser.`, {
            toastId,
        });
        return [];
    }
};

const downloadAndDecodeWavFiles = async (uploadUrl: string, toastId: string, type: string) => {
    try {
        const response = await fetch(uploadUrl);

        // read it as an array buffer
        const arrayBuffer = await response.arrayBuffer();

        // create a uInt8 array
        let uInt8Array = new Uint8Array(arrayBuffer);

        // so that we can create a Wave file to read from
        const wav = new WaveFile(uInt8Array);

        // get the samples to get an array with floting point numbers
        let samples = wav.getSamples(false, Float32Array);

        // @ts-ignore because for some reason this library hadn't typed this object
        const samplingRate: number = wav?.fmt?.sampleRate;

        // get the final time from our custom made formula a la Ingimar
        const finalTime = samples.length * (1.0 / samplingRate);

        return {
            samples,
            finalTime,
        };
    } catch (error) {
        toast.error(`Error decoding Waveform audio file for ${type} graph. Please refresh the browser.`, {
            toastId,
        });
        return {};
    }
};

const parseWaveData = (float64Data: Float64Array, finalTime: number, irNormalization?: number) => {
    const normalizedYAxis = float64Data.map((float: number) => (irNormalization ? float * irNormalization : float));

    const linearXAxis = linspace(0.0, finalTime, float64Data.length);

    return {
        xAxis: linearXAxis,
        yAxis: normalizedYAxis,
    };
};

const createScatterTrace = (
    xAxis: number[],
    yAxis: number[],
    color: string,
    name: string,
    resultType: string,
    frequency?: number
): ParsedResponseData => {


    return {
        marker: {
            color: color,
        },
        y: yAxis,
        x: xAxis,
        type: 'scatter' as PlotlyPlotType,
        mode: 'lines',
        resultType,
        name: resultType === 'edc' ? `${frequency} Hz · ${name}` : name,
        frequency: frequency || 0,
    };
};

export const sortData = (firstElement: ParsedResponseData, secondElement: ParsedResponseData) => {
    if (firstElement.frequency < secondElement.frequency) {
        return -1;
    }
    if (secondElement.frequency > firstElement.frequency) {
        return 1;
    }
    return 0;
};

const defaultLayoutConfig: Partial<Layout> = {
    showlegend: true,
    legend: {
        orientation: 'h',
        borderwidth: 22,
        bordercolor: 'transparent',
        font: {
            size: 11,
            color: '#9b9797',
        },
    },
    autosize: true,
    xaxis: {
        gridcolor: '#555555',
        hoverformat: '.2f',
        title: {
            standoff: 15,
            font: {
                size: 10,
                color: '#ADADAD',
            },
        },
    },
    yaxis: {
        gridcolor: '#555555',
        hoverformat: '.1f',
        title: {
            font: {
                size: 10,
                color: '#ADADAD',
            },
            standoff: 10,
        },
    },
    paper_bgcolor: '#272727',
    plot_bgcolor: 'transparent',
    font: {
        family: 'Inter, Helvetica, Arial, sans-serif',
        color: '#f5f5f5',
        size: 10,
    },
    margin: {
        l: 50,
        r: 5,
        b: 96,
        t: 20,
        pad: 5,
    },
};

export const getPlotLayoutConfig = (
    selectedPlotType: PlotType,
): Partial<Layout> => {
    let layoutConfig = defaultLayoutConfig;

    switch (selectedPlotType) {
        case 'EDC':
            layoutConfig = {
                ...layoutConfig,
                xaxis: {
                    ...layoutConfig.xaxis,
                    autorange: true,
                    title: {
                        ...(layoutConfig.xaxis!.title as Partial<DataTitle>),
                        text: 'TIME [s]',
                        font: {
                            size: 12,
                            color: 'black',
                        },
                    },
                },
                yaxis: {
                    ...layoutConfig.yaxis,
                    autorange: false,
                    range: [0, 100],
                    title: {
                        ...(layoutConfig.yaxis!.title as Partial<DataTitle>),
                        text: 'ENERGY DECAY CURVE [dB]',
                        font: {
                            size: 10,
                            color: 'black',
                        },
                    },
                },
                paper_bgcolor: '#f5f5f5',
                plot_bgcolor: 'transparent',

                font: {
                    family: 'Inter, Helvetica, Arial, sans-serif',
                    color: 'black',
                    size: 10,
                },
            };
            break;
        case 'Frequency response':
            layoutConfig = {
                ...layoutConfig,
                xaxis: {
                    ...layoutConfig.xaxis,
                    range: [Math.log10(20), Math.log10(12000)],
                    tickmode: 'array' as 'array' | 'linear' | 'auto' | undefined,
                    type: 'log' as AxisType,
                    ticktext: TICK_TEXT_FOR_RESPONSE_PLOT,
                    tickvals: FREQUENCY_VALUES_FOR_RESPONSE_PLOT,
                    hoverformat: '',
                    title: {
                        ...(layoutConfig.xaxis!.title as Partial<DataTitle>),
                        text: 'Frequency [Hz]',
                        font: {
                            size: 12,
                            color: 'black',
                        },
                    },
                },
                yaxis: {
                    ...layoutConfig.yaxis,
                    autorange: true,
                    title: {
                        ...(layoutConfig.yaxis!.title as Partial<DataTitle>),
                        text: 'SPL [dB] re. 20 μPa',
                        font: {
                            size: 10,
                            color: 'black',
                        },
                    },
                },
                paper_bgcolor: '#f5f5f5',
                plot_bgcolor: 'transparent',

                font: {
                    family: 'Inter, Helvetica, Arial, sans-serif',
                    color: 'black',
                    size: 10,
                },
            };
            break;
        case 'Impulse response':
            layoutConfig = {
                ...layoutConfig,
                xaxis: {
                    ...layoutConfig.xaxis,
                    autorange: true,
                    hoverformat: '.4f',
                    title: {
                        ...(layoutConfig.xaxis!.title as Partial<DataTitle>),
                        text: 'Time [s]',
                        font: {
                            size: 12,
                            color: 'black',
                        },
                    },
                },
                yaxis: {
                    ...layoutConfig.yaxis,
                    autorange: true,
                    hoverformat: '.6f',
                    title: {
                        ...(layoutConfig.yaxis!.title as Partial<DataTitle>),
                        text: 'PRESSURE',
                        font: {
                            size: 10,
                            color: 'black',
                        },
                    },
                },
                paper_bgcolor: '#f5f5f5',
                plot_bgcolor: 'transparent',

                font: {
                    family: 'Inter, Helvetica, Arial, sans-serif',
                    color: 'black',
                    size: 12,
                },
            };
            break;
        default:
            break;
    }

    return layoutConfig;
};
