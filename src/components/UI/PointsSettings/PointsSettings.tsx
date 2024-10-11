import {useEffect, useState} from 'react';

/**
 * Components
 * */
import {Sources} from './components/Sources/Sources.tsx';
import {Receivers} from './components/Receivers/Receivers.tsx';
import {Divider} from '@mui/material';

/**
 * Context
 * */
import {useEditorContext} from '@/context/EditorContext';
import {useSimulationContext} from '@/context/SimulationContext';

/**
 * Types and constants
 */
import {SIMULATION_IS_RUNNING} from "@/constants";
import {Status} from "@/types";

/**
 * Styles
 */
import styles from './styles.module.scss';


export const PointsSettings = () => {
  const { sources, receivers, isInResultsMode } = useEditorContext();

  const [isDisabled, setIsDisabled] = useState(false);

  const {
    simulationState: { selectedSimulation },
  } = useSimulationContext();

  useEffect(() => {
    if (isInResultsMode || SIMULATION_IS_RUNNING.includes(selectedSimulation?.status ?? Status.Error)) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [isInResultsMode, selectedSimulation?.status]);

  return (
    <div className={styles.source_receiver_settings}>
      <Sources
        sources={sources}
        isDisabled={isDisabled}
      />

      <Divider />

      <Receivers
        receivers={receivers}
        isDisabled={isDisabled}
      />
    </div>
  );
};
