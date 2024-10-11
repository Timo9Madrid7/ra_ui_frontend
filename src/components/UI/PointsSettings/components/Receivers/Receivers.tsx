import {useState} from 'react';

/**
 * Components
 * */
import {
    IconButton,
    ClickAwayListener
} from '@mui/material';
import {
    ActionsMenu,
    useMaterialPanelContext
} from "@/components";
import {ReceiverRow} from './ReceiverRow.tsx'

/**
 * Hooks
 */
import {useReceivers} from '../../hooks/useReceivers.ts';
import {usePoints} from '../../hooks/usePoints';

/**
 * Types and constants
 * */
import {Point} from '@/context/EditorContext/types';
import {MAX_NUMBER_OF_RECEIVERS} from "@/constants";

/**
 * Assets
 */
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";
import ArrowRightRoundedIcon from "@mui/icons-material/ArrowRightRounded";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import styles from '../../styles.module.scss';

export const Receivers = (
    {
        receivers,
        isDisabled,
    }: {
        receivers: Point[];
        isDisabled: boolean;
    }) => {
    const {
        selectedPointId,
        handleAddReceiver,
        handleRemoveAllReceivers,
        handleReceiverCoordinateChange,
        handleReceiverLabelChange,
        handleRemoveReceiver,
    } = useReceivers();

    const {handleSelectionChange} = usePoints();
    const [isOpen, setIsOpen] = useState(true);


    const {selectedSource} = useMaterialPanelContext();

    return (
        <div className={styles.container}>

            <div className={styles.header}>
                <div className={styles.title}>
                    <IconButton
                        className={styles.toggle}
                        onClick={() => setIsOpen((isOpen) => !isOpen)}>
                        {isOpen ? <ArrowDropDownRoundedIcon/> : <ArrowRightRoundedIcon/>}
                    </IconButton>
                    <h4>Receivers section</h4>
                </div>
                <div className={styles.actions}>
                    <IconButton
                        title="Add a new receiver"
                        disabled={receivers.length >= MAX_NUMBER_OF_RECEIVERS || isDisabled}
                        onClick={handleAddReceiver}>
                        <AddCircleOutlineOutlinedIcon/>
                    </IconButton>
                    <ActionsMenu
                        disabled={isDisabled}
                        id={'receivers-action-menu'}
                        actions={[
                            {key: 'delete', value: 'Delete all', onClick: () => handleRemoveAllReceivers()},
                        ]}
                    />
                </div>
            </div>
            {isOpen && (
                <>
                    {receivers.length > 0 ? (
                        <div className={styles.content}>
                            {receivers.map((receiver, index) => (
                                <ClickAwayListener
                                    key={index}
                                    mouseEvent={selectedPointId === receiver.id ? undefined : false}
                                    onClickAway={(e) => {
                                        if (!selectedSource && !(e.target instanceof Element && e.target.tagName === 'CANVAS')) {
                                            handleSelectionChange(undefined);
                                        }
                                    }}>
                                    <ReceiverRow
                                        receiver={receiver}
                                        index={index}
                                        isSelected={selectedPointId === receiver.id}
                                        isDisabled={isDisabled}
                                        onSelect={() => handleSelectionChange(receiver.id, 'ReceiverPoint')}
                                        onDelete={() => handleRemoveReceiver(receiver.id)}
                                        onChangeAxis={(axis, value) =>
                                            handleReceiverCoordinateChange(
                                                index,
                                                axis === 'x' ? value : receiver.x,
                                                axis === 'y' ? value : receiver.y,
                                                axis === 'z' ? value : receiver.z
                                            )
                                        }
                                        onChangeLabel={(value) => handleReceiverLabelChange(index, value)}
                                    />
                                </ClickAwayListener>
                            ))}
                        </div>
                    ) : <p className={styles.no_content}> Currently there is no receiver added.</p>}
                </>
            )}
        </div>
    );
};
