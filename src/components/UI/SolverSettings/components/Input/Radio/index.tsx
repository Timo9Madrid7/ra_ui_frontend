import React from 'react';
import { SimulationParamSetting } from '@/types';
import styles from './style.module.scss';

interface RadioInputProps {
    setting: SimulationParamSetting;
    settingState: { [key: string]: any };
    setSettingsState: React.Dispatch<
        React.SetStateAction<{ [key: string]: any }>
    >;
}

const RadioInput: React.FC<RadioInputProps> = ({
    setting,
    settingState,
    setSettingsState,
}) => {
    return (
        <div className={styles.container}>
            <label className={styles.label}>{setting.name}</label>
            <div className={styles['option-list']}>
                {setting.options &&
                    Object.keys(setting.options).map((option) => (
                        <div key={option} className={styles.option}>
                            <input
                                type='radio'
                                name={setting.name}
                                value={option}
                                checked={settingState[setting.name] === option}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                    setSettingsState({
                                        ...settingState,
                                        [setting.name]: e.target.value,
                                    });
                                }}
                            />
                            <label>{option}</label>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default RadioInput;
