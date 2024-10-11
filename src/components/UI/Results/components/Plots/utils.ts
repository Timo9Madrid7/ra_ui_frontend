import {Config, DataTitle, Layout} from "plotly.js";
import {frequenciesDefault, ParsedResponseData} from "@/components";
import {RESULT_PARAMETERS_TITLE} from '@/constants'

export const plotlyDefaultConfig: Partial<Config> = {
    modeBarButtonsToRemove: ['resetScale2d'],
    displaylogo: false,
    doubleClick: 'autosize',
    responsive: true,
}

export const plotlyDefaultTitle: Partial<DataTitle> = {
    text: 'axis_text',
    font: {
        size: 11,
        color: 'black',
    },
    standoff: 20,
}

export const plotlyDefaultLayout: Partial<Layout> = {
    showlegend: true,
    legend: {
        orientation: 'h',
        borderwidth: 1,
        y: -0.20,
        bordercolor: 'gray',
        font: {
            size: 11,
            color: 'black',
        },
    },
    autosize: true,
    barmode: 'group',
    xaxis: {
        tickvals: [0, 1, 2, 3, 4, 5, 6, 7],
        ticktext: frequenciesDefault,
        hoverformat: '.2f',
        range: [-0.5, 7.5],
        gridcolor: 'lightgray',
        title: {
            ...plotlyDefaultTitle,
            text: 'Center Frequency [Hz]',
        },
    },
    yaxis: {
        range: [0, 100],
        hoverformat: '.2f', // decimals
        gridcolor: 'lightgray',
        title: plotlyDefaultTitle,
    },
    paper_bgcolor: '#f5f5f5',
    plot_bgcolor: 'transparent',
    font: {
        family: 'Inter, Helvetica, sans-serif',
        color: 'black',
        size: 10,
    },
    margin: {
        l: 50, // left-margin
        r: 5, // right-margin
        t: 30, // top-margin
    },
}

export const getParameterYaxisTitle = (selectedParameter: string) => {
    // @ts-expect-error: no need to define a type for mapping
    return RESULT_PARAMETERS_TITLE[selectedParameter];
}

export const getParameterYPlotRange = (selectedParameter: string, plotlyData: ParsedResponseData[]) => {
    const yValues: Array<number> = []
    plotlyData.forEach((plot) => {
        if (plot.type == 'bar') {
            plot.y?.forEach((y) => {
                // @ts-expect-error: y is always number
                if (!isNaN(y) && y !== null) yValues.push(y);
            });
        }
    });

    let min: number = 0;
    let max: number = 0;

    if (plotlyData.length && plotlyData[0]?.y) {
        min = Math.min(...yValues);
        max = Math.max(...yValues);
    }
    
    switch (selectedParameter) {
        case 'c80':
        case 'spl_t0_freq': {
            return [min - 3, Math.max(max + 3, 0)];
        }
        default: {
            return [0, max * 1.2];
        }
    }
};
