import axios from '@/client';
import {useMutation} from '@tanstack/react-query';
import {Project} from '@/types';

const updateProject = async (request: Project) => {
    const {data} = await axios.patch(`projects/${request.id}`, {
        name: request.name,
        description: request.description,
    });
    return data;
};

export const useUpdateProject = () => {
    return useMutation(async (data: Project) => await updateProject(data));
};
