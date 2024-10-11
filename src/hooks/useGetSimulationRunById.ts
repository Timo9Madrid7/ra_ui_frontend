import axios from '@/client';
import { SimulationRun } from '@/types';

export const getSimulationRunById = async (simulationRunId: string): Promise<SimulationRun> => {
  const { data } = await axios.get<SimulationRun>(`simulations/run/${simulationRunId}`);

  return data;
};
