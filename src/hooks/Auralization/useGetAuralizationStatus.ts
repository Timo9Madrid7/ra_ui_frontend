import axios from '@/client';

/** Hooks */
import {useQuery} from '@tanstack/react-query';

/** Types */
import {SimulationRun} from '@/types';

const getAuralizationStatusById = async (auralizationId: number) => {
    const {data} = await axios.get<SimulationRun>(`/auralizations/${auralizationId}/status`);
    return data;
};
    
export const useGetAuralizationStatus = (
    auralizationId: number,
    enabled = true,
    refetchInterval: number | false = false,
    staleTime?: number | undefined
) => {
    return useQuery(['auralizationStatus', auralizationId], () => getAuralizationStatusById(auralizationId), {
        refetchOnWindowFocus: false,
        refetchInterval: enabled ? refetchInterval : false,
        enabled,
        staleTime,
    });
};