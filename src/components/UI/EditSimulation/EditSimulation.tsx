import {useEffect, useState} from 'react';

import {Simulation} from '@/types';
import {useEditorContext, ActionType, ActionType as EditorActionType} from '@/context/EditorContext';
import {ActionType as SimulationActionType, useSimulationContext} from "@/context/SimulationContext.tsx";
import {
    ConfirmationDialog,
} from "@/components";

import {
    useDuplicateSimulation,
} from '@/hooks'

import {
    ActionType as LibActionType,
    useMaterialPanelContext
} from '@/components/UI/MaterialPanel/MaterialPanelContext.tsx'
import {
    BlockOutlined,
    ContentCopyOutlined,
    ReportProblemOutlined
} from "@mui/icons-material";
import {useSearchParams} from 'react-router-dom';
import classes from './classes.module.scss'
import {Divider} from "@mui/material";

/**
 *
 * Hooks
 * */
import {useCreateSimulation} from "@/hooks";
import toast from "react-hot-toast";

export const EditSimulation = (
    {
        showDialog,
        updatedSimulation,
    }: {
        showDialog: boolean;
        updatedSimulation: Simulation | null;
    }) => {
    const {dispatch} = useEditorContext();

    useEffect(() => {
        SetConfirmationDialog(showDialog);
    }, [showDialog]);

    const [confirmationDialog, SetConfirmationDialog] = useState(showDialog);

    const {
        simulationState: {selectedSimulation, availableSimulations},
        dispatch: simulationDispatch
    } = useSimulationContext();

    const duplicateSimulation = useDuplicateSimulation();
    const {mutate: createSimulation} = useCreateSimulation();
    const [, setSearchParams] = useSearchParams();

    const closeDialog = () => {
        SetConfirmationDialog(false);
        dispatch({
            type: ActionType.SHOW_EDIT_MODAL,
            editSimulation: {showDialog: false, updatedSimulation: null},
        });
    };
    const {dispatch: libDispatch, isMaterialsLibraryOpen} = useMaterialPanelContext();


    return (
        <>
            {confirmationDialog && (
                <ConfirmationDialog
                    title="Edit this simulation?"
                    confirmLabel="Duplicate"
                    message={() => (
                        <div>
                            <div className={classes.confirmation_container}>
                                <ReportProblemOutlined fontSize={'large'} color={'error'}/>
                                <p>
                                    There is already a <strong>result</strong> available for the simulation:
                                    <strong> {selectedSimulation?.name}</strong>. If you run the simulation again, your
                                    previous
                                    results will become <strong>unavailable</strong>.
                                </p>
                            </div>
                            <Divider/>
                            <div className={classes.suggestions}>
                                You have two choices available:
                                <div className={classes.list}>
                                    <div className={classes.list_item}>
                                        <BlockOutlined/>
                                        <span>Ignore the edit to maintain consistency. Press
                                            the <span className={classes.highlight}> Cancel button</span> or close this dialog.</span>
                                    </div>
                                    <div className={classes.list_item}>
                                        <ContentCopyOutlined/>
                                        <span>Duplicate the current simulation settings into
                                        a new one to keep the settings without the results.
                                        Press the <span className={classes.highlight}>Duplicate button</span>.
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className={classes.note}>
                                Note: If you would like to edit and change the simulation variables,
                                you have to decide one the mentioned options. However, if you do nothing,
                                the result would still be available for you.
                            </div>
                        </div>
                    )}
                    onConfirm={async () => {
                        // duplicate the current simulation
                        const duplicatedSimulation = await duplicateSimulation(updatedSimulation);

                        if (duplicatedSimulation && availableSimulations) {
                            const simulationObject = {
                                ...duplicatedSimulation,
                                name: `${duplicatedSimulation.name} - Copy`,
                            };

                            createSimulation(simulationObject, {
                                onSuccess: (newSimulation: Simulation) => {
                                    if (newSimulation) {
                                        simulationDispatch({
                                            type: SimulationActionType.SET_MODEL_SIMULATIONS,
                                            simulations: [...availableSimulations, newSimulation],
                                        });

                                        setTimeout(() => {
                                            setSearchParams({
                                                modelId: newSimulation.modelId,
                                                simulationId: newSimulation.id
                                            }, {replace: true});
                                        });

                                        toast.success(`New simulation ' ${newSimulation.name}' ' created!`);
                                        dispatch({
                                            type: EditorActionType.CLEAR_SELECTED,
                                        });

                                        if (isMaterialsLibraryOpen) {
                                            libDispatch({
                                                type: LibActionType.CLOSE_MATERIALS_PANEL,
                                            });
                                        }
                                        setTimeout(() => {
                                            simulationDispatch({
                                                type: SimulationActionType.UPDATE_SELECTED_SIMULATION,
                                                simulation: newSimulation,
                                            });
                                        });
                                    }
                                },
                                onError: () => toast.error('Error creating Simulation!')
                            });

                            closeDialog();
                        }
                    }}
                    onCancel={() => closeDialog()}
                />
            )}
        </>
    );
};
