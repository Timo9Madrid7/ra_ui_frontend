import { useState } from 'react';

/** Context */
import { ActionType, useEditorContext } from '@/context/EditorContext';

/** Hooks */
import { useSaveSourcesAndReceivers } from './useSaveSourcesAndReceivers';
import { useGetPointValidity } from './useGetPointValidity';

/** Helper functions */
import { generateUUID } from 'three/src/math/MathUtils.js';


/** Types */
import { Receiver, Source, SourceParams, ValidationError } from '@/context/EditorContext/types';
import { Vector3 } from 'three';

/** Utils */
import { isPointCloseToSource } from '../utils';
import {EMPTY_MATERIAL_ID} from "@/constants";

export const useSources = () => {
  const { sources, receivers, selected, taskType, dispatch } = useEditorContext();

  // Contains the id of a point just added. Will be set to undefined as soon as user leaves the label input field
  const [newPointId, setNewPointId] = useState<string>();

  const { saveSourcesAndReceivers } = useSaveSourcesAndReceivers();

  const getPointValidity = useGetPointValidity();

  // Event handler when x,y,z coordinates are changed from inputs
  const handleSourceCoordinateChange = async (sourceIndex: number, x?: number, y?: number, z?: number) => {
    let validationResult: ValidationError | null = null;

    if (x !== undefined && y !== undefined && z !== undefined) {
      validationResult = await getPointValidity(x, y, z, 'SourcePoint', undefined, taskType);
    }

    const newSources: Source[] = [...sources];
    const newSource: Source = {
      ...newSources[sourceIndex],
      x,
      y,
      z,
      isValid: validationResult === null,
      validationError: validationResult || undefined,
    };

    newSources[sourceIndex] = newSource;

    const savedSources = await saveSimulationWithSources(newSources, receivers);
    if (savedSources) {
      dispatch({
        type: ActionType.SET_SOURCES,
        sources: newSources,
      });
    }

    checkIfReceiversAreCloseToSource(newSources, newSource);
  };

  // Event handler when source parameters are changed from inputs
  const handleSourceParamChange = async (
    sourceIndex: number,
    param: 'azimuth' | 'elevation' | 'rotation' | 'overallGain' | 'eq' | 'correctIrByOnAxisSpl' | 'useSplForSti',
    value?: number | number[] | boolean
  ) => {
    const newSources = [...sources];
    const newParams = {
      ...newSources[sourceIndex].params,
      [param]: value,
    };

    newSources[sourceIndex] = {
      ...newSources[sourceIndex],
      params: newParams,
    };

    const savedSources = await saveSimulationWithSources(newSources, receivers);
    if (savedSources) {
      dispatch({
        type: ActionType.SET_SOURCES,
        sources: newSources,
      });
    }
  };

  // Event handler when source label is changed from input
  const handleSourceLabelChange = async (sourceIndex: number, value: string) => {
    const newSources = [...sources];
    const newSource = {
      ...newSources[sourceIndex],
      label: value,
    };
    newSources[sourceIndex] = newSource;

    const savedSources = await saveSimulationWithSources(newSources, receivers);
    if (savedSources) {
      dispatch({
        type: ActionType.SET_SOURCES,
        sources: newSources,
      });
    }

    // As soon as label change is triggered we don't consider this point to be new anymore
    if (newPointId === newSource.id) {
      setNewPointId(undefined);
    }
  };

  // Event handler when source type is changed from input in popup
  const handleSourceTypeChange = async (sourceIndex: number, value: string) => {
    const newSources = [...sources];
    const newParams: SourceParams =
      value !== EMPTY_MATERIAL_ID
        ? {
            ...newSources[sourceIndex].params,
            directivityPattern: value,
            eq: null,
            overallGain: null,
            correctIrByOnAxisSpl: false,
            useSplForSti: false,
          }
        : {
            directivityPattern: value,
            azimuth: 0,
            elevation: 0,
            rotation: 0,
            eq: null,
            overallGain: null,
            correctIrByOnAxisSpl: false,
            useSplForSti: false,
          };

    newSources[sourceIndex] = {
      ...newSources[sourceIndex],
      params: newParams,
    };

    const savedSources = await saveSimulationWithSources(newSources, receivers);
    if (savedSources) {
      dispatch({
        type: ActionType.SET_SOURCES,
        sources: newSources,
      });
    }
  };

  // Adds source to viewport and updates local state
  const handleAddSource = async () => {
    const label = '';
    const x = 2;
    const y = 2;
    const z = 1.5;
    const params: SourceParams = {
      directivityPattern: EMPTY_MATERIAL_ID,
      azimuth: 0,
      elevation: 0,
      rotation: 0,
      eq: null,
      overallGain: null,
      correctIrByOnAxisSpl: false,
      useSplForSti: false,
    };

    const id = generateUUID();

    // There seem to be a lag in creating a source/receiver point which affects the ViewportControl
    // UI in a way that the controls render at a position 0, 0, 0 for a split second
    // and then move to the right position. This is a hack to fix that buggy behaviour
    setTimeout(() => {
      dispatch({
        type: ActionType.SET_SELECTED,
        selected: {
          type: 'SourcePoint',
          id,
        },
      });
    }, 0);

    const validationResult = await getPointValidity(x, y, z, 'SourcePoint', undefined, taskType);

    const newSources = [...sources];
    const newSource: Source = {
      id,
      label,
      x,
      y,
      z,
      params,
      isValid: validationResult === null,
      validationError: validationResult || undefined,
    };

    newSources.push(newSource);
    const savedSources = await saveSimulationWithSources(newSources, receivers);
    if (savedSources) {
      dispatch({
        type: ActionType.SET_SOURCES,
        sources: newSources,
      });
    }

    checkIfReceiversAreCloseToSource(newSources, newSource);
  };

  // Remove from local state and delete point in viewport. Triggers save simulation
  const handleRemoveSource = async (sourceId: string) => {
    const newSources = sources.filter((s) => s.id !== sourceId);
    const savedSources = await saveSimulationWithSources(newSources, receivers);
    if (savedSources) {
      dispatch({
        type: ActionType.SET_SOURCES,
        sources: newSources,
      });
    }
    // Remove selected item in viewport and delete the point
    dispatch({
      type: ActionType.CLEAR_SELECTED,
    });
  };

  // Remove all from local state and delete points in viewport. Triggers save simulation
  const handleRemoveAllSources = async () => {
    const savedSources = await saveSimulationWithSources([], receivers);
    if (savedSources) {
      dispatch({
        type: ActionType.SET_SOURCES,
        sources: [],
      });
    }

    dispatch({
      type: ActionType.CLEAR_SELECTED,
    });
  };

  const saveSimulationWithSources = async (sources: Source[], receivers: Receiver[]) => {
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
        resolve(sources);
      }
    });
  };

  const checkIfReceiversAreCloseToSource = (sources: Source[], thisSource: Source) => {
    const validatedReceivers = [...receivers];

    validatedReceivers.forEach(async (receiver) => {
      // if receiver is valid, then check if it's close to this source
      const position = new Vector3(receiver.x, receiver.y, receiver.z);
      if (receiver.isValid && isPointCloseToSource(position, [thisSource])) {
        receiver.isValid = false;
        receiver.validationError = ValidationError.CloseToSource;
        // if not, and receiver previously had ValidationError.CloseToSource, then check pointValidity() with all sources
      } else if (receiver.validationError === ValidationError.CloseToSource) {
        const validationResult = await getPointValidity(position.x, position.y, position.z, 'ReceiverPoint', sources);
        receiver.isValid = validationResult === null;
        receiver.validationError = validationResult || undefined;
      }
    });

    dispatch({
      type: ActionType.SET_RECEIVERS,
      receivers: validatedReceivers,
    });
  };

  return {
    selectedPointId: selected?.type === 'SourcePoint' ? selected.id : undefined,
    newPointId,
    handleSourceCoordinateChange,
    handleSourceParamChange,
    handleSourceLabelChange,
    handleSourceTypeChange,
    handleAddSource,
    handleRemoveSource,
    saveSourcesAndReceivers,
    handleRemoveAllSources,
  };
};
