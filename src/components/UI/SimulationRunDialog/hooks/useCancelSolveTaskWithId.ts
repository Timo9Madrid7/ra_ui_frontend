import {useMutation} from '@tanstack/react-query';
import axios from '@/client';

import {
    SimulationRun,
} from '@/types';
import {AxiosResponse} from 'axios';


export type CancelSolveTask = {
    simulationId: string
};

const cancelSolveTaskWithId = async (request: CancelSolveTask) => {
    const {data} = await axios.post<CancelSolveTask, AxiosResponse<SimulationRun>>(
        `simulations/cancel`, request
    );
    return data;
};

export const useCancelSolveTaskWithId = () => {
    return useMutation(async (request: CancelSolveTask) => await cancelSolveTaskWithId(request));
};
