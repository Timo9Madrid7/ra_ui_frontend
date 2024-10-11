import axios from '@/client';

type UploadSlot = {
    url: string;
    id: string;
};

const getFileSlot = async () => {
    const response = await axios.get(`/files`);

    return response.status == 200
        ? {url: response.data.uploadUrl, id: response.data.id}
        : {url: '', id: ''};
};

const postFileAndGetUploadId = async (file: File | Blob, filename: string, uploadSlot: UploadSlot) => {
    const fileBlob = new Blob([file]);
    const fileFormData = new FormData();
    fileFormData.append('file', fileBlob, filename);

    const fileRequest: RequestInit = {
        method: 'POST',
        mode: 'no-cors',
        body: fileFormData,
    };

    await fetch(uploadSlot.url, fileRequest);

    const fileUploadId = await deleteSlot(uploadSlot.id);

    return fileUploadId;
};

const uploadFile = async (file: File) => {
    const uploadSlot = await getFileSlot();

    return postFileAndGetUploadId(file, file.name, uploadSlot);
};

export const uploadFileToSystem = (file: File) => {
    return uploadFile(file);
};


const deleteSlot = async (uploadSlotId: string) => {
    const response = await axios.delete(`/files?slot=${uploadSlotId}`)

    return response.data.id;
};