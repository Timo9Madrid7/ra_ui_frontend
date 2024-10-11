/** Hooks */
import { useMutation } from '@tanstack/react-query';
import axios from '@/client';

const deleteSimulation = async (simulationId: string): Promise<string> => {
  const { data } = await axios.delete(`simulations/${simulationId}`);
  return data;
};

export const useDeleteSimulation = () => {
  return useMutation(async (simulationId: string) => await deleteSimulation(simulationId));
};
