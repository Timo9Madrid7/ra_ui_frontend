import {useState} from 'react';

/**
 * Components
 * */
import {
    IconButton,
    ClickAwayListener
} from '@mui/material';

import {ActionsMenu} from '@/components';
import {SourceRow} from './SourceRow';

/**
 * Hooks
 * */
import {useSources} from '../../hooks/useSources';
import {usePoints} from '../../hooks/usePoints';

/**
 * Assets
 */
import styles from '../../styles.module.scss';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";
import ArrowRightRoundedIcon from "@mui/icons-material/ArrowRightRounded";

/**
 * Types and constants
 * */
import {Source} from '@/context/EditorContext/types';
import {MAX_NUMBER_OF_SOURCES} from "@/constants";

type SourcesType = {
    sources: Source[];
    isDisabled: boolean;
}
export const Sources = (
    {
        sources,
        isDisabled,
    }: SourcesType) => {
    const {
        selectedPointId,
        handleSourceCoordinateChange,
        handleSourceLabelChange,
        handleAddSource,
        handleRemoveSource,
        handleRemoveAllSources,
    } = useSources();

    const {handleSelectionChange} = usePoints();
    const [isOpen, setIsOpen] = useState(true);

    return (
        <>
            <div className={styles.container}>

                <div className={styles.header}>
                    <div className={styles.title}>
                        <IconButton
                            className={styles.toggle}
                            onClick={() => setIsOpen((isOpen) => !isOpen)}>
                            {isOpen ? <ArrowDropDownRoundedIcon/> : <ArrowRightRoundedIcon/>}
                        </IconButton>
                        <h4>Sources section</h4>
                    </div>
                    <div className={styles.actions}>
                        <IconButton
                            title="Add a new source"
                            disabled={sources.length >= MAX_NUMBER_OF_SOURCES || isDisabled}
                            onClick={handleAddSource}>
                            <AddCircleOutlineOutlinedIcon/>
                        </IconButton>
                        <ActionsMenu
                            disabled={isDisabled}
                            id={'sources-action-menu'}
                            actions={[{key: 'delete', value: 'Delete all', onClick: handleRemoveAllSources}]}
                        />
                    </div>
                </div>

                {isOpen && (
                    <>
                        {sources.length > 0 ? (
                            <div className={styles.content}>
                                {sources.map((source, index) => (
                                    <ClickAwayListener
                                        key={source.id}
                                        mouseEvent={selectedPointId === source.id ? 'onClick' : false}
                                        onClickAway={(e) => {
                                            if (!(e.target instanceof Element && e.target.tagName === 'CANVAS')) {
                                                handleSelectionChange(undefined);
                                            }
                                        }}>
                                        <SourceRow
                                            source={source}
                                            index={index}
                                            isSelected={selectedPointId === source.id}
                                            isDisabled={isDisabled}
                                            onSelect={() => handleSelectionChange(source.id, 'SourcePoint')}
                                            onDelete={() => handleRemoveSource(source.id)}
                                            onChangeAxis={(axis, value) =>
                                                handleSourceCoordinateChange(
                                                    index,
                                                    axis === 'x' ? value : source.x,
                                                    axis === 'y' ? value : source.y,
                                                    axis === 'z' ? value : source.z
                                                )
                                            }
                                            onChangeLabel={(value) => handleSourceLabelChange(index, value)}
                                        />
                                    </ClickAwayListener>
                                ))}
                            </div>
                        ) : <p className={styles.no_content}> Currently there is no source added.</p>
                        }
                    </>
                )}
            </div>
        </>
    );
};
