import React, {
    useEffect,
    useState
} from 'react';
import toast from 'react-hot-toast';
import {useSearchParams} from 'react-router-dom';

/**
 *
 * Components
 * */
import {
    Dialog,
    TextArea,
    DefaultButton, SuccessButton
} from "@/components";
import {
    TextField,
    FormControl,
    DialogContent,
    DialogActions
} from "@mui/material";

/**
 *
 * Hooks
 * */
import {useCreateSimulation} from "@/hooks";


/**
 * Context */
import {useSimulationContext, ActionType} from '@/context/SimulationContext';
import {useModelContext} from "@/context";

import {Simulation} from "@/types";
import {EMPTY_SIMULATION} from "@/constants";

/**
 * Assets
 * */
import {ClearRounded, Done} from "@mui/icons-material";


export const CreateSimulation = ({setShowDialog}: { setShowDialog: (show: boolean) => void }) => {
    const {
        simulationState: {availableSimulations},
        dispatch,
    } = useSimulationContext();

    const [, setSearchParams] = useSearchParams();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const [isFormValid, setIsFormValid] = useState(false);

    const {modelInformation} = useModelContext();
    const {mutate: createSimulation} = useCreateSimulation();

    const simulationObject = {
        ...EMPTY_SIMULATION,
        name: name,
        modelId: modelInformation?.id || '',
        description: description,
    };

    /**
     * Form validation for creating a new simulation
     *  - name is required, and it should be at least one character
     *  - description is optional
     *
     */
    useEffect(() => {
        (name && name.length > 0)
            ? setIsFormValid(true)
            : setIsFormValid(false);

    }, [name]);

    /**
     * Handler: create a new simulation
     * Submit the form and set search params
     *
     * @param {React.MouseEvent} e The submit event
     */
    const handleCreateSimulation = async (e: React.MouseEvent) => {
        e.preventDefault();

        createSimulation(simulationObject, {
            onSuccess: (newSimulation: Simulation) => {
                if (newSimulation) {
                    dispatch({
                        type: ActionType.SET_MODEL_SIMULATIONS,
                        simulations: [...availableSimulations, newSimulation],
                    });

                    setTimeout(() => {
                        setSearchParams({
                            modelId: newSimulation.modelId,
                            simulationId: newSimulation.id
                        }, {replace: true});
                    });

                    toast.success(`New simulation ' ${newSimulation.name}' ' created!`);
                }
                setShowDialog(false);
            },
            onError: () => toast.error('Error creating Simulation!')
        });
    };

    return (
        <Dialog
            open={true}
            hideBackdrop={false}
            title={'Create new Simulation'}
            onClose={() => setShowDialog(false)}
        >
            <form>
                <DialogContent>
                    <FormControl>
                        <TextField
                            autoFocus
                            value={name}
                            autoComplete="off"
                            variant="outlined"
                            color={'secondary'}
                            label="Simulation Name"
                            placeholder={'Enter the simulation new'}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </FormControl>
                    <FormControl>
                        <TextArea
                            value={description}
                            onChange={setDescription}
                            placeholder="Enter the simulation description..."
                        />
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <div>
                        <DefaultButton
                            label="Cancel"
                            icon={<ClearRounded/>}
                            onClick={() => setShowDialog(false)}
                        />
                    </div>
                    <div>
                        <SuccessButton
                            label="Create"
                            type="submit"
                            icon={<Done/>}
                            disabled={!isFormValid}
                            onClick={(e) => handleCreateSimulation(e)}
                        />
                    </div>
                </DialogActions>
            </form>
        </Dialog>
    );
};
