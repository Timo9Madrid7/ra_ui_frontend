import React, { ChangeEvent, ChangeEventHandler } from 'react';
import styles from './styles.module.scss';

import {
    ArrowDropDownOutlined,
    ArrowDropUpOutlined,
} from '@mui/icons-material';
import toast from 'react-hot-toast';

type NumberInputProps = {
    name: string;
    disabled?: boolean;
    min?: number | null;
    max?: number | null;
    step?: number;
    startAdornment?: string | React.ReactElement;
    endAdornment?: string;
    value?: number;
    onChange?: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onBlur?: (value?: number) => void;
    settingState: { [key: string]: any };
    setSettingsState: React.Dispatch<
        React.SetStateAction<{ [key: string]: any }>
    >;
};

export const CustomNumberInput = ({
    name,
    disabled,
    min,
    max,
    step = 1,
    startAdornment,
    endAdornment,
    settingState,
    setSettingsState,
}: NumberInputProps) => {
    const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        const newValue =
            event.target.value !== ''
                ? Number(event.target.value)
                : settingState[name];
        setSettingsState({
            ...settingState,
            [name]: newValue,
        });
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        const newValue =
            event.target.value !== ''
                ? Number(event.target.value)
                : settingState[name];
        const validatedValue = validateValue(newValue);
        setSettingsState({
            ...settingState,
            [name]: validatedValue,
        });
    };

    const handleChangeStep = (num: number) => (e: React.MouseEvent) => {
        const newValue: number = (settingState[name] ?? 0) + num;
        const validatedValue = validateValue(newValue);
        setSettingsState({
            ...settingState,
            [name]: validatedValue,
        });
    };

    const validateValue = (value: number) => {
        if (min !== undefined && min !== null && value < min) {
            toast.error(`Minimum value for ${name} is ${min}`);
            return min;
        }
        if (max !== undefined && max !== null && value > max) {
            toast.error(`Maximum value for ${name} is ${max}`);
            return max;
        }
        return parseFloat(value.toFixed(1));
    };

    return (
        <div className={styles.form_control_number}>
            {name && <label>{name}</label>}

            <div
                className={`${styles.number_input_container} ${
                    disabled ? styles.disabled : ''
                }`}
            >
                {startAdornment && (
                    <div className={styles.text_info}>{startAdornment}</div>
                )}
                <input
                    type='number'
                    className={styles.number_input}
                    value={settingState[name]}
                    min={min || undefined}
                    max={max || undefined}
                    step={step}
                    disabled={disabled}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />

                {endAdornment && (
                    <div className={styles.text_info}>{endAdornment}</div>
                )}

                <div className={styles.steps}>
                    <div
                        className={styles.svg}
                        onMouseDown={handleChangeStep(step)}
                    >
                        <ArrowDropUpOutlined />
                    </div>
                    <div
                        className={styles.svg}
                        onMouseDown={handleChangeStep(-step)}
                    >
                        <ArrowDropDownOutlined />
                    </div>
                </div>
            </div>
        </div>
    );
};
