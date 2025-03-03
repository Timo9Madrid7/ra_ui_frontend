import React from 'react';
import { CustomNumberInput } from '@/components/UI/SolverSettings/components/Input/Number/Number';
import SliderInput from '@/components/UI/SolverSettings/components/Input/Slider';
import CheckboxInput from '@/components/UI/SolverSettings/components/Input/CheckBox';
import { CustomInputProps, SimulationParamSetting } from '@/types';
import RadioInput from '@/components/UI/SolverSettings/components/Input/Radio';

const renderers: { [key: string]: (setting: SimulationParamSetting, value: any, onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void) => JSX.Element } = {
    text: (setting, value, onChange) => (
        <CustomNumberInput
            value={value}
            onChange={onChange}
            {...setting}
        />
    ),
    slider: (setting, value, onChange) => (
        <SliderInput
            setting={setting}
            value={value}
            onChange={onChange}
        />
    ),
    checkbox: (setting, value, onChange) => (
        <CheckboxInput
            setting={setting}
            value={value}
            onChange={onChange}
        />
    ),
    radio: (setting, value, onChange) => (
        <RadioInput
            setting={setting}
            value={value}
            onChange={onChange}
        />
    ),
};

const CustomInput: React.FC<CustomInputProps> = ({ setting, value, onChange }) => {
    const renderer = renderers[setting.display];
    return renderer ? renderer(setting, value, onChange) : null;
};

export default CustomInput;