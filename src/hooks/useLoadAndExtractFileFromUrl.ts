import axios from 'axios';

import { useQuery } from '@tanstack/react-query';
import JSZip from 'jszip';

export const loadAndExtractFile = async (
  url: string,
  type = '.3dm'
): Promise<{ fileData: ArrayBufferLike; fileName: string } | null> => {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  const zipData = response.data;
  const zip = await JSZip.loadAsync(zipData);
  const files = Object.values(zip.files);
  const modelFile = files.find((file) => file.name.includes(type));
  if (modelFile) {
    const fileData = await modelFile.async('arraybuffer');

    return { fileData, fileName: modelFile.name };
  } else {
    return null;
  }
};

export const useLoadAndExtractFileFromUrl = (
  url: string | null,
  modelId: string | null,
  type?: string,
  staleTime?: number
) => {
  const query = useQuery(['modelFile', modelId!], () => loadAndExtractFile(url!, type), {
    enabled: !!url && !!modelId,
    refetchOnWindowFocus: false,
    staleTime,
  });

  return query;
};
