import React, {useEffect, useState} from 'react';

/**
 *
 * Components
 * */
import {
    TextField,
    FormControl,
    DialogContent,
    DialogActions,
} from '@mui/material';
import toast from 'react-hot-toast';
import {
    Dialog,
    DefaultButton, SuccessButton,
} from '@/components';


/**
 * Hooks
 * */
import {
    useUpdateGroup
} from '../hooks';
import {ClearRounded, Done} from "@mui/icons-material";

/**
 *
 * Types & interfaces
 * */
interface UpdateGroupProps {
    showDialog: boolean;
    onClose?: () => void;
    onUpdate?: (response: string) => void;
    name: string;
}

export const UpdateGroupDialog = (
    {
        name,
        onClose,
        onUpdate,
        showDialog = false
    }: UpdateGroupProps) => {
    const [nameNew, setNameNew] = useState<string>(name);
    const [isFormValid, setIsFormValid] = useState(true);

    const {mutate: updateGroup} = useUpdateGroup();

    // Form dialog pre-set with old name
    useEffect(() => {
        if (showDialog) {
            setNameNew(name);
        }
    }, [showDialog]);

    // Form validation
    useEffect(() => {
        (nameNew && nameNew.length > 0 && nameNew !== name)
            ? setIsFormValid(true)
            : setIsFormValid(false);

    }, [nameNew, name]);

    // Handler for update the group
    const handleUpdateGroup = (e: React.MouseEvent) => {
        e.preventDefault();
        updateGroup(
            {oldGroup: name, newGroup: nameNew},
            {
                onSuccess: () => {
                    if (onUpdate) onUpdate(nameNew);
                    toast.success(`'${nameNew}' updated!`)
                },
                onError: () => toast.error('Error updating Group!')

            }
        );
    };

    return (
        <>
            {nameNew != undefined && (
                <Dialog
                    open={true}
                    onClose={onClose}
                    hideBackdrop={false}
                    title={'Edit Group'}
                    aria-labelledby={'Edit Group'}>
                    <form>
                        <DialogContent>
                            <FormControl>
                                <TextField
                                    autoFocus
                                    label="Name"
                                    value={nameNew}
                                    variant="outlined"
                                    autoComplete="off"
                                    color={'secondary'}
                                    placeholder={'Enter new name for group'}
                                    onChange={(e) => {
                                        setNameNew(e.target.value)
                                    }}
                                />
                            </FormControl>
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
                                    label="Update Group"
                                    disabled={!isFormValid}
                                    onClick={handleUpdateGroup}
                                />
                            </div>
                        </DialogActions>
                    </form>
                </Dialog>
            )}
        </>
    );
};
