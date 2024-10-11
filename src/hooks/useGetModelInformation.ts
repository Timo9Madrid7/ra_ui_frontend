import axios from '@/client';
import toast from 'react-hot-toast';

/** Hooks */
import { useQuery } from '@tanstack/react-query';

/** Types */
import { ModelInformation } from '@/types';
import { AxiosError } from 'axios';

const getModelInformation = async (modelId: string) => {
  const { data } = await axios.get(`models/${modelId}`);

  return data;
};

export const useGetModelInformation = (modelId: string | null) => {
  const query = useQuery<ModelInformation, AxiosError>(
    ['model-information', modelId],
    () => getModelInformation(modelId!),
    {
      enabled: !!modelId,
      refetchOnWindowFocus: false,
      retry: false,
      onError: () => {
        toast.error(`Could not get information for model with id ${modelId}`, {
          className: 'editor-toast',
          toastId: `model-information-${modelId}`,
        });
      },
    }
  );

  return query;
};
