import axios from '@/client';
import { useQuery } from '@tanstack/react-query';

import { Project } from '@/types';

const getProjectById = async (projectId: string) => {
  const { data } = await axios.get(`projects/${projectId}`);


  return data;
};

export const useGetProjectById = (projectId: string) =>
  useQuery<Project, boolean>(['projectId', projectId], () => getProjectById(projectId), {
    enabled: !!projectId,
    refetchOnWindowFocus: false,
  });
