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
import {CancelOutlined, ClearRounded, Done} from "@mui/icons-material";

interface AddNewGroupProps {
    addNewGroup: (name: string) => void;
    onClose: () => void;
    groups: { id: string; name: string }[];
}

export const AddNewGroupPopup = ({addNewGroup, onClose, groups}: AddNewGroupProps) => {
    const [name, setName] = useState<string>('');
    const [isFormValid, setIsFormValid] = useState(true);

    // Form validation
    useEffect(() => {
        if (name?.length) {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
    }, [name]);

    const doesGroupNameExist = (name: string) => {
        return groups?.length > 0 && groups.some((p) => p.name.toLowerCase() === name.toLowerCase());
    };

    const handleSubmit = (event: React.MouseEvent) => {
        event.preventDefault();

        if (doesGroupNameExist(name)) {
            toast.error('Group with this name already exists. Please choose another one.');
            return;
        }

        addNewGroup(name);
        onClose();
    };

    return (
        <Dialog
            title={'Add new Group'}
            hideBackdrop={false}
            aria-labelledby={'New group'}
            open={true}
        >
            <form>
                <DialogContent>
                    <Stack gap={1} margin={'4px 0 16px'}>
                        <TextField
                            autoFocus
                            color={'secondary'}
                            label="Group Name"
                            placeholder={'enter name of the group'}
                            variant="outlined"
                            autoComplete="off"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value)
                            }}
                        />
                    </Stack>
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
                            disabled={!isFormValid}
                            icon={<Done/>}
                            label="Add group"
                            onClick={handleSubmit}
                        />
                    </div>
                </DialogActions>
            </form>
        </Dialog>
    );
};
