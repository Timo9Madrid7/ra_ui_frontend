import { useQuery } from '@tanstack/react-query';

import axios from '@/client';
import { Simulation } from '@/types';

export const getSimulationById = async (simulationId: string): Promise<Simulation> => {
  const { data } = await axios.get(`simulations/${simulationId}`);
  console.log ("Simulation with id " + data.id + " has status " + data.status);

  return data;
};

export const useGetSimulationById = (simulationId: string, refetch = true) => {
  return useQuery<Simulation>(['simulation', simulationId], () => getSimulationById(simulationId), {
    enabled: !!simulationId && simulationId.length > 0 && refetch,
    refetchOnWindowFocus: false,
  });
};
