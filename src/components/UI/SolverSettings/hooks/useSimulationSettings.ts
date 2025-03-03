import axios from '@/client';
import { useQuery } from '@tanstack/react-query';
import { MethodEnum } from '@/enums';

const getSimulationSetting = async (method: string) => {
    const { data } = await axios.get('/simulation_Settings/' + method);

    return data;
};

export const useSimulationSetting = (enabled = true, method = MethodEnum.DE
) => {
    const query = useQuery(
        ['simulationSetting'],
        () => getSimulationSetting(method),
        {
            enabled: enabled,
            refetchOnWindowFocus: false,
        }
    );

    return query;
};