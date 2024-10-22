import {FC} from 'react';
import {Box} from '@mui/material';
import {styled} from '@mui/system';
import colors from '@/theme/colors.module.scss';
import {DefaultBase, ButtonProps} from "./DefaultButton.tsx";

const DeleteBase = styled(DefaultBase)`
    color: ${colors.raRed};
    border: 1px solid ${colors.raRed};
    padding: 18px 10px;
    letter-spacing: 0.05em;

    &:hover {
        background-color: ${colors.raRed};
    }
`;

export const DeleteButton: FC<ButtonProps> = (
    {
        sx,
        icon,
        label,
        onClick,
        disabled = false,
        ...props
    }) => (
    // @ts-expect-error : I know!
    <DeleteBase disabled={disabled} onClick={onClick} sx={sx} {...props} >
        {icon && (
            <Box component="div" sx={{display: 'flex', marginRight: '10px'}}>
                {icon}
            </Box>
        )}
        <span>{label}</span>
    </DeleteBase>
);
