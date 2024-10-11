import toast from 'react-hot-toast';
import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';

/**
 *
 * Components
 * */
import {
    Sidebar,
    PageLayout,
    Breadcrumbs,
    ConfirmationDialog, RecentSimulationNav,
} from '@/components';

import {
    ProjectModel,
    UpdateModelDialog
} from './components';

/**
 * Hooks
 * */
import {
    useDeleteModel,
    useGetProjectById,
    useGetFileUrlById,
} from './hooks';


/**
 *
 * Types
 * */
import {
    Model,
    Action
} from '@/types';

/**
 * Assets
 * */
import classes from './classes.module.scss';
import thumbnail from '@/assets/images/3d-model-thumb2.png';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import DeleteSweepOutlinedIcon from "@mui/icons-material/DeleteSweepOutlined";
import {ModelProvider, SimulationProvider} from "@/context";


export const Project = () => {
    const params = useParams();

    const {
        data: project,
        isFetching: isFetchingProject,
        refetch: refetchProjects
    } = useGetProjectById(params.id as string);

    const [models, setModels] = useState(project?.models);
    const deleteModel = useDeleteModel();
    const [selectedModel, setSelectedModel] = useState({} as Model);

    // State for download file
    const [sourceModelUploadId, setSourceModelUploadId] = useState('');
    const {data: downloadFile} = useGetFileUrlById(sourceModelUploadId);

    // States for dialogs
    const [showUpdate, setShowUpdate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    useEffect(() => {
        if (project?.models) {
            setModels(
                project.models.sort((a: Model, b: Model) =>
                    new Date(b.createdAt) > new Date(a.createdAt) ? 1 : -1
                )
            );
        }
    }, [project]);

    // Model actions
    const modelActions = (model: Model): Action[] => [
        {
            value: 'Edit Model',
            onClick: () => {
                setSelectedModel(model);
                setShowUpdate(true);
            },
            key: 'edit-model-name',
            title: 'Edit the model name',
            icon: <EditNoteOutlinedIcon/>
        },
        {
            value: 'Delete Model',
            onClick: () => {
                setSelectedModel(model);
                setShowDelete(true);
            },
            key: 'delete-model-obj',
            title: 'Delete the model record',
            icon: <DeleteSweepOutlinedIcon/>
        },
        {
            value: 'Download 3D Model',
            onClick: () => {
                setSourceModelUploadId(model.sourceFileId)
            },
            key: 'download-model-file',
            title: 'Download the model file',
            icon: <FileDownloadOutlinedIcon/>
        },
    ];

    useEffect(
        () => {
            if (downloadFile) {
                const link = document.createElement('a');
                link.download = 'model_file';
                link.href = downloadFile;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }, [downloadFile]);


    // Update model handler
    const handleUpdateModel = (updatedModel: Model) => {
        setShowUpdate(false);

        setModels(models?.map((model) => {
                const temp = Object.assign({}, model);
                if (temp.id === updatedModel.id) {
                    temp.name = updatedModel.name;
                }
                return temp;
            })
        );
    }

    // Delete model handler
    const handleDeleteModel = (model: Model) => {
        deleteModel.mutate(model.id, {
                onSuccess: () => {
                    refetchProjects().then(
                        () => toast.success(`' ${model.name} ' Deleted!`)
                    );
                },
                onError: () => {
                    toast.error('Error deleting Model!');
                },
            }
        );
    }

    return (
        <ModelProvider>
            {/*TODO: think about this: how to solve etc*/}
            <SimulationProvider>
                <PageLayout
                    extraHeader={
                        !isFetchingProject && project && (
                            <Breadcrumbs
                                items={[
                                    {
                                        text: project?.group,
                                        link: '/',
                                    },
                                    {
                                        text: project?.name,
                                    },
                                ]}
                            />
                        )
                    }
                    sidepanel={<Sidebar/>}
                    sidepanelExtraHeader={<RecentSimulationNav/>}
                >
                    <div className={`${classes.project_container}`} id='model_of_a_project_container'>
                        {
                            models?.map(
                                (model) =>
                                    (
                                        <ProjectModel
                                            id={model.id}
                                            model={model}
                                            key={model.id}
                                            thumbnail={thumbnail}
                                            modelActions={modelActions(model)}
                                        />
                                    )
                            )}
                    </div>

                    {showDelete && (
                        <ConfirmationDialog
                            title="Delete Model"
                            message={`Are you sure you want to delete ${selectedModel.name.toUpperCase()} ?`}
                            onConfirm={() => {
                                handleDeleteModel(selectedModel);
                                setShowDelete(false);
                            }}
                            onCancel={() => setShowDelete(false)}
                        />
                    )}


                    {showUpdate && (
                        <UpdateModelDialog
                            showUpdate={showUpdate}
                            onClose={() => setShowUpdate(false)}
                            onUpdate={(response) => handleUpdateModel(response)}
                            selectedModel={selectedModel}
                        />
                    )}


                </PageLayout>
            </SimulationProvider>
        </ModelProvider>
    );
};
