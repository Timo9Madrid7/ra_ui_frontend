/** Hooks */
import { useMutation } from '@tanstack/react-query';
import axios from '@/client';

export type MissingMaterialInfo = {
  materialId: string;
  materialName: string;
  isSharedWithOrganization: boolean;
  isDeleted: boolean;
};

const getMissingMaterialInfo = async (materialIds: string[]): Promise<MissingMaterialInfo[]> => {
  const { data } = await axios.post(`/api/Material/GetMissingMaterialInfo`, {
    missingMaterialIds: materialIds,
  });

  return data;
};

export const useGetMissingMaterialInfo = () => {
  return useMutation(async (materialIds: string[]) => await getMissingMaterialInfo(materialIds));
};
