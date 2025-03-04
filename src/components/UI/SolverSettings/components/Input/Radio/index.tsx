import React from 'react';
import { SimulationParamSetting } from '@/types';
import styles from './style.module.scss';

interface RadioInputProps {
    setting: SimulationParamSetting;
    value: any;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const RadioInput: React.FC<RadioInputProps> = ({ setting, value, onChange }) => {
    return (
        <div className={styles.container}>
            <label className={styles.label}>{setting.name}</label>
            <div className={styles["option-list"]}>
                {setting.options && Object.keys(setting.options).map((option) => (
                    <div key={option} className={styles.option}>
                        <input
                            type="radio"
                            name={setting.name}
                            value={option}
                            checked={value === option}
                            onChange={onChange}
                        />
                        <label>{option}</label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RadioInput;