import {useMutation} from '@tanstack/react-query';
import axios from '@/client';

import {
    SimulationRun,
} from '@/types';
import {AxiosResponse} from 'axios';


export type StartSolveTask = {
    simulationId: string
};

const startSolveTask = async (request: StartSolveTask) => {


    const {data} = await axios.post<StartSolveTask, AxiosResponse<SimulationRun>>(
        `simulations/run`, request
    );
    return data;
};

export const useStartSolveTask = () => {
    return useMutation(async (request: StartSolveTask) => await startSolveTask(request));
};
