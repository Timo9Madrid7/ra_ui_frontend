import { useMutation } from '@tanstack/react-query';
import axios from '@/client';
import { Simulation } from '@/types';

const updateSimulationAndSettings = async (newSimulation: Simulation): Promise<Simulation> => {
  delete newSimulation.simulationRun
  const { data } = await axios.put<Simulation>(
    `simulations/${newSimulation.id}`, JSON.stringify(newSimulation)
  );
  return data;
};

export const useUpdateSimulationAndSettings = () => {
  return useMutation(async (simulation: Simulation) => await updateSimulationAndSettings(simulation), {
    onSuccess: (data) => data,
  });
};
