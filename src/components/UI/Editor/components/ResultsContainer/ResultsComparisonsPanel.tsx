import {FC, useEffect, useState} from 'react';

/** Components */
import {
    AddComparisonPopup,
    ResultComparison,
    ResultComparisonProvider
} from '@/components';
import {IconButton} from '@mui/material';
import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
/** Context */
import {useResultsContext} from '@/components';
import {ModelActionType, useModelContext} from '@/context/ModelContext';
import {ActionType as SimActionType, useSimulationContext} from '@/context/SimulationContext';

/** Hooks */
import {useGetModelInformation, useLoadAndExtractFileFromUrl} from '@/hooks';

/** Types */
import {ModelInformation, Simulation} from '@/types';

/** Constants */
import {MAX_COMPARISONS} from '@/components';

import styles from './styles.module.scss';
import {PresetEnum} from "@/enums";
import {SsidChart} from "@mui/icons-material";
import {DefaultButton} from "@/components";

type ResultsComparisonsPanel = {
    originalModelInformation: ModelInformation;
    selectedSimulation: Simulation;
};

export const ResultsComparisonsPanel: FC<ResultsComparisonsPanel> = (
    {
        originalModelInformation,
        selectedSimulation,
    }) => {

    const {dispatch: simDispatch} = useSimulationContext();
    const {availableComparisons, selectedComparisonIndex, dispatch: resultsDispatch} = useResultsContext();

    const {models3d, addModelFromFile, currentModelId, dispatch: modelDispatch} = useModelContext();
    const [newModelId, setNewModelId] = useState<string | null>(null);
    const [newModelSimulation, setNewModelSimulation] = useState<Simulation | null>(null);

    const {data: modelInformationData = null} = useGetModelInformation(newModelId);
    const {data: modelFile} = useLoadAndExtractFileFromUrl(modelInformationData?.modelUrl || null, newModelId);

    const [showPopup, setShowPopup] = useState(false);
    const {allProjectsWithSims} = useResultsContext();

    const selectSimulation = (comparisonSimulation: Simulation) => {
        if (comparisonSimulation.simulationRun) {
            // We take the simulation object but use most of the properties from the last simulation run
            const newSelectedSim: Simulation = {
                ...comparisonSimulation,
                sources: comparisonSimulation.sources,
                receivers: comparisonSimulation.receivers,
                layerIdByMaterialId: comparisonSimulation.layerIdByMaterialId,
                settingsPreset: comparisonSimulation.settingsPreset || PresetEnum.Default,
                solverSettings: comparisonSimulation.solverSettings,
                taskType: comparisonSimulation.taskType || null,
            };
            simDispatch({
                type: SimActionType.SET_SELECTED_SIMULATION,
                simulation: newSelectedSim,
            });
        }
    };

    useEffect(() => {
        if (modelFile && newModelId) {
            const handleModelLoaded = () => {
                modelDispatch({
                    type: ModelActionType.SET_CURRENT_MODEL_ID,
                    modelId: newModelId,
                });

                if (newModelSimulation) {
                    selectSimulation(newModelSimulation);
                }
            };

            addModelFromFile(newModelId, modelFile, handleModelLoaded);
        }
    }, [modelFile, newModelId]);

    const selectedComparison = availableComparisons[selectedComparisonIndex];
    const selectedComparisonSim = selectedComparison.formState?.selectedSimulation;
    useEffect(() => {
        // We wait for the modelId to be set on the selected simulation object (after useGetSimulationById has been executed and object updated in ResultsComparison component)
        if (selectedComparisonSim?.modelId) {
            // Check if selected result comparison contains a different model
            if (selectedComparisonSim.modelId !== currentModelId) {
                if (!models3d[selectedComparisonSim.modelId]) {
                    // Store the model that needs to be loaded and the simulation that needs to be set (after model is loaded)
                    setNewModelId(selectedComparisonSim.modelId);
                    setNewModelSimulation(selectedComparisonSim);
                } else {
                    // If the model is already loaded we can set the model id and simulation right away
                    modelDispatch({
                        type: ModelActionType.SET_CURRENT_MODEL_ID,
                        modelId: selectedComparisonSim.modelId,
                    });

                    // If we are changing model we know we changed the
                    selectSimulation(selectedComparisonSim);
                }
            } else if (selectedSimulation && selectedComparisonSim && selectedComparisonSim.id !== selectedSimulation.id) {
                selectSimulation(selectedComparisonSim);
            }
        }
    }, [selectedComparisonIndex, selectedComparisonSim?.modelId]);


    const [open, setOpen] = React.useState(availableComparisons.length > 1);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };


    return (
        <div className={styles.comparison_container}>
            <IconButton
                color="warning"
                aria-label="open drawer"
                edge="end"
                onClick={handleDrawerOpen}
                className={styles.open_comparison_btn}
            >
                <SsidChart/>
            </IconButton>

            <Drawer
                sx={{
                    width: '350px',
                    '& .MuiDrawer-paper': {
                        width: '350px',
                        padding: '10px',
                        overflow: 'hidden',
                    },
                }}
                variant="persistent"
                anchor="right"
                open={open}
            >

                <div className={styles.header}>
                    <h3>Comparison Panel</h3>
                </div>
                <Divider/>
                <div className={styles.comparison_panel}>
                    {availableComparisons?.map(({color, formState}, index: number) => (
                        <ResultComparisonProvider key={color + formState?.simulationId}>
                            <ResultComparison
                                modelInformationData={originalModelInformation}
                                defaultState={formState}
                                index={index}
                                color={color}
                                isSelected={selectedComparisonIndex === index}
                            />
                        </ResultComparisonProvider>
                    ))}
                </div>
                <Divider/>

                <div className={styles.footer}>
                    <IconButton
                        edge='end'
                        onClick={handleDrawerClose}>
                        <ChevronRightIcon/>
                    </IconButton>

                    {availableComparisons.length < MAX_COMPARISONS && (
                        <>
                            <div>
                                <DefaultButton
                                    disabled={!allProjectsWithSims || Object.keys(allProjectsWithSims).length === 0}
                                    onClick={() => setShowPopup(true)}
                                    label='Add simulation'/>
                            </div>
                            <AddComparisonPopup showPopup={showPopup} setShowPopup={setShowPopup}/>
                        </>
                    )}
                </div>
            </Drawer>
        </div>
    );
};
