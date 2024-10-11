import axios from '@/client';
import {NewSimulation, Simulation} from '@/types';
import {useMutation} from '@tanstack/react-query';

const createSimulation = async (simulation: NewSimulation): Promise<Simulation> => {
    const {data} = await axios.post(`simulations`, JSON.stringify(simulation));
    return data
};

export const useCreateSimulation = () => {
    return useMutation(async (simulation: NewSimulation) => await createSimulation(simulation), {
        onSuccess: (data) => data,
    });
};
