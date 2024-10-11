import { useState } from 'react';
import toast from 'react-hot-toast';

/** Context */
import { ActionType, useEditorContext } from '@/context/EditorContext';
import { generateUUID } from 'three/src/math/MathUtils';

/** Hooks */
import { useGetPointValidity } from './useGetPointValidity';
import { useSaveSourcesAndReceivers } from './useSaveSourcesAndReceivers';

/** Types */
import { Receiver, Source, ValidationError } from '@/context/EditorContext/types';

export const useReceivers = () => {
  const { sources, receivers, selected, dispatch } = useEditorContext();

  // Contains the id of a point just added. Will be set to undefined as soon as user leaves the label input field
  const [newPointId, setNewPointId] = useState<string>();

  const { saveSourcesAndReceivers } = useSaveSourcesAndReceivers();

  const getPointValidity = useGetPointValidity();

  // Event handler when x,y,z coordinates are changed from inputs
  const handleReceiverCoordinateChange = async (receiverIndex: number, x?: number, y?: number, z?: number) => {
    let validationResult: ValidationError | null = null;

    if (x !== undefined && y !== undefined && z !== undefined) {
      validationResult = await getPointValidity(x, y, z, 'ReceiverPoint', sources);
      const newReceivers: Receiver[] = [...receivers];
      const newReceiver: Receiver = {
        ...newReceivers[receiverIndex],
        x,
        y,
        z,
        isValid: validationResult === null,
        validationError: validationResult || undefined,
      };

      newReceivers[receiverIndex] = newReceiver;

      const savedReceivers = await saveSimulationWithReceivers(sources, newReceivers);
      if (savedReceivers) {
        dispatch({
          type: ActionType.SET_RECEIVERS,
          receivers: newReceivers,
        });
      }
    }
  };

  // Event handler when receiver label is changed from input
  const handleReceiverLabelChange = async (receiverIndex: number, value: string) => {
    const newReceivers = [...receivers];
    const newReceiver = {
      ...newReceivers[receiverIndex],
      label: value,
    };
    newReceivers[receiverIndex] = newReceiver;

    const savedReceivers = await saveSimulationWithReceivers(sources, newReceivers);
    if (savedReceivers) {
      dispatch({
        type: ActionType.SET_RECEIVERS,
        receivers: newReceivers,
      });
    }

    // As soon as label change is triggered we don't consider this point to be new anymore
    if (newPointId === newReceiver.id) {
      setNewPointId(undefined);
    }
  };

  // Adds reciever to viewport and updates local state
  const handleAddReceiver = async () => {
    const label = '';
    const x = 1;
    const y = 1;
    const z = 1.5;

    const id = generateUUID();

    // There seem to be a lag in creating a source/receiver point which affects the ViewportControl
    // UI in a way that the controls render at a position 0, 0, 0 for a split second
    // and then move to the right position. This is a hack to fix that buggy behaviour
    setTimeout(() => {
      dispatch({
        type: ActionType.SET_SELECTED,
        selected: {
          type: 'ReceiverPoint',
          id,
        },
      });
    }, 0);

    const validationResult = await getPointValidity(x, y, z, 'ReceiverPoint', sources);

    const newReceivers = [...receivers];
    const newReceiver: Receiver = {
      id,
      label,
      x,
      y,
      z,
      isValid: validationResult === null,
      validationError: validationResult || undefined,
    };

    newReceivers.push(newReceiver);
    const savedReceivers = await saveSimulationWithReceivers(sources, newReceivers);
    if (savedReceivers) {
      dispatch({
        type: ActionType.SET_RECEIVERS,
        receivers: newReceivers,
      });
    }
  };

  // Remove from local state and delete point in viewport. Triggers save simulation
  const handleRemoveReceiver = async (receiverId: string) => {
    const newReceivers = receivers.filter((r) => r.id !== receiverId);
    const savedReceivers = await saveSimulationWithReceivers(sources, newReceivers);
    if (savedReceivers) {
      dispatch({
        type: ActionType.SET_RECEIVERS,
        receivers: newReceivers,
      });
    }
    // Remove selected item in viewport and delete the point
    dispatch({
      type: ActionType.CLEAR_SELECTED,
    });
  };

  const handleLoadReceiversFromFile = (file: File, maxReceivers: number) => {
    const reader = new FileReader();

    if (file.type == 'text/csv' || file.type == 'text/plain') reader.readAsText(file);

    reader.onload = async function () {
      let uploadSuccess = true;

      //fileInput.value = ''; // allows same file to be read again
      const fileString = typeof this.result === 'string' ? this.result.replace(/[&\/\\#+()$~%'":*?<>{}\[\]]/g, '') : '';
      const lines = fileString.split('\n');

      try {
        let i = 1;
        const newReceivers = [...receivers];
        for (const line of lines) {
          if (newReceivers.length >= maxReceivers) {
            toast.error('Reached the limit of ' + maxReceivers.toString() + ' Receivers while parsing file');
            break;
          }

          const positions = line && line.split(',');
          if (positions.length != 3) {
            if (positions.length) {
              toast.success(`Line ${i}: ${line} could not be parsed`);
              uploadSuccess = false;
            }
            break;
          } else {
            const x = Number(parseFloat(positions[0]).toFixed(2));
            const y = Number(parseFloat(positions[1]).toFixed(2));
            const z = Number(parseFloat(positions[2]).toFixed(2));
            if (Number.isNaN(x) || Number.isNaN(y) || Number.isNaN(z)) {
              toast.error(`(${positions[0]}, ${positions[1]}, ${positions[2]}) is an invalid coordinate`);
              uploadSuccess = false;
            } else {
              const label = '';

              const id = generateUUID();

              const validationResult = await getPointValidity(x, y, z, 'ReceiverPoint', sources);
              const newReceiver = {
                id,
                label,
                x,
                y,
                z,
                isValid: validationResult === null,
                ValidationError: validationResult || undefined,
              };

              newReceivers.push(newReceiver);
            }
          }
          i++;
        }
        const savedReceivers = await saveSimulationWithReceivers(sources, newReceivers);
        if (savedReceivers) {
          dispatch({
            type: ActionType.SET_RECEIVERS,
            receivers: newReceivers,
          });
        }

        if (uploadSuccess) {
          toast.success('File successfully loaded');
        }
      } catch (error) {
        toast.error('An error occurred while parsing the file!');
      }
    };

    reader.onerror = function () {
      toast.error('An error occurred while reading file content!');
    };
  };

  // Remove all from local state and delete points in viewport. Triggers save simulation
  const handleRemoveAllReceivers = async () => {
    const savedReceivers = await saveSimulationWithReceivers(sources, []);
    if (savedReceivers) {
      dispatch({
        type: ActionType.SET_RECEIVERS,
        receivers: [],
      });
    }

    dispatch({
      type: ActionType.CLEAR_SELECTED,
    });
  };

  const saveSimulationWithReceivers = async (sources: Source[], receivers: Receiver[]) => {
    return new Promise(async (resolve) => {
      const updatedSimulation = await saveSourcesAndReceivers(sources, receivers);
      if (updatedSimulation) {
        dispatch({
          type: ActionType.SHOW_EDIT_MODAL,
          editSimulation: {
            showDialog: true,
            updatedSimulation,
          },
        });
        resolve(null);
      } else {
        resolve(receivers);
      }
    });
  };

  return {
    selectedPointId: selected?.type === 'ReceiverPoint' ? selected.id : undefined,
    newPointId,
    handleReceiverCoordinateChange,
    handleReceiverLabelChange,
    handleAddReceiver,
    handleRemoveReceiver,
    handleRemoveAllReceivers,
    handleLoadReceiversFromFile,
    saveSourcesAndReceivers,
  };
};
