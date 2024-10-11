import axios from '@/client';
import toast from 'react-hot-toast';

/** Hooks */
import {useQuery} from '@tanstack/react-query';

/** Types */
import {Simulation} from '@/types';
import {AxiosError} from 'axios';

const getSimulationsByModelId = async (modelId: number|string) => {
    const {data} = await axios.get(`simulations?modelId=${modelId}`);
    return data;

};

export const useGetSimulationsByModelId = (modelId: number|string) =>
    useQuery<Simulation[], AxiosError>(['simulation-by-model-id', modelId], () => getSimulationsByModelId(modelId), {
        enabled: !!modelId,
        refetchOnWindowFocus: false,
        cacheTime: 0,
        onError: () => {
            toast.error(`Problem fetching simulations for model id: ${modelId}`);
        },
    });
