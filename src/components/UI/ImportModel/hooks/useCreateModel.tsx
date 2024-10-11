import { useMutation } from '@tanstack/react-query';
import axios from '@/client';
import {
  Model,
  NewModel
} from '@/types';

const createModel = async (request: NewModel) => {
  const { data } = await axios.post<Model>(`models`, {}, {
    params: {
      ...request,
    },
  });
  return data;
};

export const useCreateModel = () => {
  return useMutation(async (model: NewModel) => await createModel(model));
};
