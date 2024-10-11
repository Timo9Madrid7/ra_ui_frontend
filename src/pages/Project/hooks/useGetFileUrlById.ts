import axios from '@/client';

import {useQuery} from '@tanstack/react-query';

const getDownloadUrl = async (fileId?: string) => {
    if (fileId) {
        const {data} = await axios.get(`files/${fileId}`);
        return data;
    }
};

export const useGetFileUrlById = (fileId?: string, staleTime?: number) =>
    useQuery<string, boolean>(['fileId', fileId], () => getDownloadUrl(fileId),
        {
            enabled: !!fileId,
            refetchOnWindowFocus: false,
            staleTime,
        }
    );
