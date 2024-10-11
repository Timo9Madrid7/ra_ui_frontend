import axios from '@/client';

/** Hooks */
import { useQuery } from '@tanstack/react-query';

/** Types */
import { ProjectSimulationsDto } from '../types';

const getAllProjectSimulations = async (): Promise<ProjectSimulationsDto[]> => {
  const { data } = await axios.get(`projects/simulations`);

  return data;
};

export const useGetAllProjectSimulations = (enabled = true) => {
  const query = useQuery<ProjectSimulationsDto[]>(['all-project-simulations'], () => getAllProjectSimulations(), {
    refetchOnWindowFocus: false,
    enabled,
  });

  return query;
};
