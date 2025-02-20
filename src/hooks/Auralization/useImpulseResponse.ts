import axios from '@/client';
import { useQuery } from '@tanstack/react-query';

const getImpulseResponseAudio = async (simulationId: string) => {
  const { data } = await axios.get(`/auralizations/${simulationId}/impulse/wav`, {
      responseType: 'arraybuffer',
  });

  return data;
};

export const useGetImpulseResponseAudio = (simulationId: string, enabled = true) => {
  const query = useQuery(
    ['impulse'],
    () => getImpulseResponseAudio(simulationId),
    {
      enabled: enabled,
      refetchOnWindowFocus: false,
    }
  );

  return query;
};
