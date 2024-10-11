/** Hooks */
import {useState} from 'react';

/** Context */
import {useSimulationContext} from '@/context/SimulationContext';

/** Components */
import {CreateSimulation, DefaultButton} from '@/components';
import {ToolbarTabs} from './components/ToolbarTabs.tsx';
import {MissingGeo, ToolbarHeader} from './components';
import {Loading} from '@/components';
import image from '@/assets/images/interactive.png'
import {ToolbarFooter} from './components/ToolbarFooter/ToolbarFooter.tsx'

/** Styles */
import './styles.scss';
import {useMeshContext, useModelContext} from "@/context";

type Toolbar = {
    modelId?: string;
    isLoading?: boolean;
};

export const Toolbar = ({modelId, isLoading}: Toolbar) => {
    const {
        simulationState: {availableSimulations},
    } = useSimulationContext();

    const {modelInformation} = useModelContext();
    const {completedMeshTasks} = useMeshContext();

    const [
        showCreateSimulationDialog,
        setShowCreateSimulationDialog
    ] = useState(false);


    return (
        <>
            {availableSimulations && modelId && !isLoading ? (
                (availableSimulations && availableSimulations.length > 0) ? (
                    <>
                        {(modelInformation && !modelInformation.hasGeo) ?
                            <MissingGeo modelId={modelId}/>
                        : ''}
                        <ToolbarHeader/>
                        <ToolbarTabs/>
                        <div className='mesh-info'>
                            {completedMeshTasks && completedMeshTasks.length
                                ? 'The mesh has been generated!'
                                : ('The mesh will be created automatically!')
                            }
                        </div>
                        <ToolbarFooter/>
                    </>
                ) : (
                    <div className="toolbar_info">
                        <h3>You have not created any simulations here yet. Start by adding your first one.</h3>
                        <p>
                            To create a simulation you can always click the
                            <strong> Create</strong> button in top-right corner and choose <strong>New
                            Simulation</strong> option.
                        </p>
                        <p> For your convenience we have made the option available in the following as well. </p>
                        <DefaultButton
                            label="Create a simulation"
                            onClick={() => setShowCreateSimulationDialog(true)}
                        />
                        <img src={image} alt=""/>
                        {showCreateSimulationDialog &&
                            <CreateSimulation setShowDialog={setShowCreateSimulationDialog}/>}
                    </div>
                )
            ) : <Loading/>}
        </>
    );
};
