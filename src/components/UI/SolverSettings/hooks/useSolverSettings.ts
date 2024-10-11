import { useSimulationContext } from '@/context/SimulationContext';

import { useUpdateSolverSettings } from './useUpdateSolverSettings';

export const useSolverSettings = () => {

  const {
    simulationState: { selectedSimulation },
  } = useSimulationContext();

  const updateSolverSettings = useUpdateSolverSettings();


  const saveImpulseResponseLength = (impulseResponseLength?: number) => {
    if (impulseResponseLength !== undefined && selectedSimulation) {
      let updatedSimulation = {
        ...selectedSimulation,
        solverSettings: {
          ...selectedSimulation.solverSettings,
          deSettings: {
            ...selectedSimulation.solverSettings.deSettings,
            impulseLengthSeconds: impulseResponseLength
              ? impulseResponseLength
              : selectedSimulation.solverSettings.deSettings.impulseLengthSeconds,
          },
          dgSettings: {
            ...selectedSimulation.solverSettings.dgSettings,
            impulseLengthSeconds: impulseResponseLength
              ? impulseResponseLength
              : selectedSimulation.solverSettings.dgSettings.impulseLengthSeconds,
          },
        },
      };
      updateSolverSettings(updatedSimulation);
    }
  };

  const saveEnergyDecayThreshold = (energyDecayThreshold?: number | null) => {
    if (energyDecayThreshold !== undefined && selectedSimulation) {

      let updatedSimulation = {
        ...selectedSimulation,
        solverSettings: {
          ...selectedSimulation.solverSettings,
          deSettings: {
            ...selectedSimulation.solverSettings.deSettings,
            energyDecayThreshold: energyDecayThreshold,
            impulseLengthSeconds: 0,
          },
          dgSettings: {
            ...selectedSimulation.solverSettings.dgSettings,
            energyDecayThreshold: energyDecayThreshold,
            impulseLengthSeconds: 0,
          },
        },
      };
      updateSolverSettings(updatedSimulation);
    }
  };


  const saveTaskType = (taskType: string) => {
    if (selectedSimulation) {
      const newSim = {
        ...selectedSimulation,
        taskType: taskType,
      };
      updateSolverSettings(newSim);
    }
  };

  return {
    saveImpulseResponseLength,
    saveEnergyDecayThreshold,
    saveTaskType,
  };
};
