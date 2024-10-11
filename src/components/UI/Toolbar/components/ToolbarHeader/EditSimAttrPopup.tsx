import React, {useEffect, useState} from 'react';

/** Components */
import {DefaultButton, SuccessButton} from '@/components';
import {Dialog} from "@/components";
import {
    DialogContent,
    DialogActions
} from "@mui/material";
import {EditSimAttrPopupContent} from './EditSimAttrPopupContent';

/** Context */
import {useSimulationContext} from '@/context/SimulationContext';
import {useSaveUpdatedSimulation} from '@/hooks';
import {ClearRounded, Done} from "@mui/icons-material";

const POPUP_TITLE = 'Edit simulation details';

export const EditSimAttrPopup = (
    {
        showPopup,
        setShowPopup,
    }: {
        showPopup: boolean;
        setShowPopup: (setShow: boolean) => void;
    }) => {
    const {
        simulationState: {selectedSimulation},
    } = useSimulationContext();

    const [isFormValid, setIsFormValid] = useState(true);

    // Form values
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const saveSimulation = useSaveUpdatedSimulation();

    useEffect(() => {
        if (selectedSimulation) {
            setName(selectedSimulation.name);
            setDescription(selectedSimulation?.description);
        }
    }, [selectedSimulation]);

    // Form validation
    useEffect(() => {
        if (name.length > 0 && (selectedSimulation?.name !== name || selectedSimulation?.description !== description)) {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
    }, [name, selectedSimulation, description]);

    // Handler for update the simulation
    const saveCurrentSimulation = (e: React.MouseEvent) => {
        e.preventDefault();
        if (selectedSimulation) {
            const updatedSimulation = {...selectedSimulation, name, description};
            saveSimulation(updatedSimulation);
            setShowPopup(false);
        }
    };

    return (
        <>
            {showPopup ? (
                <Dialog
                    fullWidth
                    maxWidth={'xs'}
                    hideBackdrop={false}
                    aria-labelledby={POPUP_TITLE}
                    open={showPopup}
                    title={POPUP_TITLE}
                    onClose={() => setShowPopup(false)}
                >
                    <form>
                        <DialogContent>
                            <EditSimAttrPopupContent
                                name={name}
                                setName={setName}
                                description={description}
                                setDescription={setDescription}
                            />
                        </DialogContent>
                        <DialogActions>
                            <div>
                                <DefaultButton
                                    label="Cancel"
                                    icon={<ClearRounded/>}
                                    onClick={() => setShowPopup(false)}
                                />
                            </div>
                            <div>
                                <SuccessButton
                                    type="submit"
                                    icon={<Done/>}
                                    disabled={!isFormValid}
                                    label="Update simulation"
                                    onClick={saveCurrentSimulation}
                                />
                            </div>
                        </DialogActions>
                    </form>
                </Dialog>
            ) : null}
        </>
    );
};
