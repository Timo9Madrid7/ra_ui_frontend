import { ResultType, ResulTypeOption } from '@/types';
import { ResultComparisonState } from '../../types';

export enum ResultComparisonLabels {
  LABEL = 'Label',
  PROJECT = 'Space',
  MODEL = 'Model',
  SIMULATION = 'Simulation',
  SOURCE = 'Source',
  RECEIVERS = 'Receivers',
  SURFACE_RECEIVERS = 'Surface receivers',
  RESULT_TYPE = 'Result type',
}

export const resultTypes: Array<ResulTypeOption> = [
  { name: 'Geometrical', id: ResultType.DE },
  { name: 'Wave-based', id: ResultType.DG },
  { name: 'Hybrid', id: ResultType.BOTH },
];

export const initialState: ResultComparisonState = {
  availableResultTypes: [],
  title: '',
  modelName: '',
  projectName: '',
  lastSolveResults: null,
  simulationId: '',
  selectedSimulation: null,
  availableSources: [],
  sourcePointId: '',
  availableReceivers: [],
  resultType: '',
  simulationData: null,
};

export enum ActionType {
  SELECT_SIMULATION = 'SELECT_SIMULATION',
  SELECT_SOURCE = 'SELECT_SOURCE',
  SELECT_RECEIVERS = 'SELECT_RECEIVERS',
  UPDATE_SOLVE_RESULTS = 'UPDATE_SOLVE_RESULTS',
  SELECT_RESULT_TYPE = 'SELECT_RESULT_TYPE',
  UPDATE_LABEL = 'UPDATE_LABEL',
}
