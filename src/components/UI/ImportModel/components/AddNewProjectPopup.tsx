import React, {useEffect, useState} from 'react';

/** Components */
import {Stack} from '@mui/material';
import {DefaultButton, SuccessButton} from '../../../Base/Buttons';
import {Dialog} from "@/components";
import {
    DialogContent,
    DialogActions,
    TextField
} from "@mui/material";
import toast from 'react-hot-toast';
import {TextArea} from '@/components';
import {CancelOutlined, ClearRounded, Done} from "@mui/icons-material";

interface AddNewProjectProps {
    addNewProject: (name: string, description: string) => void;
    onClose: () => void;
    projects: { id: string; name: string }[];
}

export const AddNewProjectPopup = ({addNewProject, onClose, projects}: AddNewProjectProps) => {
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [isFormValid, setIsFormValid] = useState(true);

    // Form validation
    useEffect(() => {
        if (name?.length) {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
    }, [name]);

    const doesProjectNameExist = (name: string) => {
        return projects?.length > 0 && projects.some((p) => p.name.toLowerCase() === name.toLowerCase());
    };

    const handleSubmit = (event: React.MouseEvent) => {
        event.preventDefault();

        if (doesProjectNameExist(name)) {
            toast.error('Project with this name already exists. Please choose another one.');
            return;
        }

        addNewProject(name, description);
        onClose();
    };

    return (
        <Dialog
            title={'Add new project'}
            hideBackdrop={false}
            aria-labelledby={'New project'}
            sx={{fontSize: '12px'}}
            open={true}>
            <form>
                <DialogContent>
                    <Stack gap={1} margin={'4px 0 16px'}>
                        <TextField
                            autoFocus
                            color={'secondary'}
                            label="Project Name"
                            placeholder={'enter name of the project'}
                            variant="outlined"
                            autoComplete="off"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value)
                            }}
                        />
                        <TextArea placeholder="Description" value={description} onChange={setDescription}/>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <div>
                        <DefaultButton
                            icon={<ClearRounded/>}
                            label="Cancel"
                            onClick={onClose}
                        />
                    </div>

                    <div>
                        <SuccessButton
                        type="submit"
                        icon={<Done />}
                        disabled={!isFormValid}
                        label="Add project"
                        onClick={handleSubmit}/>
                    </div>

                </DialogActions>
            </form>
        </Dialog>
    );
};
