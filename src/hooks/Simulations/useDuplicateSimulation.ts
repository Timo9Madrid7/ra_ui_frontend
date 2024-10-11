import {cloneDeep, pick} from 'lodash';
import toast from "react-hot-toast";

import {Simulation} from '@/types';

export const useDuplicateSimulation = () => {
    return async (selectedSimulation: Simulation | null) => {
        if (selectedSimulation) {
            const copyOfSimulation = cloneDeep(
                pick(selectedSimulation, [
                    "name",
                    "modelId",
                    "description",
                    "solverSettings",
                    "layerIdByMaterialId",
                    "sources",
                    "receivers",
                ])
            );

            return {
                ...copyOfSimulation,
                taskType: selectedSimulation.taskType?.toString(),
                settingsPreset: selectedSimulation.settingsPreset.toString()
            };
        } else toast.error('There is no simulation available!')
    }
};
