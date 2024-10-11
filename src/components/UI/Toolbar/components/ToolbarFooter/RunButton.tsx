import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { useEditorContext } from '@/context/EditorContext';
import { useSimulationContext } from '@/context/SimulationContext';

/** Components */
import { DefaultButton } from '@/components';
import { SimulationRunDialog } from '@/components';

/** Types */
import {Simulation, Status} from '@/types';
import { Point, ValidationError } from '@/context/EditorContext/types';

import '../../styles.scss';
import {useModelContext} from "@/context";
import {EMPTY_MATERIAL_ID, SIMULATION_IS_RUNNING} from "@/constants";

export const RunButton = ({ simulation, status }: { simulation: Simulation | null; status: string | null }) => {
  const [buttonTitle, setButtonTitle] = useState('Run the simulation');
  const [showPopup, setShowPopup] = useState(false);
  const { isInResultsMode, sources, receivers } = useEditorContext();
  const {
    simulationState: { userTouched, surfaceLayers },
  } = useSimulationContext();

  const {modelInformation} = useModelContext();

  useEffect(() => {
    switch (status) {
      case Status.Queued:
      case Status.InProgress:
      case Status.ProcessingResults:
        setButtonTitle('Show status');
        break;
      case Status.Completed:
      case Status.Error:
      case Status.Cancelled:
        setButtonTitle('Run again');
        break;
      default:
        setButtonTitle('Run the simulation');
    }
  }, [status]);


  const notInsideModel = (element: Point) => element.validationError === ValidationError.NotInsideModel;
  const insideInnerVolume = (element: Point) => element.validationError === ValidationError.InsideInnerVolume;
  const closeToSurface = (element: Point) => element.validationError === ValidationError.CloseToSurface;
  const closeToSource = (element: Point) => element.validationError === ValidationError.CloseToSource;

  const handleRunButtonClick = () => {
    if (simulation?.layerIdByMaterialId) {
      if (status != Status.Created) {
        setShowPopup(true);
        return;
      }
      let hasMissingMaterial = surfaceLayers.flatMap((x) => x.children).some((layer) => layer.isMissingMaterial);

      const layerLength = Object.keys(surfaceLayers.flatMap((layer) => layer.children)).length;
      const assignedMaterialsLength = Object.keys(simulation.layerIdByMaterialId).length;
      if (hasMissingMaterial) {
        toast.error(
          'You have a material assigned that has been deleted or is no longer shared with you. Assign a new material to run a simulation.',
          { className: 'editor-toast' }
        );
        return;
      } else if(!modelInformation?.hasGeo){
          toast.error("There is no geo file assigned to the model, Upload your .geo file");
          return;
      }
      else if (
        layerLength !== assignedMaterialsLength ||
        Object.values(simulation.layerIdByMaterialId).indexOf(EMPTY_MATERIAL_ID) > -1
      ) {
        toast.error("Some of the layers don't have the material assigned!");
        return;
      } else if (simulation.sources.length < 1 && simulation.receivers.length < 1) {
        toast.error('Sources and receivers information are missing!');
        return;
      } else if (simulation.receivers.length < 1) {
        toast.error('There must be at least one receiver!');
        return;
      } else if (simulation.sources.length < 1) {
        toast.error('There must be at least one source!');
        return;
      } else if (sources.some(notInsideModel) || receivers.some(notInsideModel)) {
        toast.error('Either sources or receivers are not within the model!');
        return;
      } else if (sources.some(insideInnerVolume) || receivers.some(insideInnerVolume)) {
        toast.error('Check that your sources and receivers are not inside an internal closed volume', {
          className: 'editor-toast',
        });
        return;
      } else if (sources.some(closeToSurface) || receivers.some(closeToSurface)) {
        toast.error('Check that your sources and receivers are not too close to a surface', {
          className: 'editor-toast',
        });
        return;
      } else if (receivers.some(closeToSource)) {
        toast.error('Check that your receivers are not too close to a source', { className: 'editor-toast' });
        return;
      }
      else {

        setShowPopup(true);

      }
    }
  };

  useEffect(() => {
    // if toast is clicked that redirects you to Results, then close the Simulation Run popoup
    if (isInResultsMode && showPopup) {
      setShowPopup(false);
    }
  }, [isInResultsMode]);

  return (
    <>
      {simulation && status !== null ? (
        <DefaultButton
          id="run-simulation-btn"
          label={buttonTitle}
          onClick={handleRunButtonClick}
          sx={{width:"fit-content"}}
        />
      ) : null}
      {showPopup && simulation && (
        <>
          <SimulationRunDialog
            selectedSimulation={simulation}
            onClose={() => setShowPopup(false)}
            activeSimulationRun={
            SIMULATION_IS_RUNNING.includes(status) && simulation.simulationRun ? simulation.simulationRun : null}
          />
        </>
      )}
    </>
  );
};
