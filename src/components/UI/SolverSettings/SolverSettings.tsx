import { FC, useEffect, useState } from 'react';

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
    CircularProgress,
} from '@mui/material';
import {
    DefaultButton,
    Dialog,
    NumberInput,
    useSolverSettings,
    useUpdateSolverSettings,
} from '@/components';

/**
 * Types, Enums, Constants
 * */
import { SimulationParamSetting, Simulation, Status } from '@/types';
import { PresetEnum, MethodEnum } from '@/enums';
import { DE_TEXT, DG_TEXT } from '@/constants';

const minImpulseResponse = 0.005;
const maxImpulseResponse = 20;
const isStaticRender: boolean = false; // true: static render; false: dynamic render

type SolverSettingsProps = {
    selectedSimulation: Simulation;
    isInResultsMode: boolean;
};

import styles from './styles.module.scss';
import { useSimulationSettingParams } from './hooks/useSimulationSettingParams';
import { SelectAutoComplete } from '@/components/Base/Select/SelectAutoComplete';
import { useSimulationSettingOptions } from './hooks/useSimulationSettingOptions';
import CustomInput from './components/CustomInput';
import { JSONEditor } from './components/JSONEditor';
import { format } from 'path/posix';

export const SolverSettings: FC<SolverSettingsProps> = ({
    selectedSimulation,
    isInResultsMode,
}) => {
    const [preset, setPreset] = useState(
        selectedSimulation.settingsPreset === null
            ? PresetEnum.Default
            : selectedSimulation.settingsPreset
    );

    // Run just once after application is loaded
    useEffect(() => {
        setPreset(
            selectedSimulation.settingsPreset === null
                ? PresetEnum.Default
                : selectedSimulation.settingsPreset
        );
    }, []);

    const { dgSettings } = selectedSimulation.solverSettings;

    // const [impulseResponseLength, setImpulseResponseLength] = useState<
    //     number | undefined
    // >();
    const [taskType, setTaskType] = useState(selectedSimulation.taskType);

    // const [energyDecayThreshold, setEnergyDecayThreshold] = useState<
    //     number | null
    // >(dgSettings?.energyDecayThreshold ?? null);
    // const [autoStop, setAutoStop] = useState(
    //     dgSettings?.energyDecayThreshold ? true : false
    // );
    const [jsonPopup, setJsonPopup] = useState(false);
    const updateSolverSettings = useUpdateSolverSettings();

    // get the custom setting params json from BE
    const {
        data: customSettingParams,
        isLoading: isCustomSettingParamsLoading,
    } = useSimulationSettingParams(true, taskType as string);

    // formated custom setting json to state
    const [settingsState, setSettingsState] = useState<{ [key: string]: any }>(
        {}
    );

    // setting up the value of the state with the BE value, and if the user previously
    // changed the value, it will be updated with the user value
    // settingState will be used in customized params
    useEffect(() => {
        if (customSettingParams) {
            const settingType = customSettingParams.type;
            const prevSetting = selectedSimulation.solverSettings[settingType];
            setSettingsState(
                customSettingParams?.options.reduce(
                    (
                        acc: { [key: string]: any },
                        setting: SimulationParamSetting
                    ) => {
                        if (
                            prevSetting &&
                            prevSetting[setting.name] !== undefined
                        ) {
                            acc[setting.name] = prevSetting[setting.name];
                        } else {
                            acc[setting.name] = setting.default;
                        }
                        return acc;
                    },
                    {}
                ) || {}
            );
        }
    }, [customSettingParams]);

    const {
        // saveImpulseResponseLength,
        // saveEnergyDecayThreshold,
        // saveTaskType,
        saveSettingsPreset,
    } = useSolverSettings();

    // Save the previous state
    const [prevPresetType, setPrevPresetType] = useState(preset);
    const [prevTaskType, setPrevTaskType] = useState(taskType);
    // const [prevAutoStop, setPrevAutoStop] = useState(autoStop);

    // TODO RISK
    useEffect(() => {
        console.log('Im called here preset', preset, prevPresetType);

        if (preset !== prevPresetType) {
            console.log('Im called here !');
            saveAndUpdate();

            // the default of all presets should be Autostop is ON
            // setAutoStop(true);
        }
    }, [preset]);

    const saveAndUpdate = async () => {
        console.log('saveAndUpdate');
        let taskType =
            preset === PresetEnum.Advanced
                ? selectedSimulation.taskType
                : MethodEnum.DE;
        // TODO RISK
        const energyDecayThreshold =
            preset !== PresetEnum.Advanced
                ? 35
                : dgSettings?.energyDecayThreshold || 0;
        console.log(taskType, '<---');
        console.log(energyDecayThreshold, '<--- edt');
        setTaskType(taskType);

        // setEnergyDecayThreshold(energyDecayThreshold);
        // Save new settings
        let updatedSimulation = {
            ...selectedSimulation,
            taskType,
            settingsPreset: preset,
            solverSettings: {
                // ...selectedSimulation.solverSettings,
                simulationSettings: {
                    'Energy decay threshold': energyDecayThreshold,
                    'Impulse response length': 0,
                    ...selectedSimulation.solverSettings.deSettings,
                },
                // dgSettings: {
                //     ...selectedSimulation.solverSettings.dgSettings,
                //     energyDecayThreshold: energyDecayThreshold,
                //     impulseLengthSeconds: 0,
                // },
            },
        };
        console.log(
            updatedSimulation,
            'updated simulation',
            selectedSimulation
        );
        await updateSolverSettings(updatedSimulation);
    };

    const saveAndUpdateCustomSettings = async () => {
        if (!customSettingParams) return;
        let updatedSimulation = {
            ...selectedSimulation,
            taskType: taskType,
            solverSettings: {
                // remove the old settings
                // ...selectedSimulation.solverSettings,
                [customSettingParams.type]: {
                    ...selectedSimulation.solverSettings[
                        customSettingParams.type
                    ],
                    ...settingsState,
                },
            },
        };
        await updateSolverSettings(updatedSimulation);
    };

    const triggerSetTaskType = (taskTypeIn: string) => {
        setPrevTaskType(taskType);
        setTaskType(taskTypeIn);

        if (selectedSimulation.status == Status.Completed) {
            // In the next UI frame, set the radio button back
            setTimeout(() => {
                setTaskType(prevTaskType);
            });
        }
    };

    const triggerSetPreset = (presetIn: PresetEnum) => {
        console.log(presetIn, '<---');
        console.log(preset);

        setPrevPresetType(preset);
        setPreset(presetIn);

        // TODO RISK
        saveSettingsPreset(presetIn);

        if (selectedSimulation.status == Status.Completed) {
            // In the next UI frame, set the radio button back
            setTimeout(() => {
                setPreset(prevPresetType);
            });
        }
    };

    // const triggerSetAutoStop = (type: string) => {
    //     setPrevAutoStop(autoStop);
    //     if (type === 'edt') {
    //         setEnergyDecayThreshold(35);
    //         saveEnergyDecayThreshold(35);
    //         setAutoStop(true);
    //     } else {
    //         setAutoStop(false);
    //         setEnergyDecayThreshold(null);
    //         saveEnergyDecayThreshold(null);
    //     }

    //     if (selectedSimulation.status == Status.Completed) {
    //         // In the next UI frame, set the radio button back
    //         setTimeout(() => {
    //             setAutoStop(prevAutoStop);
    //             setEnergyDecayThreshold(prevAutoStop ? 35 : null);
    //         });
    //     }
    // };

    const { formattedSimulationSettingOptions } = useSimulationSettingOptions(
        !isStaticRender
    );

    const AvailabelMethodSelector: (
        isStaticRender: boolean
    ) => JSX.Element | null = (isStaticRender) => {
        if (isStaticRender) {
            return (
                <RadioGroup
                    value={taskType}
                    name='method-selector'
                    onChange={(e) => triggerSetTaskType(e.target.value)}
                >
                    <FormControlLabel
                        control={<Radio size={'small'} />}
                        value={MethodEnum.BOTH.toString()}
                        disabled={false}
                        label='Both methods (DE & DG)'
                    />
                    <Tooltip placement={'right'} title={DG_TEXT}>
                        <FormControlLabel
                            value={MethodEnum.DG.toString()}
                            control={<Radio size={'small'} />}
                            label='Discontinuous Galerkin method (DG)'
                        />
                    </Tooltip>
                    <Tooltip placement={'right'} title={DE_TEXT}>
                        <FormControlLabel
                            value={MethodEnum.DE.toString()}
                            control={<Radio size={'small'} />}
                            label='Diffusion Equation method (DE)'
                        />
                    </Tooltip>
                </RadioGroup>
            );
        } else {
            // drop down menu
            const defaultValue = formattedSimulationSettingOptions().find(
                // @ts-ignore
                (option) => option.id == taskType
            );
            if (!defaultValue) return null;
            return (
                <SelectAutoComplete
                    options={formattedSimulationSettingOptions()}
                    label='Available Methods'
                    isOptionEqualToValue={(option, value) => {
                        return option.id === value.id;
                    }}
                    defaultValue={defaultValue}
                    onChange={(_, value) => {
                        if (value) {
                            triggerSetTaskType(value.id.toString());
                        }
                    }}
                />
            );
        }
    };

    return (
        <div className={styles.settings_container}>
            <FormControl>
                <RadioGroup
                    row
                    value={preset}
                    aria-labelledby='type-of-settings'
                    name='type-of-settings'
                >
                    <FormControlLabel
                        control={<Radio size={'small'} />}
                        value={PresetEnum.Default}
                        disabled={false}
                        // @ts-expect-error:there is always value
                        onChange={(e) => triggerSetPreset(e.target.value)}
                        label='Default'
                    />
                    <FormControlLabel
                        value={PresetEnum.Advanced}
                        control={<Radio size={'small'} />}
                        // @ts-expect-error:there is always value
                        onChange={(e) => triggerSetPreset(e.target.value)}
                        label='Advanced'
                    />
                </RadioGroup>
            </FormControl>
            <Divider />
            {selectedSimulation && selectedSimulation.id && (
                <div className={styles.settings_body}>
                    {preset === PresetEnum.Default ? (
                        <p>
                            By default, the calculation will be running for{' '}
                            <strong>both</strong> methods using the default
                            configuration and settings.
                        </p>
                    ) : (
                        <>
                            <div>
                                <div>
                                    <h3 className={styles.section_title}>
                                        Available Methods
                                    </h3>
                                    <p className={styles.footnote}>
                                        currently we support DG (
                                        <i className={styles.blue}>
                                            for low frequencies
                                        </i>
                                        ) and DE (
                                        <i className={styles.blue}>
                                            for high frequencies
                                        </i>
                                        ) methods.
                                    </p>
                                    {AvailabelMethodSelector(isStaticRender)}
                                </div>
                                {/* <h3 className={styles.section_title}>
                                    Customize Settings
                                </h3>
                                <div className={styles.customize_section}>
                                    <RadioGroup
                                        value={autoStop ? 'edt' : 'irl'}
                                        name='row-radio-buttons-group'
                                        onChange={(e) =>
                                            triggerSetAutoStop(e.target.value)
                                        }
                                    >
                                        <FormControlLabel
                                            control={<Radio size={'small'} />}
                                            value='edt'
                                            disabled={false}
                                            label='Energy decay threshold'
                                        />
                                        <FormControlLabel
                                            value='irl'
                                            control={<Radio size={'small'} />}
                                            label='Impulse response length'
                                        />
                                    </RadioGroup>

                                    <div className={styles.inputs}>
                                        <NumberInput
                                            label={''}
                                            value={
                                                energyDecayThreshold ??
                                                undefined
                                            }
                                            onChange={(value) => {
                                                if (
                                                    value === null ||
                                                    value == undefined
                                                )
                                                    setEnergyDecayThreshold(
                                                        null
                                                    );
                                                else
                                                    setEnergyDecayThreshold(
                                                        value
                                                    );
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
                                            label={
                                                autoStop ? (
                                                    <span
                                                        style={{
                                                            color: '#999999',
                                                        }}
                                                    ></span>
                                                ) : (
                                                    ''
                                                )
                                            }
                                            value={
                                                autoStop
                                                    ? undefined
                                                    : impulseResponseLength
                                            }
                                            onChange={setImpulseResponseLength}
                                            onBlur={(value) => {
                                                if (
                                                    value !== undefined &&
                                                    value < minImpulseResponse
                                                ) {
                                                    value = minImpulseResponse;
                                                    setImpulseResponseLength(
                                                        minImpulseResponse
                                                    );
                                                }

                                                saveImpulseResponseLength(
                                                    value
                                                );
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
                                </div> */}
                            </div>
                            <Divider />
                            {isCustomSettingParamsLoading ? (
                                <CircularProgress />
                            ) : (
                                <div>
                                    {jsonPopup && (
                                        <Dialog
                                            fullWidth
                                            maxWidth={'sm'}
                                            open={true}
                                            title={'Edit Params with JSON'}
                                            onClose={() => setJsonPopup(false)}
                                        >
                                            <JSONEditor
                                                settingState={settingsState}
                                                setSettingState={
                                                    setSettingsState
                                                }
                                            />
                                        </Dialog>
                                    )}
                                    <div className={styles['flex-container']}>
                                        <h3 className={styles.section_title}>
                                            Edit Settings
                                        </h3>
                                        <DefaultButton
                                            label='Edit with JSON'
                                            sx={{
                                                width: '150px',
                                            }}
                                            onClick={() => {
                                                setJsonPopup(true);
                                            }}
                                        ></DefaultButton>
                                    </div>
                                    {customSettingParams?.options.map(
                                        (setting: SimulationParamSetting) => (
                                            <CustomInput
                                                key={setting.name}
                                                setting={setting}
                                                value={setting.default}
                                                settingState={settingsState}
                                                setSettingsState={
                                                    setSettingsState
                                                }
                                            />
                                        )
                                    )}

                                    <div className={styles['flex-container']}>
                                        <DefaultButton
                                            label='Save'
                                            onClick={() => {
                                                saveAndUpdateCustomSettings();
                                            }}
                                        ></DefaultButton>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};
