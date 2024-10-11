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
} from '@/hooks';
import {
    useGetGeometryCheckTask,
    useGetGeometryCheckResult,
    useStartGeometryCheckTask,
} from '../hooks'
import {Status} from "@/types";


export const ImportModelStep1 = (
    {
        file,
        setFile,
        importStarted,
        setImportStarted,
        setGeometryObject,
        setImportError,
    }: {
        file: File | null;
        setFile: (file: File | null) => void;
        importStarted: boolean;
        setImportStarted: (value: boolean) => void;
        setGeometryObject: (value) => void;
        setImportError: (value: string | null) => void;
    }) => {
    const [ongoingGeometryCheckId, setOngoingGeometryCheckId] = useState<string | null>(null);
    const [geometryCheckTaskId, setGeometryCheckTaskId] = useState<string | null>(null);

    const {mutate: startGeometryCheckTask} = useStartGeometryCheckTask();
    const {data: geometryCheckTaskData} = useGetGeometryCheckTask(ongoingGeometryCheckId, true);
    const {data: geometryCheckResultsData} = useGetGeometryCheckResult(geometryCheckTaskId);

    useEffect(() => {
        if (importStarted) startImporting();
    }, [importStarted]);


    // upload file to the system
    const startImporting = async () => {

        if (file) {
            toast.success('Importing geometry started');
            setImportError(null);
            setGeometryObject(null);
            setOngoingGeometryCheckId(null);

            const uploadId = await uploadFileToSystem(file);

            if (uploadId) geometryChecking(uploadId);
        }
    };

    // check the geometry file imported to the system
    const geometryChecking = (uploadId: string) => {
        startGeometryCheckTask(
            {
                inputFileUploadId: uploadId,
            },
            {
                onSuccess: (response: string) => {
                    setOngoingGeometryCheckId(response);
                },
                onError: () => {
                    onGeometryCheckError('Error occurred while checking the geometry');
                },
            }
        );
    };

    // watcher for the result
    useEffect(() => {
        if (ongoingGeometryCheckId && geometryCheckTaskData) {
            if (geometryCheckTaskData.task.status === Status.Completed) {
                setGeometryCheckTaskId(geometryCheckTaskData.task.id);
            } else if (geometryCheckTaskData.task.status === Status.Error) {
                onGeometryCheckError('There is an error while importing geometry.');
            } else if (geometryCheckTaskData.task.status === Status.Cancelled) {
                onGeometryCheckError('Importing geometry timed out');
            }
        }
    }, [geometryCheckTaskData]);

    // result is here
    useEffect(() => {
        if (geometryCheckResultsData) {
            setGeometryObject(geometryCheckResultsData);
        }
    }, [geometryCheckResultsData]);


    const onDropFileUpload = (event: React.DragEvent<HTMLElement>) => {
        if (event.dataTransfer.files) {
            const file = Array.from(event.dataTransfer.files)[0];
            setFile(file);
            setImportError(null);
        }
    };

    const onChangeFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.currentTarget.files) {
            const file = Array.from(event.currentTarget.files)[0];
            setFile(file);
            setImportError(null);
        }
    };

    const onGeometryCheckError = (errorMessage: string) => {
        setImportStarted(false);
        setImportError(errorMessage);
        setOngoingGeometryCheckId(null);
        toast.error(errorMessage);
    };

    return (
        <Stack position={'relative'}>
            {importStarted && (
                <LoadingFullScreen
                    top={12}
                    left={12}
                    message="Importing geometry"
                    note="This can take up to a minute"
                />
            )}

            <Uploader
                disabled={importStarted}
                accept={'.obj'}
                acceptText="OBJ file accepted only"
                onChange={onChangeFileUpload}
                onDrop={onDropFileUpload}
            />
        </Stack>
    );
};
