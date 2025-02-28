import React from "react";
import {PresetEnum} from "@/enums";

/**
 * A base interface that contains id and timestamps
 * */
export interface Base {
    id: number;
    createdAt: string,
    updatedAt: string
}

/**
 * NewMaterial interface: if you want to create a new material,
 * you have to provide these attributes
 * */
export interface NewMaterial {
    name: string;
    category: string;
    description: string;
    absorptionCoefficients: (number | undefined)[];
}

/**
 * Material is the base and new material combination
 * */
export interface Material extends Base, NewMaterial {
}

/**
 * Material grouped by their category
 * */
export interface GroupedMaterial {
    [category: string]: Material[];
}

/**
 * NewProject interface: if you want to create a new project,
 * you have to provide these attributes
 * */
export interface NewProject {
    name: string;
    description?: string;
    group?: string;
}

/**
 * A project is a set of multiple models
 * */
export interface Project extends Base, NewProject {
    models: Model[];
}

/**
 * NewModel interface: if you want to create a new model,
 * you have to provide these attributes
 * */
export interface NewModel {
    name: string;
    projectId: string;
    sourceFileId: number | string;
}

/**
 * A model is a system friendly computed geometry
 * */
export interface Model extends Base, NewModel {
    outputFileId: string;
    hasGeo: boolean
}

/**
 * An action is an object that represent action's entity
 * */
export interface Action {
    key: string;
    value: string;
    title?: string;
    disabled?: boolean,
    icon?: React.ReactElement;
    onClick: (() => void) | (() => Promise<void>);
}

/**
 * A mesh is a finite volume element object
 * */
export interface Mesh extends Base {
    taskId: number,
    task: Task
}

/**
 * All the settings related to *** DG *** method comes here
 *
 * Discontinuous Galerkin finite element method (DG)
 * */
export interface DGSettings {
    impulseLengthSeconds: number;
    energyDecayThreshold: number | null;
}

/**
 * All the settings related to *** DE *** method comes here
 *
 * Diffusion equation method (DE)
 * */
export interface DESettings {
    impulseLengthSeconds: number;
    energyDecayThreshold: number | null;
}

/**
 * Combines all the settings available for DE and DG
 *
 * Used in simulation object
 * */
export interface SolverSettings {
    dgSettings: DGSettings;
    deSettings: DESettings;
}

/**
 * Attach material id to each layer.
 *
 * [GUID: material_id]
 * */
export interface LayerIdByMaterialId {
    [key: string]: string
}


/**
 * NewSimulation interface: if you want to create a new simulation,
 *
 * you have to provide these attributes
 * */
export interface NewSimulation {
    name: string;
    modelId: string;
    description: string;
    solverSettings: SolverSettings;
    layerIdByMaterialId: LayerIdByMaterialId | null;
}

/**
 * Source interface: sound source
 *
 * */
export interface Source {
    id: string;
    orderNumber: number;
    x: number;
    y: number;
    z: number;
    label: string;
}

/**
 * Receiver interface: sound receiver
 *
 * */
export interface Receiver extends Source {
}

/**
 * A simulation is an object that represent the settings that is needed for simulation
 * */
export interface Simulation extends Base, NewSimulation {
    status: Status;
    sources: Source[];
    receivers: Receiver[];
    settingsPreset: PresetEnum;
    taskType: string | null;
    meshId: string | null,
    hasBeenEdited: boolean | null;
    simulationRunId: number | null;
    simulationRun?: SimulationRun | null;
    completedAt: string
}

// TODO: do the same for all of the types
export interface resultParametersForReceivers {
    t20: Array<number>,
    t30: Array<number>,
    ts: Array<number>,
    d50: Array<number>,
    edt: Array<number>,
    c80: Array<number>,
    spl_t0_freq: Array<number>,
}
export interface receiverDetails {
    label: string;
    position: Array<number>;
}

export interface ParameterPlot {
    frequencies: Array<number>;
    marker: { color: string };
    name: string;
    type: string;
    resultType: ResultType;
    resultParametersForReceivers: resultParametersForReceivers[];
    receiverDetails: receiverDetails[];
    sourcePosition: Array<number>;
}

export interface SimulationRun extends Base {
    status: Status;
    taskType: TaskType;
    percentage: number;
    completedAt: string;
    settingsPreset: PresetEnum;
    sources: SourceStatus[];
    receivers: Receiver[];
    solverSettings: SolverSettings;
    layerIdByMaterialId: LayerIdByMaterialId | null;
    tasks: Task[] | null;
}

export type SourceStatus = {
    sourcePointId: string | null;
    percentage: number | null;
    label: string | null;
    taskStatuses: Array<TaskStatus> | null;
    orderNumber: number;
};


/**
 * Enum to handle status of a simulation
 * */
export enum Status {
    'Created' = 'Created',
    'Queued' = 'Queued',
    'InProgress' = 'InProgress',
    'ProcessingResults' = 'ProcessingResults',
    'Completed' = 'Completed',
    'Cancelled' = 'Cancelled',
    'Error' = 'Error',
}

export type TaskRunStatus =
    | 'Queued'
    | 'Created'
    | 'InProgress'
    | 'ProcessingResults'
    | 'Completed'
    | 'Cancelled'
    | 'Error';


export type SelectType = {
    id: string,
    name: string
}


export type TaskType = 'BOTH' | 'DG' | 'DE' | 'Mesh';


export type Task = {
    id: string;
    taskType: TaskType;
    status: TaskRunStatus;
    createdAt?: string;
    startedAt?: string;
    message?: string;
    completedAt?: string;
    completedAtEst?: string;
    percentage?: number;
    userErrorMessage?: string;
    errorDetails?: string;
    userStatusMsg?: string;
    taskProvider?: string;
    sourcePointId?: string;
};

export type RunStatus =
    | 'Created'
    | 'InProgress'
    | 'Queued'
    | 'Cancelled'
    | 'Completed'
    | 'Error'
    | 'TaskError'
    | 'ProcessingResults';


export type SimulationRunStatus = {
    id: string;
    status: RunStatus | null;
    createdAt: string;
    completedAt: string;
    percentage: number | null;
    estimatedSimulationTime: number | null;
    timeEstimate: number | null;
    simulationId: string;
    simulationName: string | null;
    modelId: string | null;
    modelName: string | null;
    groupName: string | null;
    projectId: string | null;
    projectName: string | null;
    sources: Array<SourceStatus> | null;
};

export type SolveTask = SourceResults[];


export type SourceResults = {
    id: string;
    orderNumber: number;
    createdAt: string;
    resultType: ResultType;
    label: string;
    sourceX: number;
    sourceY: number;
    sourceZ: number;
    sourcePointId: string;
    frequencies: number[];
    parameters: string;
    responses: TaskResultForReceiver[];
};

export enum ResultType {
    DE = 'DE',
    DG = 'DG',
    BOTH = 'BOTH',
    Mesh = 'Mesh',
}


export type TaskResultForReceiver = {
    id: string;
    solveResultId: string;
    orderNumber?: number;
    irNormalization: number;
    label?: string;
    x?: number;
    y?: number;
    z?: number;
    pointId: string;
    parameters: string;
    receiverResults?: ReceiverResults[];
};

export type ReceiverResults = {
    id: string;
    solveResultPointId: string;
    frequency: number;
    type: string;
    uploadId: number;
    uploadUrl: string;
    uploadLinkExpires: string;
};


export type ModelInformation = {
    id: string;
    projectId: string;
    modelName: string;
    projectName: string;
    projectTag: string;
    modelUploadId: number;
    modelUrl: string;
    simulationCount: number;
    hasGeo: boolean
};


export type TaskStatus = {
    taskId: string;
    status: TaskRunStatus;
    taskType: string;
    percentage: number;
    userStatusMsg: string;
    userErrorMsg: string;
    createdAt: string;
    updatedAt: string;
    completedAt: string;
    runtimeSeconds: number;
    sourcePointId: string;
};


export type MaterialLayer = {
    name: string;
    layerIndex: number;
    type: string;
    children: MaterialLayer[];
    absorptionCoefficients?: number[];
    materialId?: string | null;
    materialName?: string;
    textName: string;
    id: string;
    parentId: string | null;
    layerGroupIndex: number;
    isMissingMaterial: boolean;
};

export type HiddenLayer = {
    type: 'Layer' | 'LayerGroup' | 'Mesh';
    id: string;
};

export type AnechoicOption = {
    createdAt: string;
    description: string;
    id: number;
    isUserFile: boolean;
    name: string;
    updatedAt: string;
}

export type SimulationSettingOption = {
    simulationType: string;
    label: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}