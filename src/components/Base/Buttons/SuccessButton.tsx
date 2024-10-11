import {Box} from '@mui/material';
import {styled} from '@mui/system';
import {ForwardedRef, forwardRef} from 'react';
import colors from '@/theme/colors.module.scss';
import {ButtonProps, DefaultBase} from './DefaultButton.tsx'

const SuccessBase = styled(DefaultBase)`
    color: ${colors.raGreen}; // 
    border: 1px solid ${colors.raGreen};
    box-shadow: none;
    padding: 18px 10px;
    letter-spacing: 0.05em;
    path {
        transition: 0.15s fill;
        fill: ${colors.raGreen};
    }

    &:hover:not(.Mui-disabled) {
        background-color: ${colors.raGreen};
    }
`;

export const SuccessButton = forwardRef(
    (
        props: ButtonProps,
        ref: ForwardedRef<HTMLButtonElement>
    ) => (
        // @ts-expect-error : I know!
        <SuccessBase ref={ref} sx={props.sx} {...props}>
            {props.icon && (
                <Box component="div" sx={{display: 'flex', marginRight: '10px'}}>
                    {props.icon}
                </Box>
            )}
            <span>{props.label}</span>
        </SuccessBase>
    ));
