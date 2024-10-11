import axios from '@/client';
import {useMutation} from '@tanstack/react-query';

type UpdateGroupRequest = {
    oldGroup: string;
    newGroup: string;
};

const updateGroup = async (request: UpdateGroupRequest) => {
    const {data} = await axios.patch(`/projects/updateByGroup?group=${request.oldGroup}`, {
        newGroup: request.newGroup,
    });
    return data;
};

export const useUpdateGroup = () => {
    return useMutation(async (data: UpdateGroupRequest) => await updateGroup(data));
};
