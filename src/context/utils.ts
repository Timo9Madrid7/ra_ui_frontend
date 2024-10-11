import {Material, Simulation, SimulationRun, Status} from '@/types';
import {
    EMPTY_MATERIAL
} from '@/constants';

export const sortAndOrderSimulation = (simulations: Simulation[]) => {
    const sortedSimulations: Simulation[] = [...simulations].sort((a: Simulation, b: Simulation) => {
        return a.createdAt > b.createdAt ? 1 : -1;
    });
    const newSimulations = sortedSimulations.map((sim: Simulation) => {
        if (sim.sources === null) sim.sources = [];
        if (sim.receivers === null) sim.receivers = [];
        if (sim.taskType === null) sim.taskType = 'BOTH';
        return sim;
    });
    return newSimulations;
};

export const makeMaterials = (materials: Material[]) => {
    const sortedMaterials = materials.sort((material1, material2) => {
        const category1 = material1.category.trim().toLowerCase();
        const category2 = material2.category.trim().toLowerCase();
        if (category1 !== category2) {
            return category1.localeCompare(category2);
        }
        // if category was equal then sort by name
        const material1Name = material1.name.trim().toLowerCase();
        const material2Name = material2.name.trim().toLowerCase();
        return material1Name.localeCompare(material2Name, undefined, {
            numeric: true,
            sensitivity: 'base',
        });
    })

    const filteredMaterials = [...sortedMaterials, EMPTY_MATERIAL]

    const categories = sortedMaterials
        .filter(material => material.category)
        .map(material => material.category);

    const materialCategories = [...new Set(categories)];

    return {
        filteredMaterials,
        materialCategories,
    };
};

export const getStatusBySimulationRun = (simulationRun: SimulationRun) => {
    let status = 0;

    if (simulationRun && simulationRun.status) {
        switch (simulationRun.status) {
            case Status.Queued:
            case Status.Created:
            case Status.ProcessingResults:
            case Status.InProgress:
                status = 1;
                break;
            case Status.Completed:
                status = 2;
                break;
            case Status.Cancelled:
                status = 3;
                break;
            case Status.Error:
                status = 4;
                break;
            default:
                break;
        }
    }

    return status;
};

export const getLayerMaterialName = (isMissingMaterial: boolean, material: Material) => {
    if (!isMissingMaterial) {
        return material.name;
    }

    if (material.isDeleted) {
        return `${material.name} (deleted)`;
    }

    if (!material.isSharedWithOrganization) {
        return `${material.name} (not shared)`;
    }

    return material.name;
};
