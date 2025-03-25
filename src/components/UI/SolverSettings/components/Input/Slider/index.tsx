import React from 'react';
import { SimulationParamSetting } from '@/types';
import styles from './style.module.scss';

interface SliderInputProps {
    setting: SimulationParamSetting;
    settingState: { [key: string]: any };
    setSettingsState: React.Dispatch<
        React.SetStateAction<{ [key: string]: any }>
    >;
}

const SliderInput: React.FC<SliderInputProps> = ({
    setting,
    settingState,
    setSettingsState,
}) => {
    return (
        <div className={styles.container}>
            <label className={styles.label}>{setting.name}</label>
            <div className={styles['slider-container']}>
                <span>{setting.min}</span>
                <input
                    type='range'
                    className={styles.slider}
                    value={settingState[setting.name]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const newValue = parseFloat(
                            Number(e.target.value).toFixed(1)
                        );
                        setSettingsState({
                            ...settingState,
                            [setting.name]: newValue,
                        });
                    }}
                    min={setting.min ?? undefined}
                    max={setting.max ?? undefined}
                    step={setting.step ?? undefined}
                />
                <span>{setting.max}</span>
                <span className={styles.value}>
                    {settingState[setting.name]}
                </span>
            </div>
        </div>
    );
};

export default SliderInput;
