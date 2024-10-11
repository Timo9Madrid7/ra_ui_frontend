import {useEffect, useState} from 'react';
import {useSearchParams, useLocation} from 'react-router-dom';

/**
 * Components
 * */
import {
    Menu,
    Toolbar,
    Sidebar,
    Dropdown,
    PageLayout,
    Breadcrumbs,
    ResultsHeader,
    MaterialPanel,
    CreateMaterial,
    EditSimulation,
    CreateSimulation,
    RecentSimulationNav
} from '@/components';

import {
    Viewport,
    ResultsContainer,
} from './components'

/**
 * Context
 * */
import {
    ActionType,
    ActionType as EdActionType,
    ResultsView,
    useEditorContext,
    View3DType
} from '@/context/EditorContext';
import {ModelActionType, useModelContext} from '@/context/ModelContext';
import {useSimulationContext, ActionType as SimActionType} from '@/context/SimulationContext';
import {useMaterialPanelContext} from '@/components';

/**
 * Hooks
 * */
import {
    useGetModelInformation,
    useLoadAndExtractFileFromUrl,
    useGetSimulationsByModelId,
} from '@/hooks';

import {useGetSimulationFromRouteParam} from './hooks/useGetSimulationFromRouteParam';

/**
 * Assets
 * */
import styles from './styles.module.scss';
import {
    ModelTrainingOutlined,
    LayersOutlined,
} from "@mui/icons-material";
import {VIEW3D_OPTIONS} from "@/constants";

export const Editor = ({showResults}: { showResults: boolean }) => {

    const [searchParams] = useSearchParams();
    const {pathname} = useLocation();

    const currentModelId = searchParams.get('modelId') || ''

    const {
        dispatch: simDispatch,
        simulationState: {selectedSimulation},
    } = useSimulationContext();
    const {
        isMaterialsLibraryOpen
    } = useMaterialPanelContext();
    const {
        dispatch: editorDispatch,
        view3D,
        isLoading,
        editSimulation,
        isInResultsMode,
        resultsView,
    } = useEditorContext();
    const {
        dispatch: modelDispatch,
        addModelFromFile,
        modelInformation,
        isModelLoaded
    } = useModelContext();

    const [createSimulationDialog, setCreateSimulationDialog] = useState<undefined | boolean>(undefined);
    const [createMaterialDialog, setCreateMaterialDialog] = useState<undefined | boolean>(undefined);

    const {
        data: modelSimulations,
        isLoading: isLoadingSimulations
    } = useGetSimulationsByModelId(currentModelId);

    const menuItems = [
        {
            value: 'New Simulation',
            onClick: () => {
                setCreateSimulationDialog(true);
            },
            key: 'new-simulation',
            title: 'New Simulation',
            icon: <ModelTrainingOutlined/>
        },
        {
            value: 'New Material',
            onClick: () => {
                setCreateMaterialDialog(true);
            },
            key: 'new-material',
            title: 'New Material',
            icon: <LayersOutlined/>
        },
    ]

    useGetSimulationFromRouteParam();

    useEffect(() => {
        if (modelSimulations) {
            simDispatch({
                type: SimActionType.SET_MODEL_SIMULATIONS,
                simulations: modelSimulations,
            });
        }
    }, [modelSimulations]);

    // If model has changed, we need to reset everything for the editor.
    useEffect(() => {
        if (pathname === '/editor') {
            editorDispatch({
                type: EdActionType.RESET_STATE,
            });
        }
        modelDispatch({
            type: ModelActionType.SET_CURRENT_MODEL_ID,
            modelId: currentModelId,
        });
    }, [currentModelId]);

    useEffect(() => {
        editorDispatch({
            type: EdActionType.SET_IS_IN_RESULTS_MODE,
            payload: showResults,
        });
    }, [showResults]);


    const {
        data: modelInformationData = null,
        isSuccess: modelInformationSuccess,
        isLoading: modelInformationLoading,
    } = useGetModelInformation(currentModelId);
    const {data: modelFile} = useLoadAndExtractFileFromUrl(modelInformationData?.modelUrl || null, currentModelId);

    useEffect(() => {
        if (modelInformationData) {
            modelDispatch({
                type: ModelActionType.UPDATE_MODEL_INFORMATION,
                modelInformation: modelInformationData,
            });
        }
    }, [modelInformationData]);

    useEffect(() => {
        if (!isModelLoaded && currentModelId && modelFile) {
            addModelFromFile(currentModelId, modelFile);
        }
    }, [isModelLoaded, currentModelId, modelFile]);


    const sidepanelReady = !modelInformationLoading && modelInformationSuccess && currentModelId;

    const handle3DViewChanged = (selectedTab: string) => {
        editorDispatch({
            type: ActionType.SET_3D_VIEW,
            view3D: selectedTab as View3DType,
        });
    };

    return (
        <PageLayout
            isFetching={isLoading}
            extraHeader={
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    {modelInformationData && (
                        <>
                            <Breadcrumbs
                                items={[
                                    {
                                        text: modelInformationData?.projectTag,
                                        link: '/',
                                    },
                                    {
                                        text: modelInformationData?.projectName,
                                        link: `/projects/${modelInformationData?.projectId}`,
                                    },
                                    {
                                        text: modelInformationData?.modelName,
                                    },
                                ]}
                            />

                            <div style={{marginRight: '20px'}}>
                                <Menu disabled={isInResultsMode} ButtonLabel={'Create'} id={'create-new-entity'}
                                      MenuItems={menuItems}/>
                                {createSimulationDialog &&
                                    <CreateSimulation setShowDialog={setCreateSimulationDialog}/>}
                                {createMaterialDialog && <CreateMaterial setShowDialog={setCreateMaterialDialog}/>}
                            </div>
                        </>
                    )}
                </div>
            }

            sidepanel={
                sidepanelReady
                    ? <Sidebar withWelcome={false} toolbar={
                        <Toolbar modelId={currentModelId} isLoading={isLoadingSimulations}/>
                    }/>
                    : <div></div>
            }
            sidepanelExtraHeader={<RecentSimulationNav/>}
        >
            <div className={styles.editor_container}>
                {showResults && <ResultsHeader/>}

                <div className={styles.editor}>

                    {showResults && <ResultsContainer
                        showResults={showResults}
                        modelInformation={modelInformation}
                        selectedSimulation={selectedSimulation}
                    />}

                    <div className={`${styles.viewport_container} 
                        ${resultsView === ResultsView.ResultsReportView ? styles.report_view : ''}`}
                    >
                        <div className={styles.view3d_container}>
                            <Dropdown
                                title={''}
                                options={VIEW3D_OPTIONS}
                                callback={handle3DViewChanged}
                                selectedOption={view3D}
                                setSelectedOption={handle3DViewChanged}
                                withAll={false}
                            />
                        </div>
                        <Viewport/>
                    </div>
                </div>

                {(!isInResultsMode && isMaterialsLibraryOpen) && <MaterialPanel/>}
                {!isInResultsMode && <EditSimulation
                    showDialog={editSimulation.showDialog}
                    updatedSimulation={editSimulation.updatedSimulation}
                />}
            </div>
        </PageLayout>
    );
};
