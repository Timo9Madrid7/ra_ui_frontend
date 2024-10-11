import {useEffect, useState} from 'react';

/** Components */
import {
    Box,
    Stack,
    TextField,
} from '@mui/material';

import {
    Loading,
    Select
} from '@/components';

import {AddNewGroupPopup} from './AddNewGroupPopup.tsx';
import {AddNewProjectPopup} from './AddNewProjectPopup.tsx';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import {useGetProjects} from "@/hooks";

export const ImportModelStep2 =
    ({
         filename,
         thumbnailSrc,
         setUploadModelInfo,
         hasNewProject,
         setHasNewProject,
         setModelsInProject,
     }: {
        filename: string;
        thumbnailSrc: string;
        setUploadModelInfo: (value) => void;
        hasNewProject: boolean;
        setHasNewProject: (value) => void;
        setModelsInProject: (value: SelectOption[]) => void;
    }) => {

        const {data: availableProjects, isLoading} = useGetProjects();

        const [group, setGroup] = useState('');
        const [project, setProject] = useState('');
        const [model, setModel] = useState('');
        const [projectDescription, setProjectDescription] = useState('');
        const [newProject, setNewProject] = useState('');
        const [newGroup, setNewGroup] = useState('');
        const [availableGroups, setAvailableGroups] = useState<SelectOption[]>([]);
        const [availableProjectsInGroup, setAvailableProjectsInGroup] = useState<SelectOption[]>([]);
        const [groups, setGroups] = useState<SelectOption[]>([]);
        const [projectsInGroup, setProjectsInGroup] = useState<SelectOption[]>([]);
        const [showNewGroupPopup, setShowNewGroupPopup] = useState(false);
        const [showNewProjectPopup, setShowNewProjectPopup] = useState(false);

        const updateUploadModelInfo = () => {
            if (project && group && model) {
                setUploadModelInfo({
                    model: model,
                    group: group,
                    projectName: hasNewProject ? newProject : '',
                    projectId: project,
                    projectDescription: projectDescription,
                });
            } else setUploadModelInfo(null)

        };

        useEffect(() => {
            updateUploadModelInfo();
        }, [model, project, group]);

        useEffect(() => {
            if (availableProjects?.length) {
                let groups = availableProjects.map((project) => {
                    return project.group || 'none';
                });
                groups = [...new Set(groups)];
                const options = groups.map((group) => {
                    return {id: group, name: group};
                });
                setGroups(options);
                setAvailableGroups(options);
            }
        }, [availableProjects]);

        const setSelectedGroup = (group: string) => {
            if (availableProjects?.length) {
                const currentProjects = availableProjects
                    .filter((project) => project.group == group)
                    .map((project) => {
                        return {id: project.id, name: project.name};
                    });

                setProjectsInGroup(currentProjects);
                setAvailableProjectsInGroup(currentProjects);
            }

            setGroup(group);
            setProject('');
        };

        const setSelectedProject = (project: string) => {
            if (project === newProject) {
                setHasNewProject(true);
            } else {
                setHasNewProject(false);

                if (availableProjects?.length) {
                    const modelsInProject = availableProjects
                        .filter((s) => s.id == project)[0]
                        .models.map((model) => {
                            return {id: model.id, name: model.name};
                        });

                    setModelsInProject(modelsInProject);
                }
            }

            setProject(project);
        };

        const addNewGroup = (groupName: string) => {
            const currentGroups = [...availableGroups];
            currentGroups.push({id: groupName, name: groupName});

            setGroups(currentGroups);
            setGroup(groupName);

            setProjectsInGroup([]);
            setProject('');
            setNewGroup(groupName);
        };

        const addNewProject = (projectName: string, projectDescription: string) => {
            const currentProjects = [...availableProjectsInGroup];
            currentProjects.push({id: projectName, name: projectName});

            setProjectsInGroup(currentProjects);
            setProject(projectName);
            setProjectDescription(projectDescription);
            setHasNewProject(true);
            setNewProject(projectName);
        };

        return (
            <>
                {isLoading ? <Loading/> : (
                    <Box component={'div'} display="flex" flexDirection={'row'} gap={'20px'}
                         justifyContent={'space-between'} paddingTop={2}>
                        <Stack display={'flex'} flexDirection={'column'} width={'35%'} justifyContent={'center'}>
                            <img src={thumbnailSrc} alt="model image"/>
                            <Stack gap={1} flexDirection={'column'} alignItems={'center'}>
                                <h6 title={filename}>
                                    <InventoryOutlinedIcon/>
                                    <span>{filename}</span>
                                </h6>
                            </Stack>
                        </Stack>

                        <Stack gap={'20px'} flexDirection={'column'} width={'61%'}>

                            <TextField
                                autoFocus
                                color={'secondary'}
                                label="Model Name"
                                placeholder={'enter name of the new model'}
                                variant="outlined"
                                autoComplete="off"
                                value={model}
                                onChange={(e) => {
                                    setModel(e.target.value)
                                }}
                            />
                            <Select
                                label="Group: "
                                value={group ?? ''}
                                setValue={setSelectedGroup}
                                items={groups}
                                placeholder="Select group"
                                actionButton={{
                                    label: newGroup && newGroup == group ? 'Change group' : 'New group',
                                    icon: <AddCircleOutlineOutlinedIcon/>,
                                    onClick: () => setShowNewGroupPopup(true),
                                }}
                            />
                            <Select
                                label="Project: "
                                value={project ?? ''}
                                setValue={setSelectedProject}
                                items={projectsInGroup}
                                placeholder="Select project"
                                actionButton={{
                                    label: newProject && newProject == project ? 'Change project' : 'New project',
                                    icon: <AddCircleOutlineOutlinedIcon/>,
                                    onClick: () => setShowNewProjectPopup(true),
                                }}
                                disabled={!group} //TODO: check to see if it loads to step3
                            />
                        </Stack>
                    </Box>
                )}
                {showNewGroupPopup && (
                    <AddNewGroupPopup
                        addNewGroup={addNewGroup}
                        onClose={() => setShowNewGroupPopup(false)}
                        groups={availableGroups}
                    />
                )}
                {showNewProjectPopup && (
                    <AddNewProjectPopup
                        addNewProject={addNewProject}
                        onClose={() => setShowNewProjectPopup(false)}
                        projects={availableProjectsInGroup}
                    />
                )}
            </>
        );
    }
;
