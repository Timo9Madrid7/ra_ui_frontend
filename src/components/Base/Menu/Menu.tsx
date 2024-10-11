import React, {
    SyntheticEvent,
} from 'react';

/**
 * Components
 * **/
import {
    styled,
    MenuItem,
    Menu as BaseMenu,
    MenuProps as MuiMenuProps
} from '@mui/material';
import {
    DefaultButton
} from '@/components';


/**
 * Assets
 * */
import {ClickAwayListener} from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

/**
 * Types
 * */
import {Action} from "@/types";
type CustomMenuProps = {
    id: string;
    ButtonLabel?: string;
    ButtonIcon?: React.ReactElement,
    MenuItems: Action[];
    disabled?: boolean;
}

const StyledMenu = styled((props: MuiMenuProps) => (
    <BaseMenu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        {...props}
    />
))(({theme}) => ({
    '& .MuiPaper-root': {
        marginTop: '3px',
        minWidth: 180,
        borderRadius: 0,
        color: 'black',
        backgroundColor: '#cbedbe ',

        '& .MuiMenuItem-root': {
            backgroundColor: '#cbedbe',
            '&:hover': {
                backgroundColor: '#e3e2e2',
            },
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
            },
        },
    },
}));



export const Menu = (
    {
        id,
        ButtonLabel = 'Options',
        ButtonIcon = <KeyboardArrowDownIcon/>,
        MenuItems,
        disabled = false,
    }: CustomMenuProps) => {

    const [
        anchorEl,
        setAnchorEl
    ] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    // handle action
    const handleAction = (e: SyntheticEvent, callback: () => void) => {
        e.preventDefault();
        handleClose();
        callback();
    };


    return (
        <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
            <div>
                <DefaultButton
                    label={ButtonLabel}
                    aria-haspopup="true"
                    onClick={handleClick}
                    disabled={disabled}
                    id={`customized-button-${id}`}
                    icon={ButtonIcon}
                    aria-expanded={open ? 'true' : undefined}
                    aria-controls={open ? `customized-menu-${id}` : undefined}
                />
                <StyledMenu
                    id={`customized-menu-${id}`}
                    MenuListProps={{
                        'aria-labelledby': `customized-button-${id}`,
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                >
                    {
                        MenuItems.map((item: Action) => (
                            <MenuItem
                                onClick={
                                    (e) => handleAction(e, () => item.onClick())
                                }
                                key={item.key} disableRipple
                                value={item.value}
                            >
                                {item.icon}
                                {item.title}
                            </MenuItem>
                        ))
                    }
                </StyledMenu>
            </div>
        </ClickAwayListener>
    );
}
