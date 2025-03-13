import React from 'react';
import { SimulationParamSetting } from '@/types';
import styles from './style.module.scss';

interface CheckboxInputProps {
    setting: SimulationParamSetting;
    settingState: { [key: string]: any };
    setSettingsState: React.Dispatch<
        React.SetStateAction<{ [key: string]: any }>
    >;
}

const CheckboxInput: React.FC<CheckboxInputProps> = ({
    setting,
    settingState,
    setSettingsState,
}) => {
    return (
        <div className={styles.container}>
            <label className={styles.label}>{setting.name}</label>
            <div className={styles['option-list']}>
                {setting.options &&
                    settingState[setting.name] &&
                    Object.keys(setting.options).map((option) => (
                        <div key={option} className={styles.option}>
                            <input
                                type='checkbox'
                                value={option}
                                checked={settingState[setting.name].includes(
                                    option
                                )}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                    const clickedOption = e.target.value;
                                    const previousSelection =
                                        settingState[setting.name];
                                    const isOptionSelected =
                                        previousSelection.includes(
                                            clickedOption
                                        );
                                    const newSelection = isOptionSelected
                                        ? previousSelection.filter(
                                              (item: string) =>
                                                  item !== clickedOption
                                          )
                                        : [...previousSelection, clickedOption];
                                    setSettingsState({
                                        ...settingState,
                                        [setting.name]: newSelection,
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

export default CheckboxInput;
