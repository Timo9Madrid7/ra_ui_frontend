import axios from '@/client';
import { useQuery } from '@tanstack/react-query';
import { MethodEnum } from '@/enums';
import { CustomSettingResponse } from '@/types';

const getSimulationSetting = async (method: string) => {
    const { data } = await axios.get('/simulation_settings/' + method);
    return data;
};

export const useSimulationSettingParams = (enabled = true, method: string = MethodEnum.DE) => {
    const query = useQuery<CustomSettingResponse>(
        ['simulationSetting', method],
        () => getSimulationSetting(method),
        {
            enabled: enabled,
            refetchOnWindowFocus: false,
            cacheTime: 0, // Skip cache and always fetch fresh data
        }
    );

    return query;
};