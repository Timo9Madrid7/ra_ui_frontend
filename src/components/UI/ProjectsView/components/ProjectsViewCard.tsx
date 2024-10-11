import {useNavigate} from "react-router-dom";
import {SyntheticEvent} from "react";
/**
 *
 * Components
 * */
import {Box} from "@mui/material";
import {ActionsMenu} from '@/components';

/**
 * Types & interfaces
 * */
import {Action, Project} from '@/types';
type ProjectViewCardProps = {
    group: string;
    viewType?: string;
    projects: Project[];
    groupActions: (group: string) => Action[];
    projectActions: (project: Project) => Action[];
}

/**
 * Icons
 * */
import GraphicEqOutlinedIcon from '@mui/icons-material/GraphicEqOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';

/**
 * Assets
 **/
import image from '@/assets/images/project.png';
import classes from '../styles.module.scss';


export const ProjectsViewCard = (
    {
        group,
        projects,
        groupActions,
        projectActions,
        viewType = 'grid',
    }: ProjectViewCardProps) => {

    const navigate = useNavigate();

    const handleOpenProject = (e: SyntheticEvent, id: string) => {
        const target = e.target as HTMLElement;
        if (target.closest('.action_buttons') === null) {
            navigate(`/projects/${id}`);
        }
    };

    const stopPropagation = (e: SyntheticEvent) => {
        e.stopPropagation();
    };


    return (
        <div className={classes.group_container}>
            <div className={classes.group_header}>
                <div className={classes.group_title}>
                    <FolderOutlinedIcon/>
                    {group}
                </div>
                <div onClick={stopPropagation}>
                    <ActionsMenu
                        id={group}
                        title="Group actions"
                        actions={groupActions(group)}
                    />
                </div>
            </div>

            <div className={`${classes.group_body} ${viewType === 'list' ? classes.list_view : classes.grid_view}`}>
                {projects?.filter(
                    (project) => project.group == group)
                    .map((project) => (
                        <Box
                            component="div"
                            className={`${classes.project_container} ${viewType === 'list' ? classes.list_item : classes.grid_item}`}
                            key={project.id}
                            onClick={(event) => handleOpenProject(event, project.id)}>

                            <div className={classes.row}>
                                <p className={classes.project_title}>{project.name}</p>
                                <div onClick={stopPropagation}>
                                    <ActionsMenu
                                        id={project.id}
                                        title="Project actions"
                                        classNames={"action_buttons"}
                                        actions={projectActions(project)}
                                    />
                                </div>
                            </div>
                            <div className={classes.row}>
                                <img src={image}/>
                            </div>
                            <div className={`${classes.row}`}>
                                <div className={classes.model_title}>

                                    <GraphicEqOutlinedIcon/>
                                    {project.models && (
                                        <p>
                                            Contains: &nbsp;
                                            <b>
                                                {project.models.length}
                                                {
                                                    project.models.length === 1
                                                        ? ' model'
                                                        : ' models'
                                                }
                                            </b>
                                        </p>
                                    )}
                                </div>
                            </div>
                        </Box>
                    ))}
            </div>
        </div>
    );
};
