import {useEffect, useState} from 'react';

/** Context */
import {useSimulationContext} from '@/context/SimulationContext';
import {ActionType as EditorActionType, useEditorContext} from '@/context/EditorContext';
import {useMaterialPanelContext, ActionType} from '@/components/UI/MaterialPanel';

/** Components */
import {
    TabPanel,
    LayersTable,
    SolverSettings,
    LoadingFullScreen,
    PointsSettings
} from '@/components';

import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import SensorsOutlinedIcon from '@mui/icons-material/SensorsOutlined';

/** Styles */
import './styles.scss';
import {SIMULATION_IS_RUNNING, SIMULATION_STATUS_1_In_PENDING} from "@/constants";

// Variable used to change the simulationKey to re-render components, when Edit popup has been closed
let simulationKeyIncrement = 0;

export const ToolbarTabs = () => {
    const [tabValue, setTabValue] = useState(1);
    const [sourceAndReceiversTabValue, setSourceAndReceiversTabValue] = useState(0);

    const [disable, setDisable] = useState(false);
    const {dispatch: editorDispatch, editSimulation, isInResultsMode, selected} = useEditorContext();

    const {
        simulationState: {selectedSimulation},
    } = useSimulationContext();
    const {dispatch, isMaterialsLibraryOpen} = useMaterialPanelContext();

    const [simulationKey, setSimulationKey] = useState('');

    useEffect(() => {
        if (selectedSimulation) {
            // update simulationKey if new simulation is selected, to trigger a re-render for components
            setSimulationKey(selectedSimulation.id);
        }
    }, [selectedSimulation?.id]);

    useEffect(() => {
        // check if hasBeenEdited changed and if simulation is Completed, then update simulationKey with
        // simulationKeyIncrement to trigger a re-render for components, works for both Edit and Revert
        if (editSimulation.showDialog === false && selectedSimulation?.simulationRun?.status === 'Completed') {
            simulationKeyIncrement++;
            setSimulationKey(selectedSimulation.id + simulationKeyIncrement.toString());
        }
    }, [selectedSimulation?.hasBeenEdited, editSimulation.showDialog]);


    useEffect(() => {
        if (isInResultsMode || SIMULATION_STATUS_1_In_PENDING.includes(selectedSimulation?.status)) {
            setDisable(true);
        } else {
            setDisable(false);
        }
    }, [ isInResultsMode, selectedSimulation?.status]);

    useEffect(() => {
        if (isInResultsMode) {
            if (isMaterialsLibraryOpen) {
                dispatch({
                    type: ActionType.CLOSE_MATERIALS_PANEL,
                });
            }
            if (selected) {
                editorDispatch({type: EditorActionType.CLEAR_SELECTED});
            }
        }
    }, [isInResultsMode]);


    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        if (newValue !== tabValue) {
            dispatch({
                type: ActionType.CLOSE_MATERIALS_PANEL,
            });
        }
        setTabValue(newValue);
    };

    return (
        <div className={`container ${SIMULATION_IS_RUNNING.includes(selectedSimulation?.status) ? 'running' : ''}`}>
            {SIMULATION_IS_RUNNING.includes(selectedSimulation?.status) && (
                <LoadingFullScreen
                    message={'The simulation is running'}
                    note={'It is unreliable to change the settings while the simulation is running!'}
                />
            )}
            <Tabs
                value={tabValue}
                variant="fullWidth"
                onChange={handleChange}
                aria-label="icon label tabs example"

            >
                <Tab icon={<LayersOutlinedIcon/>} label="Materials"/>
                <Tab icon={<SensorsOutlinedIcon/>} label="Sources/Receivers"/>
                <Tab icon={<SettingsOutlinedIcon/>} label="Settings"/>
            </Tabs>

            <div className="panels">
                <TabPanel
                    value={tabValue}
                    index={0}
                    className={`panel mat 
                    ${disable ? 'disabled' : ''}`}>
                    <LayersTable/>
                </TabPanel>

                <TabPanel value={tabValue} index={1}
                          className={`panel sr ${disable ? 'disabled' : ''}`}>
                    {selectedSimulation && (
                        <PointsSettings
                            tabValue={sourceAndReceiversTabValue}
                            setTabValue={setSourceAndReceiversTabValue}
                            key={simulationKey}
                        />
                    )}
                </TabPanel>

                <TabPanel value={tabValue} index={2}
                          className={`panel set ${disable ? 'disabled' : ''}`}>
                    {selectedSimulation && selectedSimulation.id && (
                        <SolverSettings
                            key={selectedSimulation.id}
                            selectedSimulation={selectedSimulation}
                            isInResultsMode={isInResultsMode}
                        />
                    )}
                </TabPanel>
            </div>
        </div>
    );
};
