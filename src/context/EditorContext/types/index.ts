export enum ValidationError {
  NotInsideModel = 'NotInsideModel',
  InsideInnerVolume = 'InsideInnerVolume',
  CloseToSurface = 'CloseToSurface',
  CloseToSource = 'CloseToPoint',
}

export type SelectedDetails = {
  type: 'SourcePoint' | 'ReceiverPoint' | 'Layer' | 'LayerGroup' ;
  id: string;
};

export type SourceParams = {
  directivityPattern: string;
  azimuth: number;
  elevation: number;
  rotation: number;
  eq: number[] | null;
  overallGain: number | null;
  correctIrByOnAxisSpl: boolean;
  useSplForSti: boolean;
};

export type Point = {
  id: string;
  label: string;
  x?: number;
  y?: number;
  z?: number;
  isValid: boolean;
  validationError?: ValidationError;
};

export type Receiver = Point;

export type Source = Point;



export enum ResultsView {
  ResultsReportView = 'ResultsReportView',
  ResultsModelView = 'ResultsModelView',
}

export type View3DType = 'ghosted' | 'shaded' | 'wireframe';
