import {
    IconButton,
    DialogTitle,
    DialogProps,
    Dialog as BaseDialog,
    } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

interface ModalProps extends DialogProps {
    width?: number | string;
    height?: number | string;
    minHeight?: number | string;
    maxHeight?: number | string;
    title?: string;
    onClose?: () => void;
    titleDisabled?: boolean,
}

export const Dialog = (props: ModalProps) => {
    const {
        title,
        onClose,
        titleDisabled,
        children,
        ...dialogProps
    } = props;

    return (
        <BaseDialog {...dialogProps}
>
            {title && (
                <DialogTitle>
                    {title}
                    {onClose && (
                        <IconButton
                            disabled={titleDisabled}
                            aria-label="close"
                            onClick={(e) => {
                                e.stopPropagation();
                                onClose();
                            }}
                            style={{position: 'absolute', right: 8, top: 8}}
                        >
                            <CloseRoundedIcon/>
                        </IconButton>
                    )}
                </DialogTitle>
            )}
            {children}
        </BaseDialog>
    );
};