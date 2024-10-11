import axios from '@/client';

/** Hooks */
import { useQuery } from '@tanstack/react-query';

/** Types */
import { Project } from '@/types';

const getProjects = async () => {
  const { data } = await axios.get('/projects');

  return data;
};

export const useGetProjects = (enabled = true) => {
  const query = useQuery<Project[], boolean>(['projects'], () => getProjects(), {
    enabled: enabled,
    refetchOnWindowFocus: false,
  });

  return query;
};
