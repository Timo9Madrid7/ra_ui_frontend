import React, {useEffect, useState} from 'react';

/**
 *
 * Components
 * */
import {
    TextField,
    FormControl,
    DialogContent,
    DialogActions
} from '@mui/material';
import toast from 'react-hot-toast';

import {
    Dialog,
    TextArea,
    DefaultButton, SuccessButton,
} from '@/components';

/**
 * Hooks
 * */
import {
    useUpdateProject
} from '../hooks';

/**
 *
 * Types & interfaces
 * */
import {Project} from '@/types';
import {CancelOutlined, ClearRounded, Done} from "@mui/icons-material";

interface UpdateProjectProps {
    showDialog: boolean;
    onClose?: () => void;
    selectedProject: Project;
    onUpdate?: (response: Project) => void;
}

export const UpdateProjectDialog = (
    {
        onClose,
        onUpdate,
        selectedProject,
        showDialog = false
    }: UpdateProjectProps) => {
    const [newName, setNewName] = useState<string>(selectedProject.name);
    const [newDescription, setNewDescription] = useState<string>(selectedProject.description);

    const [isFormValid, setIsFormValid] = useState(true);

    const {mutate: updateProject} = useUpdateProject();

    // Form dialog pre-set with old values
    useEffect(() => {
        if (showDialog) {
            setNewName(selectedProject.name);
            setNewDescription(selectedProject.description);
        }
    }, [showDialog]);

    // Form validation
    useEffect(() => {
        (newName && newName.length > 0 && (newName !== selectedProject.name || newDescription !== selectedProject.description))
            ? setIsFormValid(true)
            : setIsFormValid(false);

    }, [newName, selectedProject.name, newDescription, selectedProject.description]);

    // Handler for update the project
    const handleUpdateProject = (e: React.MouseEvent) => {
        e.preventDefault();
        updateProject(
            Object.assign(selectedProject, {name: newName, description: newDescription}),
            {
                onSuccess: (response: Project) => {
                    if (onUpdate) onUpdate(response);
                    toast.success(`'${response.name}' updated!`)
                },
                onError: () => toast.error('Error updating Project!')
            }
        );
    };

    return (
        <>
            {newName != undefined && (
                <Dialog
                    open={true}
                    onClose={onClose}
                    hideBackdrop={false}
                    title={'Edit Project'}
                    aria-labelledby={'Edit Project'}>
                    <form>
                        <DialogContent>
                            <FormControl>
                                <TextField
                                    autoFocus
                                    label="Name"
                                    value={newName}
                                    autoComplete="off"
                                    variant="outlined"
                                    color={'secondary'}
                                    placeholder={'enter the name'}
                                    onChange={(e) => setNewName(e.target.value)}
                                />
                            </FormControl>
                            <FormControl>
                                <TextArea
                                    placeholder="Description"
                                    value={newDescription}
                                    onChange={setNewDescription}/>
                            </FormControl>
                        </DialogContent>
                        <DialogActions>
                            <div>
                                <DefaultButton
                                    icon={<ClearRounded />}
                                    label="Cancel"
                                    onClick={onClose}
                                />
                            </div>
                            <div>
                                <SuccessButton
                                    type="submit"
                                    icon={<Done />}
                                    label="Update Project"
                                    disabled={!isFormValid}
                                    onClick={(e) => handleUpdateProject(e)}
                                />
                            </div>
                        </DialogActions>
                    </form>
                </Dialog>
            )}
        </>
    );
};
