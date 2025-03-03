import React from 'react';
import { SimulationParamSetting } from '@/types';
import styles from './style.module.scss';

interface SliderInputProps {
    setting: SimulationParamSetting;
    value: any;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SliderInput: React.FC<SliderInputProps> = ({ setting, value, onChange }) => {
    return (
        <div className={styles.container}>
            <label className={styles.label}>{setting.name}</label>
            <div className={styles["slider-container"]}>
                                <span>{setting.min}</span>

                <input
                    type="range"
                    className={styles.slider}
                    value={value}
                    onChange={onChange}
                    min={setting.min ?? undefined}
                    max={setting.max ?? undefined}
                    step={setting.step ?? undefined}
                />
                <span>{setting.max}</span>
                <span className={styles.value}>{value}</span>
            
            </div>
        </div>
    );
};

export default SliderInput;