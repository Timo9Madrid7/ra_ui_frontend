import { AnechoicOption } from '@/types';
import axios from '@/client';
import { useQuery } from '@tanstack/react-query';

const getSimulationSetting = async (method: string) => {
    const { data } = await axios.get('/simulation_Settings/audiofiles');

    return data;
};

const useParamSetting = (enabled = true, method = "DE"
) => {
    const query = useQuery<AnechoicOption[], Error>(
        ['anechoic'],
        () => getSimulationSetting(method),
        {
            enabled: enabled,
            refetchOnWindowFocus: false,
        }
    );

    return query;
};