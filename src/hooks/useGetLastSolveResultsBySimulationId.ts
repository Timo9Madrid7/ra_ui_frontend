import axios from '@/client';
/** Hooks */
import {useQuery} from '@tanstack/react-query';

/** Types */
import {SolveTask} from '@/types';

const getLastSolveResultsBySimulationId = async (simulationId: string) => {
    const {data} = await axios.get(
        `simulations/${simulationId}/result`
    );

    return await data;
};

export const useGetLastSolveResultsBySimulationId = (simulationId: string, enabled = true) => {
    return useQuery<SolveTask, boolean>(
        ['lastSolveResultsBySimulationId', simulationId],
        () => getLastSolveResultsBySimulationId(simulationId),
        {
            refetchOnWindowFocus: false,
            enabled: !!simulationId.length && enabled,
            staleTime: 60000, // stale time is set to 1 minute, after that time it refetches
        }
    );
};
