import {FC, useEffect, useState} from 'react';

/**
 * Components
 * */
import {
    Radio,
    Tooltip,
    Divider,
    RadioGroup,
    FormControl,
    FormControlLabel,
    CircularProgress
} from '@mui/material';
import {
    NumberInput,
    useSolverSettings,
    useUpdateSolverSettings,
} from "@/components";

/**
 * Types, Enums, Constants
 * */
import {SimulationParamSetting, Simulation, Status} from '@/types';
import {PresetEnum, MethodEnum} from "@/enums";
import {DE_TEXT, DG_TEXT} from "@/constants";

const minImpulseResponse = 0.005;
const maxImpulseResponse = 20;
const isStaticRender: boolean = false; // true: static render; false: dynamic render

type SolverSettingsProps = {
    selectedSimulation: Simulation;
    isInResultsMode: boolean;
};

import styles from './styles.module.scss'
import { useSimulationSettingParams } from './hooks/useSimulationSettingParams';
import { SelectAutoComplete } from '@/components/Base/Select/SelectAutoComplete';
import { useSimulationSettingOptions } from './hooks/useSimulationSettingOptions';
import CustomInput from './components/CustomInput';
import { is } from '@react-three/fiber/dist/declarations/src/core/utils';

export const SolverSettings: FC<SolverSettingsProps> = ({selectedSimulation, isInResultsMode}) => {
    const [preset, setPreset] = useState(
        selectedSimulation.settingsPreset === null ? PresetEnum.Default : selectedSimulation.settingsPreset
    );

    // Run just once after application is loaded
    useEffect(() => {
        setPreset(
            selectedSimulation.settingsPreset === null ? PresetEnum.Default : selectedSimulation.settingsPreset
        )
    }, []);

    const {dgSettings} = selectedSimulation.solverSettings;

    const [impulseResponseLength, setImpulseResponseLength] = useState<number | undefined>();
    const [taskType, setTaskType] = useState(selectedSimulation.taskType);
    const [energyDecayThreshold, setEnergyDecayThreshold] = useState<number | null>(dgSettings?.energyDecayThreshold);
    const [autoStop, setAutoStop] = useState(dgSettings.energyDecayThreshold ? true : false);

    const updateSolverSettings = useUpdateSolverSettings();

    const {
        data: customSettingParams,
        isLoading: isCustomSettingParamsLoading,
    } = useSimulationSettingParams(true, taskType as string);

    const [settingsState, setSettingsState] = useState<{ [key: string]: any }>(() => {
        return customSettingParams?.reduce((acc: { [key: string]: any }, setting: SimulationParamSetting) => {
            acc[setting.name] = setting.default;
            return acc;
        }, {}) || {};
    });

    const {
        saveImpulseResponseLength,
        saveEnergyDecayThreshold,
        saveTaskType,
        saveSettingsPreset,
    } = useSolverSettings();

    // Save the previous state
    const [prevPresetType, setPrevPresetType] = useState(preset);
    const [prevTaskType, setPrevTaskType] = useState(taskType);
    const [prevAutoStop, setPrevAutoStop] = useState(autoStop);

    useEffect(() => {
        if (preset !== prevPresetType) {
            saveAndUpdate();

            // the default of all presets should be Autostop is ON
            setAutoStop(true);
        }
    }, [preset]);

    const saveAndUpdate = async () => {

        let taskType = preset === PresetEnum.Advanced ? selectedSimulation.taskType : MethodEnum.BOTH;
        const energyDecayThreshold =
            preset !== PresetEnum.Advanced ? 35 : dgSettings.energyDecayThreshold;

        setTaskType(taskType);

        setEnergyDecayThreshold(energyDecayThreshold);
        // Save new settings
        let updatedSimulation = {
            ...selectedSimulation,
            taskType,
            settingsPreset: preset,
            solverSettings: {
                ...selectedSimulation.solverSettings,
                deSettings: {
                    ...selectedSimulation.solverSettings.deSettings,
                    energyDecayThreshold: energyDecayThreshold,
                    impulseLengthSeconds: 0,
                },
                dgSettings: {
                    ...selectedSimulation.solverSettings.dgSettings,
                    energyDecayThreshold: energyDecayThreshold,
                    impulseLengthSeconds: 0,
                },
            },
        };

        await updateSolverSettings(updatedSimulation);
    };

    const triggerSetTaskType = (taskTypeIn: string) =>
    {
        setPrevTaskType (taskType);
        setTaskType (taskTypeIn);

        saveTaskType(taskTypeIn);

        if (selectedSimulation.status == Status.Completed)
        {
            // In the next UI frame, set the radio button back 
            setTimeout(() => {
                setTaskType(prevTaskType);
            });
        }

    }

    const triggerSetPreset = (presetIn: PresetEnum) => {
        setPrevPresetType (preset);
        setPreset (presetIn);

        saveSettingsPreset(presetIn);

        if (selectedSimulation.status == Status.Completed)
        {
            // In the next UI frame, set the radio button back 
            setTimeout(() => {
                setPreset(prevPresetType);
            });
        }
    }

    const triggerSetAutoStop = (type: string) => {
        setPrevAutoStop (autoStop);
        if (type === 'edt')
        {
            setEnergyDecayThreshold(35);
            saveEnergyDecayThreshold(35);
            setAutoStop(true);
        } else {
            setAutoStop(false);
            setEnergyDecayThreshold(null);
            saveEnergyDecayThreshold(null);
        }

        if (selectedSimulation.status == Status.Completed)
        {
            // In the next UI frame, set the radio button back 
            setTimeout(() => {
                setAutoStop(prevAutoStop);
                setEnergyDecayThreshold(prevAutoStop ? 35 : null);
            });
        }
    
    };

    const { formattedSimulationSettingOptions } = useSimulationSettingOptions(!isStaticRender);
    const AvailabelMethodSelector: (isStaticRender: boolean) => JSX.Element | null = (isStaticRender) => {
        if (isStaticRender) {
            return (
                <RadioGroup
                    value={taskType}
                    name="method-selector"
                    onChange = {(e) => triggerSetTaskType(e.target.value)}
                >
                    <FormControlLabel
                        control={<Radio size={'small'}/>}
                        value={MethodEnum.BOTH.toString()}
                        disabled={false}
                        label="Both methods (DE & DG)"
                    />
                    <Tooltip placement={'right'} title={DG_TEXT}>
                        <FormControlLabel
                            value={MethodEnum.DG.toString()}
                            control={<Radio size={'small'}/>}
                            label="Discontinuous Galerkin method (DG)"
                        />
                    </Tooltip>
                    <Tooltip placement={'right'} title={DE_TEXT}>
                        <FormControlLabel
                            value={MethodEnum.DE.toString()}
                            control={<Radio size={'small'}/>}
                            label="Diffusion Equation method (DE)"
                        />
                    </Tooltip>
                </RadioGroup>
            );
        } else {
            // drop down menu
            return (
                <SelectAutoComplete
                    options={formattedSimulationSettingOptions()}
                    label='Available Methods'
                    isOptionEqualToValue={(option, value) => option.id === (value as { id: number }).id}
                    onChange={(_, value) => {
                        console.log(value, " value ")
                        if (value) {
                            triggerSetTaskType(value.id.toString());
                        }
                    }}
                />
            );
        }
        return null;
    }

    return (
        <div className={styles.settings_container}>
            <FormControl>
                <RadioGroup
                    row
                    value={preset}
                    aria-labelledby="type-of-settings"
                    name="type-of-settings">
                    <FormControlLabel
                        control={<Radio size={'small'}/>}
                        value={PresetEnum.Default}
                        disabled={false}
                        // @ts-expect-error:there is always value
                        onChange={(e) => triggerSetPreset(e.target.value)}
                        label="Default"/>
                    <FormControlLabel
                        value={PresetEnum.Advanced}
                        control={<Radio size={'small'}/>}
                        // @ts-expect-error:there is always value
                        onChange={(e) => triggerSetPreset(e.target.value)}
                        label="Advanced"/>
                </RadioGroup>
            </FormControl>
            <Divider/>
            {selectedSimulation && selectedSimulation.id && (
                <div className={styles.settings_body}>
                    {preset === PresetEnum.Default ? (
                        <p>
                            By default, the calculation will be running for <strong>both</strong> methods using
                            the default configuration and settings.
                        </p>
                    ) : (
                        <>
                            <div>
                                <div>
                                    <h3 className={styles.section_title}>Available Methods</h3>
                                    <p className={styles.footnote}>currently we support DG
                                        (<i className={styles.blue}>for low frequencies</i>) and DE
                                        (<i className={styles.blue}>for high frequencies</i>) methods.</p>
                                        {AvailabelMethodSelector(isStaticRender)}
                                </div>
                                <h3 className={styles.section_title}>Customize Settings</h3>
                                <div className={styles.customize_section}>

                                    <RadioGroup
                                        value={autoStop ? 'edt' : 'irl'}
                                        name="row-radio-buttons-group"
                                        onChange={(e) => triggerSetAutoStop(e.target.value)}
                                    >
                                        <FormControlLabel
                                            control={<Radio size={'small'}/>}
                                            value='edt'
                                            disabled={false}
                                            label="Energy decay threshold"
                                        />
                                        <FormControlLabel
                                            value='irl'
                                            control={<Radio size={'small'}/>}
                                            label="Impulse response length"
                                        />
                                    </RadioGroup>

                                    <div className={styles.inputs}>
                                        <NumberInput
                                            label={''}
                                            value={energyDecayThreshold ?? undefined}
                                            onChange={(value) => {
                                                if (value === null || value == undefined) setEnergyDecayThreshold(null);
                                                else setEnergyDecayThreshold(value);
                                            }}
                                            decimals={0}
                                            min={10}
                                            max={60}
                                            endAdornment={'dB'}
                                            step={1}
                                            disabled={!autoStop}
                                            blurOnStep={false}
                                        />
                                        <NumberInput
                                            label={autoStop ? <span style={{color: '#999999'}}></span> : ''}
                                            value={autoStop ? undefined : impulseResponseLength}
                                            onChange={setImpulseResponseLength}
                                            onBlur={(value) => {
                                                if (value !== undefined && value < minImpulseResponse) {
                                                    value = minImpulseResponse;
                                                    setImpulseResponseLength(minImpulseResponse);
                                                }

                                                saveImpulseResponseLength(value);
                                            }}
                                            decimals={3}
                                            min={0} // Needs to be set to 0 so that the step doesn't react weird. Actually this min is 0.005
                                            max={maxImpulseResponse}
                                            endAdornment={'s'}
                                            step={0.1}
                                            disabled={autoStop}
                                            blurOnStep={false}
                                        />
                                    </div>

                                </div>
                            </div>
                            <Divider/>
                            {
                                isCustomSettingParamsLoading ? (
                                    <CircularProgress/>
                                ) : (
                                    <div>
                                        <h3 className={styles.section_title}>Parameters Setting</h3>
                                        {customSettingParams.map((setting: SimulationParamSetting) => (
                                            <CustomInput
                                                key={setting.name}
                                                setting={setting}
                                                value={setting.default}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
                                                    console.log(e.target.value);
                                                }}
                                            />
                                        ))}
                                    </div>
                                )
                            }
                        </>
                    )}
                </div>
            )}
        </div>
    );
};
