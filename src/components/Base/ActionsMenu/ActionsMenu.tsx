import {
    useState,
    RefObject,
    MouseEvent,
    SyntheticEvent,
} from 'react';

/**
 *
 * Components
 * */
import {
    Menu,
    Tooltip,
    MenuItem,
    IconButton,
    ClickAwayListener,
} from '@mui/material';

/**
 *
 * Assets
 * */
import classes from './classes.module.scss';
import MoreVertIcon from '@mui/icons-material/MoreVert';

/**
 * Types
 * */
import {Action} from '@/types';
type ActionMenuProps = {
    id: number | string;
    title?: string;
    actions: Action[];
    disabled?: boolean;
    classNames?: string;
    triggerRef?: RefObject<HTMLButtonElement> | null;
}

export const ActionsMenu = (
    {
        id,
        actions,
        disabled,
        triggerRef,
        classNames = '',
        title = 'Actions',
    }: ActionMenuProps) => {

    const [
        anchorEl,
        setAnchorEl
    ] = useState<HTMLButtonElement | null>(null);

    // handle click
    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setAnchorEl(e.currentTarget);
    };

    // handle action
    const handleAction = (e: SyntheticEvent, callback: () => void) => {
        e.preventDefault();
        e.stopPropagation();
        callback();
        setAnchorEl(null);
    };

    return (
        <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
            <div className={classNames}>
                <Tooltip title={title}>
                    <IconButton
                        edge={'end'}
                        size={'small'}
                        ref={triggerRef}
                        color={'secondary'}
                        disabled={disabled}
                        aria-haspopup='true'
                        onClick={handleClick}
                        aria-controls='actions'
                        id={`actions-trigger-${id}`}
                    >
                        <MoreVertIcon fontSize={'small'}/>
                    </IconButton>
                </Tooltip>

                {!!anchorEl && (
                    <Menu
                        open={true}
                        onClose={() => setAnchorEl(null)}
                        anchorEl={anchorEl}
                        id={`actions-menu-${id}`}
                        anchorOrigin={{horizontal: 'center', vertical: 'bottom'}}
                        transformOrigin={{horizontal: 'right', vertical: 'top'}}

                    >
                        {
                            actions.map(
                                (action: Action) => (
                                    <Tooltip
                                        title={action.title}
                                        placement={'right'}
                                        key={action.key}
                                    >
                                        <MenuItem
                                            className={classes.menu_item}
                                            value={action.value}
                                            onClick={
                                                (e) => handleAction(e, () => action.onClick())
                                            }
                                        >
                                            {action.icon !== undefined && action.icon}
                                            {action.value}
                                        </MenuItem>
                                    </Tooltip>
                                ))
                        }
                    </Menu>
                )}
            </div>
        </ClickAwayListener>
    );
};
