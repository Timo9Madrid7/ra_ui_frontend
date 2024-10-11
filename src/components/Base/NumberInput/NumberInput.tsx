import React, {
    ChangeEventHandler,
    FocusEventHandler,
    forwardRef,
    ReactNode,
    useEffect,
    useRef
} from 'react';
import styles from './styles.module.scss';

import {ArrowDropDownOutlined, ArrowDropUpOutlined} from '@mui/icons-material';

type NumberInputProps = {
    label?: string | ReactNode;
    disabled?: boolean;
    min?: number;
    max?: number;
    step?: number;
    startAdornment?: string | React.ReactElement;
    endAdornment?: string;
    value?: number;
    decimals?: number;
    toFixed?: boolean;
    onChange?: (value?: number) => void;
    onBlur?: (value?: number) => void;
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>, value?: number) => void;
    onDoubleClick?: React.MouseEventHandler<HTMLInputElement>;
    allowEmpty?: boolean;
    blurOnStep?: boolean;
};

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
    (
        {
            label,
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
        const internalInputElement = useRef<HTMLInputElement>(null);

        // Assign the internal ref to the forwarded ref
        useEffect(() => {
            if (ref) {
                if (typeof ref === 'function') {
                    ref(internalInputElement.current);
                } else {
                    ref.current = internalInputElement.current;
                }
            }
        }, [ref]);

        const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
            const value = event.target.value !== '' ? Number(event.target.value) : undefined;
            onChange?.(value);
        };

        const validateInput = (value?: number) => {
            if (value == undefined && !allowEmpty) {
                value = min && min > 0 ? min : 0;
            }
            if (value !== undefined) {
                if (min != undefined && (Number.isNaN(value) || value < min)) {
                    value = min;
                } else if (max != undefined && value > max) {
                    value = max;
                }
                if (toFixed) {
                    value = Number(value.toFixed(decimals));
                }
            }
            return value;
        };

        const handleBlur: FocusEventHandler<HTMLInputElement> = (event) => {
            let value = event.target.value !== '' ? Number(event.target.value) : undefined;
            value = validateInput(value);
            onChange?.(value);
            onBlur?.(value);
        };


        /**
         * Handler: Change step handler: to step up or down
         * upon receiving new value, add it with the current value
         *
         * @param {number} newValue : new value
         * @param {React.MouseEvent} e : event
         */
        const handleChangeStep = (newValue: number) => (e: React.MouseEvent) => {
            e.preventDefault();

            const inputElement = internalInputElement.current;
            if (!inputElement) return;

            let value = Number(inputElement.value) + newValue;
            value = (min !== undefined && value < min) ? min : value;
            value = (max !== undefined && value > max) ? max : value;
            value = (step < 1) ? Math.round(value * 1e6) / 1e6 : value;

            onChange?.(value);
            if (blurOnStep) onBlur?.(value);

            inputElement.focus();
        };


        return (
            <div
                className={styles.form_control_number}
                onDoubleClick={onDoubleClick}
            >
                {label && (<label>{label}</label>)}

                <div className={`${styles.number_input_container} ${disabled ? styles.disabled : ''}`}>
                    {startAdornment && (<div className={styles.text_info}>{startAdornment}</div>)}
                    <input
                        type="number"
                        ref={internalInputElement}
                        className={styles.number_input}
                        value={value !== undefined && !Number.isNaN(value) ? value : ''}
                        min={min}
                        max={max}
                        step={step}
                        disabled={disabled}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />

                    {endAdornment && (<div className={styles.text_info}>{endAdornment}</div>)}

                    <div className={styles.steps}>
                        <div className={styles.svg} onMouseDown={handleChangeStep(step)}>
                            <ArrowDropUpOutlined/>
                        </div>
                        <div className={styles.svg} onMouseDown={handleChangeStep(-step)}>
                            <ArrowDropDownOutlined/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
);
