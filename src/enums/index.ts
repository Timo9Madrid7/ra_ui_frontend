export enum PresetEnum {
    Default = 'Default',
    Advanced = 'Advanced',
}

export enum MethodEnum {
    DE = 'DE',
    DG = 'DG',
    BOTH = 'BOTH',
}


export enum MeshContextActionType {
    SET_COMPLETED_MESH_TASKS = 'SET_COMPLETED_MESH_TASKS',
}

export enum AppContextActionType {
    SET_MATERIALS = 'SET_MATERIALS',
}

export enum GuideGroup {
    HOME = 'HOME',
    PROJECT = 'PROJECT',
    EDITOR = 'EDITOR',
    RESULT = 'RESULT',
}

export enum View3D {
    SHADED = 'shaded',
    GHOSTED = 'ghosted',
    WIREFRAME = 'wireframe'
}
/**
 * Each ** Material category ** has a different color which has been used in the model rendering
 */
export enum MaterialCategoryColors {
    Default = '#ffffff',
    Natural = '#e0e0e0',
    Carpet = '#747e8c',
    Curtains = '#e8a0f1',
    Furnishing = '#51d3da',
    Gypsum = '#ccc9d1',
    PerforatedPanels = '#E6E4D9',
    Porous = '#aca3a3',
    Rigid = '#817181',
    Windows = '#caecfa',
    Wood = '#c19884',

    Other = '#BDBDBD',
}