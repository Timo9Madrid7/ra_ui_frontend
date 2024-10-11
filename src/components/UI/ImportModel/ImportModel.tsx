import {useEffect, useState} from 'react';

/** Components */
import {
    Box,
    DialogContent,
    DialogActions,
} from '@mui/material';
import toast from 'react-hot-toast';
import {
    Dialog,
    Stepper,
    DefaultButton,
    LoadingFullScreen, SuccessButton
} from '@/components';
import {ImportModelStep1} from './components/ImportModelStep1.tsx';
import {ImportModelStep2} from './components/ImportModelStep2.tsx';

/**
 * Icons
 * */
import KingBedIcon from '@mui/icons-material/KingBed';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

/**
 * Assets
 * */
import thumbnailSrc from '@/assets/images/3d-model-thumb2.png';

/**
 * Hooks
 * */

import {
    useCreateModel,
    useCreateProject
} from './hooks';
import {AddCircleOutline, ArrowBack} from "@mui/icons-material";

/**
 * Types
 */
type ModelInfo = {
    model: string;
    group: string;
    projectId: string;
    projectName: string;
    projectDescription: string
};

export const ImportModel = (
    {
        setShowPopup,
        uploadModelDone,
    }: {
        setShowPopup: (value: boolean) => void;
        uploadModelDone: (projectId: string | null) => void;
    }) => {
    const [stepSelected, setStepSelected] = useState(0);
    const [file, setFile] = useState<File | null>(null);
    const [importStarted, setImportStarted] = useState(false);
    const [geometryObject, setGeometryObject] = useState(null);
    const [modelsInProject, setModelsInProject] = useState<SelectOption[]>([]);
    const [hasNewProject, setHasNewProject] = useState(false);
    const [readyToUpload, setReadyToUpload] = useState(false);
    const [uploadModelInfo, setUploadModelInfo] = useState<ModelInfo | null>(null);
    const [importError, setImportError] = useState<string | null>(null);
    const [uploadingModel, setUploadingModel] = useState(false);
    const [projectIdForUpload, setProjectIdForUpload] = useState<string | null>(null);

    const {mutate: createProject} = useCreateProject();
    const {mutate: createModel} = useCreateModel();

    useEffect(() => {
        if (stepSelected === 0) {
            setFile(null);
            setUploadingModel(false);
        }
    }, [stepSelected]);

    // trigger start import in Step 1
    const handleStartImport = () => {
        setImportStarted(true);
    };

    // if geometry import has completed in Step 1, then download feedback json
    useEffect(() => {
        if (geometryObject) {
            setStepSelected(1);
            setImportStarted(false);
        }
    }, [geometryObject]);


    // if uploadModelInfo is set in Step 3, then enable Finish button
    useEffect(() => {
        setReadyToUpload(uploadModelInfo ? true : false);
    }, [uploadModelInfo]);

    // start upload Model process. check if new Project is chosen, then trigger createProject,
    // else if existing Project is chosen, then set ProjectIdForUpload to trigger createModelBase
    const handleStartUploadModel = () => {
        if (uploadModelInfo) {
            if (hasNewProject) {
                setUploadingModel(true);
                handleCreateProject(uploadModelInfo);
            } else {
                if (doesModelNameExist(uploadModelInfo.model)) {
                    toast.error('Model with this name already exists in this project. Please choose another one.');
                    return;
                }
                setUploadingModel(true);
                setProjectIdForUpload(uploadModelInfo.projectId);
            }
        }
    };

    const handleCreateProject = (info: ModelInfo) => {
        createProject(
            {
                name: info.projectName,
                description: info.projectDescription,
                group: info.group,
            },
            {
                onSuccess: (newProject) => {
                    setProjectIdForUpload(newProject.id);
                },
            }
        );
    };


    // if ModelBaseIdForUpload has value, then createModel
    useEffect(() => {
        if (projectIdForUpload && uploadModelInfo) {
            handleCreateModel(projectIdForUpload, uploadModelInfo.model);
        }
    }, [projectIdForUpload]);

    const handleCreateModel = async (projectId: string, modelName: string) => {

        createModel(
            {
                projectId: projectId,
                name: modelName,
                sourceFileId: geometryObject.outputModelId,
            },
            {
                onSuccess: () => {
                    uploadModelDone(projectIdForUpload);
                },
            }
        );
    };

    const doesModelNameExist = (name: string) => {
        return modelsInProject.length > 0 && modelsInProject.some((m) => m.name.toLowerCase() === name.toLowerCase());
    };

    const steps = ['Import Geometry (Model)', 'Upload the Model'];
    const icons = {
        1: <KingBedIcon/>,
        2: <ErrorOutlineIcon/>,
        3: <AccountTreeIcon/>,
    };

    return (
        <Dialog
            fullWidth
            maxWidth={'sm'}
            open={true}
            title={'Import Your Geometry'}
            onClose={() => setShowPopup(false)}
        >
            <DialogContent>

                <Stepper steps={steps} icons={icons} activeStep={stepSelected}/>


                {stepSelected === 0 && (
                    <ImportModelStep1
                        file={file}
                        setFile={setFile}
                        importStarted={importStarted}
                        setImportStarted={setImportStarted}
                        setGeometryObject={setGeometryObject}
                        setImportError={setImportError}
                    />
                )}

                {stepSelected === 1 && thumbnailSrc && (
                    <ImportModelStep2
                        filename={file?.name || ''}
                        thumbnailSrc={thumbnailSrc}
                        setUploadModelInfo={setUploadModelInfo}
                        hasNewProject={hasNewProject}
                        setHasNewProject={setHasNewProject}
                        setModelsInProject={setModelsInProject}
                    />
                )}
                {uploadingModel && (
                    <LoadingFullScreen
                        message="Adding model to the system"
                        note={'It will take some time'}
                        top={223} left={227} width="333px" height="237px"/>
                )}
            </DialogContent>

            <DialogActions>
                <Box component="div" display="flex" justifyContent="flex-end" alignItems={'center'} gap={2}
                     width={'100%'}>
                    {importError &&
                        <div style={{color: '#ff8a8a', lineHeight: 1.3, paddingRight: 8}}>{importError}</div>}
                    {stepSelected !== 0 && (
                        <DefaultButton
                            sx={{width: 'auto'}}
                            label="Back"
                            icon={<ArrowBack />}
                            onClick={() => setStepSelected(stepSelected - 1)}
                        />
                    )}

                    {stepSelected === 0 ? (
                            <SuccessButton
                                sx={{flexShrink: 0, width: '150px'}}
                                label="Import geometry"
                                disabled={!file || importStarted || importError !== null}
                                onClick={handleStartImport}
                            />
                        ) :
                        (
                            <SuccessButton
                                sx={{width: 'auto'}}
                                label="Finish"
                                icon={<AddCircleOutline />}
                                disabled={!readyToUpload}
                                title={!readyToUpload ? 'Please fill in all fields' : ''}
                                onClick={handleStartUploadModel}
                            />
                        )
                    }
                </Box>
            </DialogActions>
        </Dialog>
    )
        ;
};
