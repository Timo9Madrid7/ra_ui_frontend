import {ActionType as SimActionType, useSimulationContext} from '@/context/SimulationContext';
import {Simulation} from '@/types';
import {cloneDeep} from 'lodash';
import {useHasUserTouched} from './useHasUserTouched';
import {useUpdateSimulationAndSettings} from './useUpdatedSimulationAndSettings';
import toast from "react-hot-toast";

let simulationStatetimeout: any;

const delaySaveSimulation = (time: number) => {
    if (simulationStatetimeout) {
        clearTimeout(simulationStatetimeout);
    }
    return new Promise((resolve) => (simulationStatetimeout = setTimeout(resolve, time)));
};

export const useSaveUpdatedSimulation = () => {
    const {dispatch: simDispatch} = useSimulationContext();
    const hasUserTouched = useHasUserTouched();
    const {mutate: updateSimulationAndSettings} = useUpdateSimulationAndSettings();

    const saveSimulation = async (simulation: Simulation | null, message = 'Simulation updated!'): Promise<string> => {
        const newSimulation = cloneDeep(simulation);
        // @ts-ignore
        const userTouched = hasUserTouched(newSimulation);

        try {
            return new Promise<string>(async (resolve) => {
                // There is some re-renderin issue with the SidePanel. This is a hack to fix that buggy behavior
                setTimeout(() => {
                    newSimulation!.hasBeenEdited = userTouched;
                    simDispatch({
                        type: SimActionType.UPDATE_SELECTED_SIMULATION,
                        simulation: newSimulation,
                    });
                }, 0);

                await delaySaveSimulation(1500);

                updateSimulationAndSettings(newSimulation!);
                toast.success(message, {
                    position: 'top-right',
                    style: {
                        borderRadius:'25px'
                    }
                })

                resolve(message);
            });
        } catch (error) {
            throw error;
        }
    };

    return saveSimulation;
};
