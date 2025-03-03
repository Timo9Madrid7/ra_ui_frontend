import React, {
    ChangeEvent,
    ChangeEventHandler,
    forwardRef,
    ReactNode,
} from 'react';
import styles from './styles.module.scss';

import { ArrowDropDownOutlined, ArrowDropUpOutlined } from '@mui/icons-material';

type NumberInputProps = {
    name?: string | ReactNode;
    disabled?: boolean;
    min?: number | null;
    max?: number | null;
    step?: number;
    startAdornment?: string | React.ReactElement;
    endAdornment?: string;
    value?: number;
    decimals?: number;
    toFixed?: boolean;
    onChange?: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onBlur?: (value?: number) => void;
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>, value?: number) => void;
    onDoubleClick?: React.MouseEventHandler<HTMLInputElement>;
    allowEmpty?: boolean;
    blurOnStep?: boolean;
};

export const CustomNumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
    (
        {
            name,
            disabled,
            min,
            max,
            step = 1,
            startAdornment,
            endAdornment,
            value,
            decimals = 0,
            toFixed = true,
            onChange,
            onBlur,
            onDoubleClick,
            allowEmpty = false,
            blurOnStep = true,
        },
        ref
    ) => {
        const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
            const value = event.target.value !== '' ? Number(event.target.value) : undefined;
            onChange?.(event);
        };

        const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
            const value = event.target.value !== '' ? Number(event.target.value) : undefined;
            onBlur?.(value);
        };

        const handleChangeStep = (newValue: number) => (e: React.MouseEvent) => {
            e.preventDefault();
            const newValue = (value ?? 0) + newValue;
            onChange?.({ target: { value: newValue.toString() } } as ChangeEvent<HTMLInputElement>);
            if (blurOnStep) onBlur?.(newValue);
        };

        return (
            <div
                className={styles.form_control_number}
                onDoubleClick={onDoubleClick}
            >
                {name && (<label>{name}</label>)}

                <div className={`${styles.number_input_container} ${disabled ? styles.disabled : ''}`}>
                    {startAdornment && (<div className={styles.text_info}>{startAdornment}</div>)}
                    <input
                        type="number"
                        className={styles.number_input}
                        value={value !== undefined && !Number.isNaN(value) ? value : ''}
                        min={min || undefined}
                        max={max || undefined}
                        step={step}
                        disabled={disabled}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        ref={ref}
                    />

                    {endAdornment && (<div className={styles.text_info}>{endAdornment}</div>)}

                    <div className={styles.steps}>
                        <div className={styles.svg} onMouseDown={handleChangeStep(step)}>
                            <ArrowDropUpOutlined />
                        </div>
                        <div className={styles.svg} onMouseDown={handleChangeStep(-step)}>
                            <ArrowDropDownOutlined />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
);