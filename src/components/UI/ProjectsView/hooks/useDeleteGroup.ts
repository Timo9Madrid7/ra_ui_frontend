import axios from '@/client';
import { useMutation } from '@tanstack/react-query';

interface UseMutationVariables {
  group: string | undefined;
}

export const useDeleteGroup = () =>
  useMutation(async ({ group }: UseMutationVariables) => {
    const { data } = await axios.delete(`/projects/deleteByGroup?group=${group}`);
    return data;
  });
