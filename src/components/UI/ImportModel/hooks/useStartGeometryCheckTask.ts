import {useMutation} from '@tanstack/react-query';
import axios from '@/client';

export type StartGeometryCheckTask = {
    inputFileUploadId: string;
};

const startGeometryCheckTask = async (request: StartGeometryCheckTask): Promise => {

    const {data} = await axios.post(
        `/geometryCheck?fileUploadId=${request.inputFileUploadId}`,
    );
    return data.id;
};

export const useStartGeometryCheckTask = () => {
    return useMutation(async (request: StartGeometryCheckTask) => await startGeometryCheckTask(request));
};

