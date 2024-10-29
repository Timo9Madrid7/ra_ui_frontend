/** Hooks */
import axios from '@/client';
import {SimulationRunStatus, Status} from '@/types';
import {useQuery} from '@tanstack/react-query';
import {getSimulationById} from "@/hooks/useGetSimulationById.ts";
import {ActionType, useSimulationContext} from "@/context/SimulationContext";

let refetchInterval = 0;

const isInProgress = (status: string | null) => {
    if (status === Status.Queued || status === Status.InProgress || status === Status.Created || status === Status.ProcessingResults) {
        return true;
    }
    return false;
};

const getSimulationRunStatuses = async (maxNumberOfResults = 6) => {
    const {data} = await axios.get<SimulationRunStatus[]>(`/simulations/run`);

    return data;
};


export const useGetSimulationRunStatuses = (maxNumberOfResults?: number, enabled = true) => {
    const {dispatch} = useSimulationContext();
    return useQuery([], () => getSimulationRunStatuses(maxNumberOfResults), {
        enabled,
        refetchOnWindowFocus: false,
        refetchInterval,
        onSuccess: (data) => {
            let inProgress = false;

            for (const sim of data) {
                inProgress = isInProgress(sim.status);
                if (inProgress) {
                    // Dynamically fetch the simulation object using its ID
                    getSimulationById(sim.simulation.id)
                        .then((simulationObj) => {
                            dispatch({
                                type: ActionType.UPDATE_AVAILABLE_SIMULATIONS,
                                simulation: simulationObj
                            })
                            dispatch({
                                type: ActionType.SET_LAST_SIMULATION_RUN,
                                simulationRun: sim,
                            });

                        })
                }
                if (inProgress) break
            }

            if (inProgress) {
                refetchInterval = 500;
            } else {
                refetchInterval = 0;
            }
        },
    });
}
