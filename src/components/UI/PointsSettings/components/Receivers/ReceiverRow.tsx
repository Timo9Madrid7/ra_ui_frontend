import React, {useState, useEffect, ForwardedRef} from 'react';

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
 * Types
 */
import {Receiver} from '@/context/EditorContext/types';
type ReceiverRowProps = {
    receiver: Receiver;
    index: number;
    isSelected: boolean;
    isDisabled: boolean;
    onSelect: () => void;
    onDelete: () => void;
    onChangeLabel: (label: string) => void;
    onChangeAxis: (axis: 'x' | 'y' | 'z', value?: number) => void;
};


export const ReceiverRow = React.forwardRef(
    (
        {
            receiver,
            index,
            isSelected,
            isDisabled,
            onSelect,
            onDelete,
            onChangeAxis,
        }: ReceiverRowProps,
        ref: ForwardedRef<HTMLDivElement>
    ) => {
        const [posX, setPosX] = useState<number | undefined>(receiver.x);
        const [posY, setPosY] = useState<number | undefined>(receiver.y);
        const [posZ, setPosZ] = useState<number | undefined>(receiver.z);

        useEffect(() => {
            if (receiver.x !== posX) setPosX(receiver.x);
        }, [receiver.x]);
        useEffect(() => {
            if (receiver.y !== posY) setPosY(receiver.y);
        }, [receiver.y]);
        useEffect(() => {
            if (receiver.z !== posZ) setPosZ(receiver.z);
        }, [receiver.z]);

        const handlePosXBlur = (value: number | undefined) => {
            if (receiver.x !== value) {
                onChangeAxis('x', value);
            }
        };
        const handlePosYBlur = (value: number | undefined) => {
            if (receiver.y !== value) {
                onChangeAxis('y', value);
            }
        };
        const handlePosZBlur = (value: number | undefined) => {
            if (receiver.z !== value) {
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
                <div className={styles.row_title}>Receiver_{index + 1}</div>
                <div className={styles.row_content}>

                    <PointMarker isSelected={isSelected} color="orange" label={(index + 1).toString()}/>

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
                    <Tooltip title="Delete Receiver">
                        <IconButton onClick={handleDelete}><DeleteSweepOutlinedIcon/></IconButton>
                    </Tooltip>
                </div>
            </div>
        );
    }
);
