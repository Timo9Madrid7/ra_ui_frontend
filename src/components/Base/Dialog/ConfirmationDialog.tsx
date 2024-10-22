import {FC} from 'react';

import {
    DefaultButton,
    DeleteButton,
} from '@/components';

import {Dialog} from '@/components'
import {
    Box,
    DialogActions,
    DialogContent,
} from '@mui/material';

import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';

type props = {
    title: string;
    message?: string | (() => JSX.Element);
    confirmLabel?: string;

    onCancel: () => void;
    onConfirm: () => void;
};

export const ConfirmationDialog: FC<props> = (
    {
        title,
        message,
        confirmLabel,

        onCancel,
        onConfirm,
    }) => {
    return (
        <Dialog
            open={true}
            aria-labelledby={title}
            title={title}
            onClose={onCancel}
        >
            <DialogContent>
                <Box
                    component='div'
                    fontSize='12px'
                    padding='10px'
                    letterSpacing='0.05em'
                >{typeof message === 'function' ? message() : message}</Box>
            </DialogContent>
            <DialogActions>
                <div>
                    <DefaultButton
                        label="Cancel"
                        onClick={onCancel}
                        icon={<ClearRoundedIcon/>}
                    />
                </div>
                <DeleteButton
                    label={`${confirmLabel ? confirmLabel : 'Confirm'}`}
                    onClick={onConfirm}
                    sx={{width: 135}}
                    icon={<CheckRoundedIcon/>}
                />
            </DialogActions>
        </Dialog>
    );
};
