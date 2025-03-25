import React, { Dispatch, SetStateAction } from 'react';
import { CustomNumberInput } from '@/components/UI/SolverSettings/components/Input/Number/Number';
import SliderInput from '@/components/UI/SolverSettings/components/Input/Slider';
import CheckboxInput from '@/components/UI/SolverSettings/components/Input/CheckBox';
import { CustomInputProps, SimulationParamSetting } from '@/types';
import RadioInput from '@/components/UI/SolverSettings/components/Input/Radio';

const renderers: {
    [key: string]: (
        setting: SimulationParamSetting,
        settingState: { [key: string]: any },
        setSettingsState: Dispatch<SetStateAction<{ [key: string]: any }>>
    ) => JSX.Element;
} = {
    text: (setting, settingState, setSettingsState) => (
        <CustomNumberInput
            settingState={settingState}
            setSettingsState={setSettingsState}
            {...setting}
        />
    ),
    slider: (setting, settingState, setSettingsState) => (
        <SliderInput
            setting={setting}
            settingState={settingState}
            setSettingsState={setSettingsState}
        />
    ),
    checkbox: (setting, settingState, setSettingsState) => (
        <CheckboxInput
            setting={setting}
            settingState={settingState}
            setSettingsState={setSettingsState}
        />
    ),
    radio: (setting, settingState, setSettingsState) => (
        <RadioInput
            setting={setting}
            settingState={settingState}
            setSettingsState={setSettingsState}
        />
    ),
};

const CustomInput: React.FC<CustomInputProps> = ({
    setting,
    settingState,
    setSettingsState,
}) => {
    const renderer = renderers[setting.display];
    return renderer ? renderer(setting, settingState, setSettingsState) : null;
};

export default CustomInput;
