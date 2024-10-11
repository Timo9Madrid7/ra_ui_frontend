import {useEffect, useState} from 'react';

/**
 * Components
 * */
import {Stack} from '@mui/material';
import toast from 'react-hot-toast';
import {
    Uploader,
    LoadingFullScreen
} from '@/components';


/**
 * Hooks
 * */
import {
    uploadFileToSystem,
    useStartGeoCheckTask,
} from '@/hooks';
import {ModelActionType, useModelContext} from "@/context";


export const MissingGeo = (
    {
        modelId,
    }: {
        modelId: string
    }) => {

    const {mutate: startGeoCheckTask} = useStartGeoCheckTask();
    const [importStarted, setImportStarted] = useState(false)
    const [file, setFile] = useState<File | null>(null);

    const {dispatch: modelDispatch, modelInformation} = useModelContext();


    useEffect(() => {
        if (importStarted) startImporting();
    }, [importStarted]);


    // upload file to the system
    const startImporting = async () => {

        if (file) {
            toast.success('Importing .geo file started');

            const uploadId = await uploadFileToSystem(file);
            setImportStarted(false)
            setFile(null)
            if (uploadId) geoChecking(uploadId)
        }
    };

    const onCheckError = (errorMessage: string) => {
        setImportStarted(false);
        setFile(null);
        toast.error(errorMessage);
    };

    const onSuccess = (message: string) => {
        setImportStarted(false);
        setFile(null);
        toast.success(message);
        if (modelInformation) {
            modelInformation.hasGeo = true
            modelDispatch({
                type: ModelActionType.UPDATE_MODEL_INFORMATION,
                modelInformation: modelInformation,
            });
        }
    }


    // check the geometry file imported to the system
    const geoChecking = (uploadId: string) => {
        startGeoCheckTask(
            {
                inputFileUploadId: uploadId,
                modelId: modelId
            },
            {
                onSuccess: (response: { status: boolean, message: string }) => {
                    if (response.status) {
                        onSuccess(response.message)
                    } else toast.error(response.message)
                },
                onError: () => onCheckError('Error occurred while checking the .geo file'),
            }
        );
    };

    const onDropFileUpload = (event: React.DragEvent<HTMLElement>) => {
        if (event.dataTransfer.files) {
            const file = Array.from(event.dataTransfer.files)[0];
            setFile(file);
            setImportStarted(true)
        }
    };

    const onChangeFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.currentTarget.files) {
            const file = Array.from(event.currentTarget.files)[0];
            setFile(file);
            setImportStarted(true)
        }
    };

    return (
        <Stack position={'relative'}>
            {importStarted && (
                <LoadingFullScreen
                    top={12}
                    left={12}
                    message="Importing .geo file"
                    note="This can take some time"
                />
            )}

            {!importStarted && <Uploader
                color={'red'}
                disabled={false}
                accept={'.geo'}
                acceptText="Geo file accepted ONLY!"
                onChange={onChangeFileUpload}
                onDrop={onDropFileUpload}
            />}
        </Stack>
    );
};
