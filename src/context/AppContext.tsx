import {useReducer, createContext, useContext, ReactNode, useEffect} from 'react';

/** Types */
import {Material} from '@/types';

/** Hooks */
import {useGetMaterials} from '@/hooks';

/** Utils */
import {makeMaterials} from './utils';

import {AppContextActionType} from '@/enums'

type State = {
    filteredMaterials: Material[];
    materialCategories: string[];
};

const initialState: State = {
    filteredMaterials: [],
    materialCategories: [],
};

type AppProviderProps = { children: ReactNode };

type AppContextAction = {
    type: AppContextActionType;
    payload: any;
};

type Dispatch = (action: AppContextAction) => void;

const AppContext = createContext<{ appState: State; dispatch: Dispatch} | undefined>(undefined);

const appReducer = (state: State, action: AppContextAction): State => {
    switch (action.type) {
        case AppContextActionType.SET_MATERIALS: {
            const {filteredMaterials, materialCategories} = makeMaterials(action.payload);
            return {
                ...state,
                filteredMaterials,
                materialCategories,
            };
        }

        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
};

const AppProvider = ({children}: AppProviderProps) => {
    const [appState, dispatch] = useReducer(appReducer, initialState);
    const {data: materials = []} = useGetMaterials();

    const value = {appState, dispatch};



    useEffect(() => {
        if (materials.length > 0) {
            dispatch({
                type: AppContextActionType.SET_MATERIALS,
                payload: materials,
            });
        }
    }, [materials]);

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within AppProvider');
    }
    return context;
};

export {AppProvider, useAppContext};
