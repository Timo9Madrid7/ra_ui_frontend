import React, {ForwardedRef, useEffect, useState} from 'react';

/**
 * Components
 */
import {
    NumberInput,
    PointMarker,
} from '@/components';
import {
    Tooltip,
    IconButton
} from "@mui/material";


/**
 * Assets
 */
import DeleteSweepOutlinedIcon from "@mui/icons-material/DeleteSweepOutlined";
import styles from '../../styles.module.scss';

/**
 *  Types
 *  */
import {Source} from '@/context/EditorContext/types';
type SourceRowProps = {
    source: Source;
    index: number;
    isSelected: boolean;
    isDisabled: boolean;
    onSelect: () => void;
    onDelete: () => void;
    onChangeLabel: (label: string) => void;
    onChangeAxis: (axis: 'x' | 'y' | 'z', value?: number) => void;
};

export const SourceRow = React.forwardRef(
    (
        {
            source,
            index,
            isSelected,
            isDisabled,
            onSelect,
            onDelete,
            onChangeAxis,
        }: SourceRowProps,
        ref: ForwardedRef<HTMLDivElement>
    ) => {
        const [posX, setPosX] = useState<number | undefined>(source.x);
        const [posY, setPosY] = useState<number | undefined>(source.y);
        const [posZ, setPosZ] = useState<number | undefined>(source.z);

        // sync when changes coming from viewport
        useEffect(() => {
            if (source.x !== posX) setPosX(source.x);
        }, [source.x]);
        useEffect(() => {
            if (source.y !== posY) setPosY(source.y);
        }, [source.y]);
        useEffect(() => {
            if (source.z !== posZ) setPosZ(source.z);
        }, [source.z]);

        const handlePosXBlur = (value: number | undefined) => {
            if (source.x !== value) {
                onChangeAxis('x', value);
            }
        };
        const handlePosYBlur = (value: number | undefined) => {
            if (source.y !== value) {
                onChangeAxis('y', value);
            }
        };
        const handlePosZBlur = (value: number | undefined) => {
            if (source.z !== value) {
                onChangeAxis('z', value);
            }
        };

        const handleContainerClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            console.log(e)
            onSelect();
        };

        const handleDelete = (e: React.MouseEvent) => {
            e.stopPropagation();
            onDelete();
        };

        return (
            <div
                ref={ref}
                onClick={handleContainerClick}
                className={`${styles.row} ${isSelected ? styles.selected : ''} ${
                    isDisabled ? styles.disabled : ''}`}
            >
                <div className={styles.row_title}>Source_{index + 1}</div>

                <div className={styles.row_content}>

                    <PointMarker isSelected={isSelected} color="purple" label={(index + 1).toString()}/>

                    <div className={styles.inputs}>
                        <NumberInput
                            value={posX}
                            step={0.5}
                            decimals={2}
                            onChange={setPosX}
                            onBlur={handlePosXBlur}
                            startAdornment={'X'}
                        />
                        <NumberInput
                            value={posY}
                            step={0.5}
                            decimals={2}
                            onChange={setPosY}
                            onBlur={handlePosYBlur}
                            startAdornment={'Y'}
                        />
                        <NumberInput
                            value={posZ}
                            step={0.1}
                            decimals={2}
                            onChange={setPosZ}
                            onBlur={handlePosZBlur}
                            startAdornment={'Z'}
                        />
                    </div>

                    <Tooltip title="Delete source">
                        <IconButton onClick={handleDelete}><DeleteSweepOutlinedIcon/></IconButton>
                    </Tooltip>
                </div>
            </div>
        );
    }
);
