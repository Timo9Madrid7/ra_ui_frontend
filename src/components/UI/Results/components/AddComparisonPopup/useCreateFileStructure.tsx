import {ProjectSimulationsDto, SimulationLightDto} from '../../types';
import {TreeBranch, TreeStructure} from '@/components/Shared/TreeView/types';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import ModelTrainingOutlinedIcon from '@mui/icons-material/ModelTrainingOutlined';
import {Status} from "@/types";


export const useCreateFileStructure = (allProjectsWithSims: ProjectSimulationsDto[]) => {
    if (allProjectsWithSims.length > 0) {
        // @ts-ignore
        const treeStructure: TreeStructure = allProjectsWithSims.reduce(
            // @ts-ignore
            (treeStructure: TreeStructure, projectWithSim: ProjectSimulationsDto) => {
                const simulationNames = projectWithSim.simulations.map((sim) => sim.name?.toLowerCase());
                const simulationIds = projectWithSim.simulations.map((sim) => sim.id);
                if (simulationNames.length > 0) {
                    // simulations
                    const simulationChildren = projectWithSim.simulations.reduce((accSims, currSim: SimulationLightDto) => {
                        // @ts-ignore
                        if (currSim.simulationRun && currSim.simulationRun.status === Status.Completed) {
                            return {
                                ...accSims,
                                [currSim.id]: {
                                    name: `${currSim.name}${currSim.hasBeenEdited ? ' [editing]' : ''}`,
                                    id: currSim.id,
                                    meta: {
                                        modelName: projectWithSim.modelName,
                                        projectName: projectWithSim.projectName,
                                        simulation: currSim,
                                    },
                                    icon: <ModelTrainingOutlinedIcon fill="#999999"/>,
                                    isSelectable: true,
                                    children: {},
                                },
                            };
                        } else {
                            return accSims;
                        }
                    }, {} as TreeBranch);

                    if (Object.keys(simulationChildren).length > 0) {
                        const modelBase = {
                            [projectWithSim.modelId]: {
                                isOpen: false,
                                id: projectWithSim.modelId,
                                name: projectWithSim.modelName,
                                icon: <ModelTrainingOutlinedIcon/>,
                                children: simulationChildren,
                                meta: {simulationNames, simulationIds},
                            },
                        };

                        const existingModelBases =
                            treeStructure &&
                            treeStructure[projectWithSim.projectTag] &&
                            // @ts-ignore
                            treeStructure[projectWithSim.projectTag].children[projectWithSim.projectId]
                                ? // @ts-ignore
                                treeStructure[projectWithSim.projectTag].children[projectWithSim.projectId].children
                                : {};

                        const existingSimNames =
                            treeStructure &&
                            treeStructure[projectWithSim.projectTag] &&
                            treeStructure[projectWithSim.projectTag].children &&
                            // @ts-ignore
                            treeStructure[projectWithSim.projectTag].children[projectWithSim.projectId] &&
                            // @ts-ignore
                            treeStructure[projectWithSim.projectTag].children[projectWithSim.projectId]?.meta?.simulationNames
                                ? // @ts-ignore
                                treeStructure[projectWithSim.projectTag].children[projectWithSim.projectId].meta.simulationNames
                                : [];

                        const existingSimIds =
                            treeStructure &&
                            treeStructure[projectWithSim.projectTag] &&
                            treeStructure[projectWithSim.projectTag].children &&
                            // @ts-ignore
                            treeStructure[projectWithSim.projectTag].children[projectWithSim.projectId] &&
                            // @ts-ignore
                            treeStructure[projectWithSim.projectTag].children[projectWithSim.projectId]?.meta?.simulationIds
                                ? // @ts-ignore
                                treeStructure[projectWithSim.projectTag].children[projectWithSim.projectId].meta.simulationIds
                                : [];

                        // space
                        const space = {
                            [projectWithSim.projectId]: {
                                isOpen: false,
                                id: projectWithSim.projectId,
                                name: projectWithSim.projectName,
                                children: {
                                    ...existingModelBases,
                                    ...modelBase,
                                },
                                meta: {
                                    simulationNames: [...existingSimNames, ...modelBase[projectWithSim.modelId].meta.simulationNames],
                                    simulationIds: [...existingSimIds, ...modelBase[projectWithSim.modelId].meta.simulationIds],
                                },
                            },
                        };

                        const existingSimNamesForTags =
                            treeStructure[projectWithSim.projectTag] && treeStructure[projectWithSim.projectTag].meta?.simulationNames
                                ? treeStructure[projectWithSim.projectTag].meta?.simulationNames
                                : [];
                        const existingSimIdsForTags =
                            treeStructure[projectWithSim.projectTag] && treeStructure[projectWithSim.projectTag].meta?.simulationIds
                                ? treeStructure[projectWithSim.projectTag].meta?.simulationIds
                                : [];

                        return {
                            ...treeStructure,
                            // tag
                            [projectWithSim.projectTag]: {
                                // spaces
                                isOpen: false,
                                name: projectWithSim.projectTag,
                                icon: <FolderOutlinedIcon fill="#999999"/>,
                                children: {...treeStructure[projectWithSim.projectTag]?.children, ...space},
                                meta: {
                                    simulationNames: [...existingSimNamesForTags, ...space[projectWithSim.projectId].meta.simulationNames],
                                    simulationIds: [...existingSimIdsForTags, ...space[projectWithSim.projectId].meta.simulationIds],
                                },
                            },
                        };
                    } else {
                        return treeStructure;
                    }
                } else {
                    return treeStructure;
                }
            },
            {}
        );
        return treeStructure;
    } else return {};
};


export const useCreateTreeView = (allProjectsWithSims: ProjectSimulationsDto[]) => {
    if (allProjectsWithSims.length > 0) {
        const groupedData = {};

        allProjectsWithSims.forEach(item => {
            const {group, projectName, modelName, simulations} = item;

            if (!groupedData[group]) {
                groupedData[group] = {};
            }

            if (!groupedData[group][projectName]) {
                groupedData[group][projectName] = [];
            }

            groupedData[group][projectName].push({modelName, simulations});
        });
        return Object.entries(groupedData).map(([group, projects]) => ({
            label: group,
            children: Object.entries(projects).map(([project, models]) => ({
                label: project,
                children: models.map(({modelName, simulations}) => ({
                    label: modelName,
                    children: simulations.map(sim => ({
                        label: sim.name,
                        obj:sim
                    }))
                }))
            }))
        }));
    }
    return []
}