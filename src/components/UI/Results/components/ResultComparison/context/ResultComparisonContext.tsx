import { useReducer, createContext, useContext, ReactNode, useEffect } from 'react';

/** Types */
import { ResultComparisonState } from '../../../types';

/** Contants */
import { ActionType, initialState } from '../constants';

/** Reducer */
import { ResultComparisonReducer } from './reducer';
import { ResultComparisonAction } from './actions';

type ResultComparisonProviderProps = { children: ReactNode };

type Dispatch = (action: ResultComparisonAction) => void;

const ResultComparisonContext = createContext<
  | {
      state: ResultComparisonState;
      dispatch: Dispatch;
    }
  | undefined
>(undefined);

const ResultComparisonProvider = ({ children }: ResultComparisonProviderProps) => {
  const [state, dispatch] = useReducer(ResultComparisonReducer, initialState);

  const value = { state, dispatch };

  return <ResultComparisonContext.Provider value={value}>{children}</ResultComparisonContext.Provider>;
};

// Custom Context hook to easily access the state and dispatch actions
const useResultComparisonContext = () => {
  const context = useContext(ResultComparisonContext);
  if (context === undefined) {
    throw new Error('useResultComparisonContext must be used within ResultComparisonProvider');
  }
  return context;
};

export { ResultComparisonProvider, useResultComparisonContext };
