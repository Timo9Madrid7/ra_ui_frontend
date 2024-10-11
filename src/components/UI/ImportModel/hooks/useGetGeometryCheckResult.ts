import { useQuery } from '@tanstack/react-query';
import axios from '@/client';

export const getGeometryCheckResult = async (taskId: string | null): Promise<any> => {
  if (taskId) {
    const { data } = await axios.get(`/geometryCheck/result?taskId=${taskId}`);

    return data;
  }
};

export const useGetGeometryCheckResult = (taskId: string | null) => {
  return useQuery(['geometryCheckResult', taskId], () => getGeometryCheckResult(taskId), {
    enabled: !!taskId,
    refetchOnWindowFocus: false,
  });
};
