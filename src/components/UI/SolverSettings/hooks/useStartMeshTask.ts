import axios from '@/client';
import {Mesh} from '@/types'

export const startMeshTask = async (modelId: string): Promise<Mesh> => {

  const { data } = await axios.patch<Mesh>(
    `meshes?modelId=${modelId}`
  );

  return data;
};