import axios from '@/client';
import {useMutation} from '@tanstack/react-query';


type UpdateModelRequest = {
    id: string;
    name: string;
};

const updateModel = async (request: UpdateModelRequest) => {
    const {data} = await axios.patch(`models/${request.id}`, {
        name: request.name
    });
    return data;
};

export const useUpdateModel = () => {
    return useMutation(async (data: UpdateModelRequest) => await updateModel(data));
};
