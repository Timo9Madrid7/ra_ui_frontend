import {Material, NewSimulation, Status} from "@/types";
import {View3D} from "@/enums";
import THREE, {Color, Scene, Vector3} from "three";
import {Object3DNode, Properties, ReactThreeFiber} from "@react-three/fiber";

export const FREQUENCIES = ['63', '125', '250', '500', '1k', '2k', '4k'];
export const FREQUENCIES_VALUES = [63, 125, 250, 500, 1000, 2000, 4000];
export const FREQUENCY_OPTIONS = [
    {value: '63', label: '63 Hz'},
    {value: '125', label: '125 Hz'},
    {value: '250', label: '250 Hz'},
    {value: '500', label: '500 Hz'},
    {value: '1000', label: '1k Hz'},
    {value: '2000', label: '2k Hz'},
    {value: '4000', label: '4k Hz'},
    {value: '8000', label: '8k Hz'},
];

export const DEFAULT_COEFFICIENTS = [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1];

export const EMPTY_MATERIAL_ID = '00';
export const EMPTY_MATERIAL_NAME = 'unattached'
export const EMPTY_MATERIAL: Material = {
    id: EMPTY_MATERIAL_ID,
    name: EMPTY_MATERIAL_NAME,
    category: '',
    absorptionCoefficients: [],
    description: '',
    createdAt: '',
    updatedAt: '',
};

export const EMPTY_SIMULATION: NewSimulation = {
    name: '',
    modelId: '',
    description: '',
    layerIdByMaterialId: {},
    solverSettings: {
        dgSettings: {
            impulseLengthSeconds: 1.0,
            energyDecayThreshold: 0,
        },
        deSettings: {
            impulseLengthSeconds: 1.0,
            energyDecayThreshold: 0,
        },
    },
}

export const DG_TEXT: string = 'The Discontinuous Galerkin method (DG) is a ' +
    'finite element method for solving differential equations, ' +
    'characterized by using discontinuous polynomial spaces for the solution ' +
    'and test functions, allowing for high flexibility and local conservation properties.'

export const DE_TEXT: string = 'The Diffusion Equation method (DE) is a mathematical method' +
    ' for modeling the diffusion process, describing how substances spread in a medium ' +
    'over time, often applied in heat transfer, fluid dynamics, and material science.'


/**
 * These are all the available ** parameters ** type of result
 */
export const RESULT_PARAMETERS = [
    'edt',
    't20',
    't30',
    'c80',
    'd50',
    'ts',
    'spl_t0_freq'
];


/**
 * Map ** parameters ** type of result into title representation in the figures
 */
export const RESULT_PARAMETERS_TITLE = {
    edt: 'EDT [s]',
    t20: 'T20 [ms]',
    t30: 'T30 [ms]',
    c80: 'C80 [dB]',
    d50: 'D50',
    ts: 'Centre Time [ms]',
    spl_t0_freq: 'SPL [dB]'
};

/**
 * These are all the available ** responses ** type of result
 */
export const RESULT_RESPONSES = [
    'EDC',
];


export const SIMULATION_IS_RUNNING = [
    Status.Queued,
    Status.InProgress,
    Status.ProcessingResults
]

export const SIMULATION_STATUS_1_In_PENDING = SIMULATION_IS_RUNNING.concat([Status.Created])
export const SIMULATION_STATUS_2_COMPLETED = Status.Completed
export const SIMULATION_STATUS_3_CANCELLED = Status.Cancelled
export const SIMULATION_STATUS_4_ERROR = Status.Error

export const EMPTY_SIMULATION_RUN = {
    status: false,
    createdAt: null,
    completedAt: null,
    percentage: 0,
    sources: [],
}

export const MAX_NUMBER_OF_SOURCES = 1;
export const MAX_NUMBER_OF_RECEIVERS = 1;

export const VIEW3D_OPTIONS = [
    {value: View3D.SHADED, label: View3D.SHADED},
    {value: View3D.GHOSTED, label: View3D.GHOSTED},
    {value: View3D.WIREFRAME, label: View3D.WIREFRAME},
]

/**
 * Defines the default settings of the scene.
 */
export const DEFAULT_THREE_SCENE_SETTINGS: Partial<Object3DNode<Scene, typeof Scene>> = {
    overrideMaterial: null,
    background: new Color("rgb(89,107,107)"),
    backgroundIntensity: 1,
    backgroundBlurriness: 0,
}

export const DEFAULT_AXES_COLOR = {
    X: '#bf4d4d',
    Y: '#22bb33',
    Z: '#348ebf',
}

export const DEFAULT_GRID_AXES_COLOR = {
    XY_COORDINATE: '#697878',
    GRID_BOX: '#616363',
}

/**
 * The WebGL renderer displays your beautifully crafted scenes using WebGL, if your device supports it.
 * This renderer has way better performance than CanvasRenderer.
 *
 * see {@link https://github.com/mrdoob/three.js/blob/master/src/renderers/WebGLRenderer.js|src/renderers/WebGLRenderer.js}
 */
export const DEFAULT_GL_SETTINGS: Partial<Properties<THREE.WebGLRenderer> | THREE.WebGLRendererParameters> = {
    alpha: true,
    depth: true,
    powerPreference: 'high-performance'
};

export const DEFAULT_CAMERA_POSITION = new Vector3(
    -Math.PI * 6,
    -Math.PI * 6,
    Math.PI * 6
);

export const DEFAULT_CAMERA_SETTINGS: Partial<
    ReactThreeFiber.Object3DNode<THREE.Camera, typeof THREE.Camera> &
    ReactThreeFiber.Object3DNode<THREE.OrthographicCamera, typeof THREE.OrthographicCamera> &
    ReactThreeFiber.Object3DNode<THREE.PerspectiveCamera, typeof THREE.PerspectiveCamera>
> = {
    fov: 50,
    zoom: 1.2,
    near: 0.1,
    far: 2000,
    name: 'Camera',
    position: DEFAULT_CAMERA_POSITION,
    up: new Vector3(0, 0, 1),
};

/**
 * These are all the available ** auralization options **
 */
export const AURALIZATION_OPTIONS = [
    {value: 'wav', label: '.wav (Auralization)'},
    {value: 'wavIr', label: '.wav (Impulse Response)'},
    {value: 'csvIr', label: 'Impulse Response (csv)'}   
];