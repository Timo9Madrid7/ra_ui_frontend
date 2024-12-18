import axios from '@/client';

/** Hooks */
import {useQuery} from '@tanstack/react-query';

/** Types */
import {SimulationRun} from '@/types';

const getSimulationRunStatusById = async (simulationRunId: string) => {
    const {data} = await axios.get<SimulationRun>(`/simulations/run/${simulationRunId}/status`);

    return data;
};
    
export const useGetSimulationRunStatusById = (
    simulationRunId: string,
    enabled = true,
    refetchInterval: number | false = false,
    staleTime?: number | undefined
) => {
    return useQuery(['simulationRunStatus', simulationRunId], () => getSimulationRunStatusById(simulationRunId), {
        refetchOnWindowFocus: false,
        refetchInterval: enabled ? refetchInterval : false,
        enabled,
        staleTime,
    });
};
