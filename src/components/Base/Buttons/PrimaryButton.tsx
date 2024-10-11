import {FC} from 'react';
import {Box} from '@mui/material';
import {styled} from '@mui/system';
import colors from '@/theme/colors.module.scss';
import {DefaultBase, ButtonProps} from "./DefaultButton.tsx";

const PrimaryBase = styled(DefaultBase)`
    color: ${colors.raPrimary};
    border: 1px solid ${colors.raPrimary};
    padding: 18px 10px;
    letter-spacing: 0.05em;

    &:hover {
        background-color: ${colors.raPrimary};
    }
`;

export const PrimaryButton: FC<ButtonProps> = (
    {
        sx,
        icon,
        label,
        onClick,
        disabled = false,
        ...props
    }) => (
    // @ts-expect-error : I know!
    <PrimaryBase disabled={disabled} onClick={onClick} sx={sx} {...props} >
        {icon && (
            <Box component="div" sx={{display: 'flex', marginRight: '10px'}}>
                {icon}
            </Box>
        )}
        <span>{label}</span>
    </PrimaryBase>
);
