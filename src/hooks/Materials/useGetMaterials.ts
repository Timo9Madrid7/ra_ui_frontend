import axios from '@/client';
import toast from 'react-hot-toast';

/** Hooks */
import { useQuery } from '@tanstack/react-query';

/** Types */
import { Material } from '@/types';
import { AxiosError } from 'axios';

const getMaterials = async () => {
  const { data } = await axios.get(`/materials`);

  return data;
};

export const useGetMaterials = () => {
  const query = useQuery<Material[], boolean>(['materials'], () => getMaterials(), {
    refetchOnWindowFocus: false,
    onError: (error: unknown) => {
      if (error instanceof AxiosError && error.response?.status !== 403) {
        toast.error('An error occurred while fetching materials. Please refresh the browser.');
      }
    },
  });

  return query;
};
