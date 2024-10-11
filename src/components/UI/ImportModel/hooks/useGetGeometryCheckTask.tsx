import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import axios from '@/client';
import {Status} from "@/types";

const MAX_POLL = 200;

let timedOut = false;

const getGeometryCheckTask = async (geometryCheckTaskId: string | null, shouldPoll: boolean): Promise<any> => {
  if (!timedOut && shouldPoll && geometryCheckTaskId) {
    const { data } = await axios.get(`/geometryCheck`, {
      params: {
        geometryCheckId: geometryCheckTaskId,
      },
    });

    return data;
  } else {
    if (timedOut) {
      const data = { task: { status: 'TimedOut' } };
      return data;
    } else {
      return { task: { status: 'WeirdError' } };
    }
  }
};

export const useGetGeometryCheckTask = (geometryCheckTaskId: string | null, shouldRefetch: boolean) => {
  return useQuery<any, boolean>(
    ['geometry-check-task-id', geometryCheckTaskId],
    () => getGeometryCheckTask(geometryCheckTaskId, shouldRefetch),
    {
      enabled: !!geometryCheckTaskId && shouldRefetch,
      refetchOnWindowFocus: false,
      // Refetch the data every 2 second
      refetchInterval: (data, query) => {
        if (query.state.dataUpdateCount > MAX_POLL) {
          timedOut = true;
        } else if (
          data?.task.status === Status.Completed ||
          data?.task.status === Status.Error ||
          data?.task.status === Status.Cancelled
        ) {
          return false;
        }

        return 2000;
      },
      onError: () => {
        toast.error('Error occurred while fetching geometry task');
      },
    }
  );
};
