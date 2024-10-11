import axios from '@/client';
import {AxiosError} from 'axios';
import toast from 'react-hot-toast';
import {useQuery} from '@tanstack/react-query';

import {Mesh} from '@/types'

const getCompletedMeshTasks = async (modelId: string): Promise<Mesh[]> => {
    const {data} = await axios.get(`meshes?modelId=${modelId}`);

    return data;
};

export const useGetCompletedMeshTasks = (modelId: string) => {
    const query = useQuery<Mesh[], AxiosError>(
        ['completed-mesh-tasks', modelId],
        () => getCompletedMeshTasks(modelId),
        {
            enabled: !!modelId,
            refetchOnWindowFocus: false,
        }
    );
    if (query.isError)
        toast.error(`Error getting completed mesh tasks for model: ${modelId}`);

    return query
}
