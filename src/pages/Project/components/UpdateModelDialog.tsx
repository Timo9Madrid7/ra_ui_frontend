import React, {useEffect, useState} from 'react';
import toast from 'react-hot-toast';

/**
 *
 * Components
 */
import {
    TextField,
    DialogContent,
    DialogActions,
} from '@mui/material';
import {
    Dialog,
    DefaultButton, SuccessButton
} from "@/components";

/**
 * Hooks
 * */
import {useUpdateModel} from '../hooks';

/**
 * Types
 * */
import {Model} from '@/types';
import {ClearRounded, Done} from "@mui/icons-material";

type UpdateModelProps = {
    showUpdate: boolean;
    selectedModel: Model;
    onClose?: () => void;
    onUpdate?: (response: Model) => void;
}

export const UpdateModelDialog = (
    {
        onClose,
        onUpdate,
        selectedModel,
        showUpdate = false
    }: UpdateModelProps) => {

    const [newName, setNewName] = useState<string>(selectedModel.name);
    const [isFormValid, setIsFormValid] = useState(true);

    const {mutate: updateModel} = useUpdateModel();

    // Form dialog pre-set with old values
    useEffect(() => {
        if (showUpdate) {
            setNewName(selectedModel.name);
        }
    }, [showUpdate]);

    // Form validation
    useEffect(() => {
        (newName && newName.length > 0 && newName !== selectedModel.name)
            ? setIsFormValid(true)
            : setIsFormValid(false);

    }, [newName, selectedModel.name]);

    // Handler for update the project
    const handleSubmitUpdate = (e: React.MouseEvent) => {
        e.preventDefault();
        updateModel(Object.assign(selectedModel, {name: newName}),
            {
                onSuccess: (response: Model) => {
                    if (onUpdate) onUpdate(response);
                    toast.success(`' ${response.name} ' updated!`);
                },
                onError: () => {
                    toast.error('Error updating Model!');
                },
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
                    title={'Edit the Model'}
                    aria-labelledby={'Edit Model'}>
                    <form>
                        <DialogContent>
                            <TextField
                                label="Name"
                                value={newName}
                                autoFocus={true}
                                autoComplete="off"
                                variant="outlined"
                                color={'secondary'}
                                placeholder={'Enter the new name'}
                                onChange={(e) => {
                                    setNewName(e.target.value)
                                }}
                            />
                        </DialogContent>
                        <DialogActions>
                            <div>
                                <DefaultButton
                                    label="Cancel"
                                    icon={<ClearRounded/>}
                                    onClick={onClose}
                                />
                            </div>
                            <div>
                                <SuccessButton
                                    icon={<Done />}
                                    type="submit"
                                    label="Update"
                                    disabled={!isFormValid}
                                    onClick={handleSubmitUpdate}
                                />
                            </div>
                        </DialogActions>
                    </form>
                </Dialog>
            )}
        </>
    );
};
