/** Context */
import {useSimulationContext} from '@/context/SimulationContext';

/** Types */
import {Source as EditorSource, Receiver as EditorReceiver} from '@/context/EditorContext/types';
import {Source, Receiver} from '@/types';

import {useSaveUpdatedSimulation, useConfirmEdit} from '@/hooks';
import {Simulation} from '@/types';

export const useSaveSourcesAndReceivers = () => {
    const saveSimulation = useSaveUpdatedSimulation();
    const confirmEdit = useConfirmEdit();

    const {
        simulationState: {selectedSimulation},
    } = useSimulationContext();

    const saveSourcesAndReceivers = async (
        sources: EditorSource[],
        receivers: EditorReceiver[],
    ) => {
        return new Promise<Simulation | null>(async (resolve) => {
            const canContinue = await confirmEdit();
            const newSources: Source[] = sources.map((s, index) => ({
                id: s.id,
                label: s.label,
                x: s.x!,
                y: s.y!,
                z: s.z!,
                orderNumber: index,
            }));

            const newReceivers: Receiver[] = receivers.map((r, index) => ({
                ...r,
                x: r.x!,
                y: r.y!,
                z: r.z!,
                orderNumber: index,
            }));

            const updatedSimulation = {
                ...selectedSimulation,
                sources: [...newSources],
                receivers: [...newReceivers],
            };

            if (canContinue) {
                // @ts-ignore TODO: look at the type later...
                saveSimulation(updatedSimulation, 'Source/Receiver updated!');
                resolve(null);
            } else {
                // @ts-ignore
                resolve(updatedSimulation);
            }
        });
    };

    return {saveSourcesAndReceivers};
};
