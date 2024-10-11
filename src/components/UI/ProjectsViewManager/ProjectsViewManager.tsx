import {useState} from 'react';
import {useNavigate} from 'react-router-dom';


/**
 * Components
 * */
import {
    Dropdown,
    ImportModel,
    DefaultButton,
    IDropdownOptions
} from '@/components';

import {
    Tooltip,
    IconButton
} from "@mui/material";

import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewHeadlineIcon from '@mui/icons-material/ViewHeadline';

import styles from './styles.module.scss';

type ProjectsViewManagerProps = {
    onFilter: (filter: string) => void;
    filterOptions: IDropdownOptions[];
    setViewType: (viewType: string) => void;
};

export const ProjectsViewManager = ({filterOptions, onFilter, setViewType}: ProjectsViewManagerProps) => {
    const navigate = useNavigate();
    const [showImportModel, setShowImportModel] = useState(false);
    const [selectedOption, setSelectedOption] = useState('all');

    function uploadModelDone(projectId?: string | null) {
        setShowImportModel(false);

        if (projectId) {
            navigate(`/projects/${projectId}`);
        }
    }

    return (
        <div className={styles.manager_container}>
            <div data-tour='filter_projects_by_group'>
                <Dropdown
                    title="groups"
                    options={filterOptions}
                    callback={onFilter}
                    selectedOption={selectedOption}
                    setSelectedOption={setSelectedOption}
                />
            </div>
            {/*Display flex div*/}
            <div>
                <DefaultButton
                    id='import_geometry_button'
                    sx={{marginRight: '20px', boxShadow: 'none'}}
                    label="Import geometry (Model)"
                    icon={<FileUploadOutlinedIcon/>}
                    onClick={() => setShowImportModel(true)}/>
                {showImportModel && (
                    <ImportModel setShowPopup={setShowImportModel} uploadModelDone={uploadModelDone}/>
                )}
            </div>

            <div className={styles.switch}>
                <Tooltip title={'List view'}>
                    <IconButton
                        color="secondary"
                        onClick={() => setViewType('list')}>
                        <ViewHeadlineIcon/>
                    </IconButton>
                </Tooltip>
                <Tooltip title={'Grid view'}>
                    <IconButton
                        color="secondary"
                        onClick={() => setViewType('grid')}>
                        <GridViewIcon/>
                    </IconButton>
                </Tooltip>
            </div>
        </div>
    )
        ;
};
