import {useAppContext} from '@/context/AppContext';
import {Material, Simulation} from '@/types';
import {cloneDeep} from 'lodash';

const deepCompare = (arg1: any, arg2: any) => {
  if (Object.prototype.toString.call(arg1) === Object.prototype.toString.call(arg2)) {
    if (
      Object.prototype.toString.call(arg1) === '[object Object]' ||
      Object.prototype.toString.call(arg1) === '[object Array]'
    ) {
      if (Object.keys(arg1).length !== Object.keys(arg2).length) {
        return false;
      }
      return Object.keys(arg1).every((key): any => {
        if (typeof arg1[key] === 'string') arg1[key] = arg1[key].toLowerCase();
        if (typeof arg2[key] === 'string') arg2[key] = arg2[key].toLowerCase();

        return deepCompare(arg1[key], arg2[key]);
      });
    }
    return arg1 === arg2;
  }
  return false;
};

// Returns true if the user has made any changes after running a simulation
export const useHasUserTouched = () => {
    const {
        appState: {filteredMaterials},
    } = useAppContext();

    const hasUserTouched = (sim: Simulation) => {
        const runStatus = sim.status;
        const checkSim = cloneDeep(sim);
        const simulationRun = cloneDeep(sim.simulationRun);

        if ((runStatus === 2 || runStatus === 5) && simulationRun) {
            checkSim.sources.forEach((source) => {
                // removing the custom prop only used in the frontend
                // TODO: create a separate Simulation type and UI-specific Simulation type
                // @ts-ignore
                delete source.params;
            });
            checkSim.receivers.forEach((receiver) => {
                // removing the custom prop only used in the frontend
                // TODO: create a separate Simulation type and UI-specific Simulation type
                // @ts-ignore
                delete receiver.validationError;
                // @ts-ignore
                delete receiver.isValid;
            });


            if (
                deepCompare(simulationRun.sources, checkSim.sources) &&
                deepCompare(simulationRun.receivers, checkSim.receivers) &&
                simulationRun.taskType == checkSim.taskType &&
                simulationRun.settingsPreset == checkSim.settingsPreset
            ) {
                // comparing materialIdByObject separately in case we have a
                // deleted material because then we don't want to show the edit/revert mode
                if (
                    deepCompare(
                        simulationRun.LayerIdByMaterialId,
                        checkSim.LayerIdByMaterialId
                    )
                ) {
                    if (
                        !deepCompare(simulationRun.solverSettings, checkSim.solverSettings)
                    ) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    // do not show edit mode if we have deleted material AND all the
                    // other materials are the same as in the last simulation run
                    let doNotShowEditMode = true;
                    Object.keys(checkSim.layerIdByMaterialId || {}).forEach((materialIdByObjectId) => {
                        const currentMaterialId = checkSim?.layerIdByMaterialId[materialIdByObjectId];
                        const oldMaterialId = simulationRun?.layerIdByMaterialId[materialIdByObjectId];
                        if (currentMaterialId !== oldMaterialId) {
                            const oldMaterial = filteredMaterials.find((material: Material) => material.id === oldMaterialId);
                            // if material is not part of filtered materials (is deleted)
                            if (
                                oldMaterial === undefined
                            ) {
                                if (doNotShowEditMode) {
                                    doNotShowEditMode = true;
                                }
                            } else {
                                doNotShowEditMode = false;
                            }
                        } else {
                            return false;
                        }
                    });
                    if (doNotShowEditMode) {
                        // the impulseLengthSeconds changes when we delete a material so we want to
                        // remove that prop from the comparison if we have a deleted material
                        let newSimToCompare = cloneDeep(sim);
                        // @ts-ignore
                        delete newSimToCompare.solverSettings.dgSettings.impulseLengthSeconds;
                        // @ts-ignore
                        delete newSimToCompare.solverSettings.deSettings.impulseLengthSeconds;
                        // @ts-ignore
                        delete newSimToCompare.simulationRun.solverSettings.dgSettings.impulseLengthSeconds;
                        // @ts-ignore
                        delete newSimToCompare.simulationRun.solverSettings.deSettings.impulseLengthSeconds;
                        if (deepCompare(newSimToCompare.solverSettings, newSimToCompare.simulationRun?.solverSettings)) {
                            return false;
                        } else {
                            return true;
                        }
                    } else {
                        return true;
                    }
                }
            } else {
                return true;
            }
        } else {
            // this simulation has no simulationRun so the check
            // for if the use has made changes does not apply
            return false;
        }
    };

    return hasUserTouched;
};
