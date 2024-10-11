import React, {FC} from 'react';
import {styled} from '@mui/system';
import colors from '@/theme/colors.module.scss'
import {Box, SxProps, Theme} from '@mui/material';
import {Button, buttonClasses} from '@mui/base/Button';

export const DefaultBase = styled(Button)`
    width: 100%;
    color: ${colors.raBlack};
    height: 30px;
    padding: 18px 10px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.05em;
    border-radius: 5px;
    border: 1px solid ${colors.raGray200};
    background-color: transparent;
    transition: 0.15s background, 0.15s color, 0.15s border-color;

    &:hover {
        color: ${colors.raGray1000};
        background-color: ${colors.raGray200};

        path {
            fill: ${colors.raGray1000};
        }
    }

    &.${buttonClasses.active} {
    }

    &.${buttonClasses.focusVisible} {
    }

    &.${buttonClasses.disabled} {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;


export type ButtonProps = {
    label: string;
    disabled?: boolean;
    sx?: SxProps<Theme>;
    icon?: React.ReactElement;
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>;


export const DefaultButton: FC<ButtonProps> = (
    {
        sx,
        icon,
        label,
        onClick,
        disabled = false,
        ...props
    }) => (
    // @ts-expect-error : I know!
    <DefaultBase disabled={disabled} onClick={onClick} sx={sx} {...props}>
        {icon && (
            <Box component="div" sx={{display: 'flex', marginRight: '10px'}}>
                {icon}
            </Box>
        )}
        <span>{label}</span>
    </DefaultBase>
);
