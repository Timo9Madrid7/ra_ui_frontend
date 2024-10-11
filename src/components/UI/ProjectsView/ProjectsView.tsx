import {useEffect, useState} from 'react';

/**
 *
 * Components
 * */
import toast from 'react-hot-toast';

import {
    IDropdownOptions,
    ConfirmationDialog
} from '@/components';
import {
    ProjectsViewCard,
    UpdateGroupDialog,
    UpdateProjectDialog,
} from './components';

/**
 * Hooks
 * */
import {
    useDeleteGroup,
    useDeleteProject
} from './hooks';

/**
 * Types
 * */
import {Action, Project} from '@/types';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import DeleteSweepOutlinedIcon from '@mui/icons-material/DeleteSweepOutlined';


import classes from './styles.module.scss';


interface ProjectsViewProps {
    viewType?: string;
    projects: Project[];
    groups?: IDropdownOptions[];
    shouldShowItem: (group: string) => boolean;
    setProjects: (projects: Project[]) => void;
}

export const ProjectsView = (
    {
        groups,
        projects,
        setProjects,
        shouldShowItem,
        viewType = 'grid',
    }: ProjectsViewProps) => {
    const deleteGroup = useDeleteGroup();
    const deleteProject = useDeleteProject();

    const [groupsLabel, setGroupsLabel] = useState<string[]>([]);
    const [selectedProject, setSelectedProject] = useState({} as Project);
    const [selectedGroup, setSelectedGroup] = useState('');


    const [showUpdateGroupDialog, setUpdateGroupDialog] = useState(false);
    const [showDeleteGroupDialog, setShowDeleteGroupDialog] = useState(false);

    const [showUpdateProjectDialog, setShowUpdateProjectDialog] = useState(false);
    const [showDeleteProjectDialog, setShowDeleteProjectDialog] = useState(false);

    // Take out the labels for simplicity
    useEffect(() => {
        if (groups && groups.length > 0) {
            const tempGroupsLabel: string[] = [];
            groups.forEach(function (group) {
                if (tempGroupsLabel.indexOf(group.label) == -1) tempGroupsLabel.push(group.label);
            });
            setGroupsLabel(tempGroupsLabel);
        }
    }, [groups]);


    // group delete, edit actions
    const groupActions = (group: string): Action[] => [
        {
            key: 'edit_group_name',
            value: 'Edit Group',
            title: 'Edit this Group',
            icon: <EditNoteOutlinedIcon/>,
            onClick: () => {
                setSelectedGroup(group);
                setUpdateGroupDialog(true);
            },
        },
        {
            key: 'delete_group_obj',
            value: 'Delete Group',
            title: 'Delete this group',
            icon: <DeleteSweepOutlinedIcon/>,
            onClick: () => {
                setSelectedGroup(group);
                setShowDeleteGroupDialog(true);
            },
        },
    ];

    // project delete, edit actions
    const projectActions = (project: Project): Action[] => [
        {
            key: 'edit_project_name',
            value: 'Edit Project',
            title: 'Edit this project',
            icon: <EditNoteOutlinedIcon/>,
            onClick: () => {
                setSelectedProject(project);
                setShowUpdateProjectDialog(true);
            },
        },
        {
            key: 'delete_project_obj',
            value: 'Delete Project',
            title: 'Delete this project',
            icon: <DeleteSweepOutlinedIcon/>,
            onClick: () => {
                setSelectedProject(project);
                setShowDeleteProjectDialog(true);
            },
        },
    ];

    // Delete a group handler
    const handleDeleteGroup = (group: string) => {
        deleteGroup.mutate({group}, {
                onSuccess: () => {
                    const updatedProjects = projects.filter(function (project) {
                        return project.group !== group;
                    });
                    setGroupsLabel(
                        groupsLabel.filter(function (groupTag) {
                            return groupTag !== group;
                        })
                    );
                    setProjects(updatedProjects);
                    toast.success(`" ${group} " deleted!`)
                },
                onError: () => toast.error('Error deleting the Group')
            }
        );
    }

    // Delete a project handler
    const handleDeleteProject = (id: string, project: Project) => {
        deleteProject.mutate({projectId: id}, {
                onSuccess: () => {
                    const updatedProjects = projects.filter(function (project) {
                        return project.id !== id;
                    });
                    setProjects(updatedProjects);
                    toast.success(`" ${project.name} " deleted!`);

                },
                onError: () => toast.error('Error deleting the Project')
            }
        );
    }

    // Update a group handler
    const handleUpdateGroup = (group: string) => {
        setUpdateGroupDialog(false);

        const updatedProjects = projects.map(
            (project) => {
                const temp = {...project};
                if (temp.group === selectedGroup) {
                    temp.group = group;
                }
                return temp;
            });
        setProjects(updatedProjects);

    }

    // Update a project handler
    function handleUpdateProject(updatedProject: Project) {
        setShowUpdateProjectDialog(false);

        const updatedProjects = projects.map((project) => {
            const temp = {...project};
            if (temp.id === updatedProject.id) {
                temp.name = updatedProject.name;
                temp.description = updatedProject.description;
            }
            return temp;
        });
        setProjects(updatedProjects);

    }

    return (
        <div className={classes.projects_view_container}>
            {groupsLabel.filter((group) => shouldShowItem(group)).map(
                (group) => (
                    <ProjectsViewCard
                        key={group}
                        group={group}
                        projects={projects}
                        viewType={viewType}
                        groupActions={groupActions}
                        projectActions={projectActions}
                    />
                ))}

            {showUpdateProjectDialog && (
                <UpdateProjectDialog
                    showDialog={showUpdateProjectDialog}
                    selectedProject={selectedProject}
                    onClose={() => setShowUpdateProjectDialog(false)}
                    onUpdate={(response) => handleUpdateProject(response)}
                />
            )}

            {showUpdateGroupDialog && (
                <UpdateGroupDialog
                    name={selectedGroup}
                    showDialog={showUpdateGroupDialog}
                    onClose={() => setUpdateGroupDialog(false)}
                    onUpdate={(response) => handleUpdateGroup(response)}
                />
            )}


            {showDeleteProjectDialog && (
                <ConfirmationDialog
                    title={`Delete Project`}
                    message={`Are you sure you want to delete ${selectedProject.name.toUpperCase()} ?`}
                    onConfirm={() => {
                        handleDeleteProject(selectedProject.id, selectedProject);
                        setShowDeleteProjectDialog(false);
                    }}
                    onCancel={() => setShowDeleteProjectDialog(false)}
                />
            )}

            {showDeleteGroupDialog && (
                <ConfirmationDialog
                    title={`Delete Group`}
                    message={`Are you sure you want to delete ${selectedGroup.toUpperCase()} ?`}
                    onConfirm={() => {
                        handleDeleteGroup(selectedGroup)
                        setShowDeleteGroupDialog(false);
                    }}
                    onCancel={() => setShowDeleteGroupDialog(false)}
                />
            )}

        </div>
    );
};
