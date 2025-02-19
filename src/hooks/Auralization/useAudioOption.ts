import { AnechoicOption } from '@/types';
import axios from '@/client';
import { useQuery } from '@tanstack/react-query';

const getAudios = async () => {
  const { data } = await axios.get('/auralizations/audiofiles');

  return data;
};

export const useGetAudios = (enabled = true) => {
  const query = useQuery<AnechoicOption[], Error>(
    ['anechoic'],
    () => getAudios(),
    {
      enabled: enabled,
      refetchOnWindowFocus: false,
    }
  );

  return query;
};
