import { PlotType as PlotlyPlotType } from 'plotly.js';

export type ParsedResponseData = {
  marker: { color: string };
  y: number[] | string[];
  x: number[];
  type: PlotlyPlotType;
  mode:
    | 'number'
    | 'text'
    | 'none'
    | 'delta'
    | 'gauge'
    | 'lines'
    | 'markers'
    | 'lines+markers'
    | 'text+markers'
    | 'text+lines'
    | 'text+lines+markers'
    | 'number+delta'
    | 'gauge+number'
    | 'gauge+number+delta'
    | 'gauge+delta'
    | undefined;
  frequency: number;
  name: string;
  resultType: string;
};

export type PlotType = 'Impulse response' | 'EDC' | 'Frequency response' | 'Spatial decay';

export enum ResultType {
  'Impulse response' = 'ir',
  EDC = 'edc',
  'Frequency response' = 'tf-db',
}
