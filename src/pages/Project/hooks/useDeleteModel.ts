import axios from '@/client';

import {useMutation} from '@tanstack/react-query';

export const useDeleteModel = () =>
    useMutation(async (modelId: string) => {
        const response = axios.delete(`models/${modelId}`);
        return response;
    });
