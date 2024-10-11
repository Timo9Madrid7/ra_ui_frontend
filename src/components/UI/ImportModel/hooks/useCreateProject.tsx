import { useMutation } from '@tanstack/react-query';
import axios from '@/client';
import {
  Project,
  NewProject
} from '@/types';

const createProject = async (project: NewProject) => {
  const { data } = await axios.post<Project>(`projects`, project);
  return data;
};

export const useCreateProject = () => {
  return useMutation(async (project: NewProject) => await createProject(project));
};
