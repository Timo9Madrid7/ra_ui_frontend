import {useSimulationContext} from '@/context/SimulationContext';
import {Status} from "@/types";

export const useConfirmEdit = () => {
    const {
        simulationState: {selectedSimulation},
    } = useSimulationContext();

    const confirmEdit = async () => {
        return new Promise<boolean>((resolve) => {
            if (selectedSimulation) {
                const shouldConfirm =
                    selectedSimulation.simulationRunId &&
                    ![
                        Status.Created,
                        Status.Cancelled,
                        Status.Error,
                    ].includes(selectedSimulation.status) &&
                    (!selectedSimulation.hasBeenEdited || selectedSimulation.hasBeenEdited === null);

                if (shouldConfirm) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            }
        });
    };

    return confirmEdit;
};
