import {useMutation} from '@tanstack/react-query';
import axios from '@/client';

export type StartGeoCheckTask = {
    inputFileUploadId: string;
    modelId: string
};

const startGeoCheckTask = async (request: StartGeoCheckTask): Promise => {

    const {data} = await axios.post(
        `/meshes/geo?fileUploadId=${request.inputFileUploadId}&modelId=${request.modelId}`,
    );
    return data;
};

export const useStartGeoCheckTask = () => {
    return useMutation(async (request: StartGeoCheckTask) => await startGeoCheckTask(request));
};

