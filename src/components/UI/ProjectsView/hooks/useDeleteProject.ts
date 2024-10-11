import axios from '@/client';
import { useMutation } from '@tanstack/react-query';

interface UseMutationVariables {
  projectId: string | undefined;
}

export const useDeleteProject = () =>
  useMutation(async ({ projectId }: UseMutationVariables) => {
    const { data } = await axios.delete(`projects/${projectId}`);
    return data;
  });
