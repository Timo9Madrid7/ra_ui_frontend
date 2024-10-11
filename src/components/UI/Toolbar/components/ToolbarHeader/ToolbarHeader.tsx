import dayjs from "dayjs";

/** Hooks */
import {useEffect, useState} from 'react';
import {useNavigate, useLocation, useSearchParams} from 'react-router-dom';

/** Context */
import {useEditorContext} from '@/context/EditorContext';
import {useSimulationContext} from '@/context/SimulationContext';

/** Components */
import {Tooltip} from '@mui/material';
import {RunSimulationBadge} from './RunSimulationBadge';
import {ActionsMenu, Dropdown, IDropdownOptions} from '@/components';
import {Box, IconButton} from '@mui/material';
import {DeleteSimulationPopup} from './DeleteSimulationPopup';
import {EditSimAttrPopup} from './EditSimAttrPopup';


import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';


/** Types */
import {Action} from '@/types';

import './styles.scss';
import ModelTrainingOutlinedIcon from "@mui/icons-material/ModelTrainingOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import DeleteSweepOutlinedIcon from "@mui/icons-material/DeleteSweepOutlined";
import {SIMULATION_STATUS_1_In_PENDING} from "@/constants";

export const ToolbarHeader = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [simActions, setSimActions] = useState<Action[]>([]);

    const {
        simulationState: {selectedSimulation, availableSimulations, userTouched},
    } = useSimulationContext();


    const {isInResultsMode} = useEditorContext();

    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [showRevertConfirmation, setShowRevertConfirmation] = useState(false);

    const [showEditPopup, setShowEditPopup] = useState(false);
    const [simStatus, setSimStatus] = useState<number>(0);
    const [isDisabled, setIsDisabled] = useState(false);

    useEffect(() => {
        setIsDisabled(false);
        const editSimulationActions: Action[] = [
            {
                value: 'Edit',
                key: 'change-simulation',
                title: 'Edit simulation details',
                icon: <EditNoteOutlinedIcon/>,
                disabled: SIMULATION_STATUS_1_In_PENDING.includes(selectedSimulation?.status),
                onClick: () => {
                    setShowEditPopup(true);
                },
            },
            {
                value: 'Delete',
                key: 'delete-simulations',
                title: 'Delete simulation',
                icon: <DeleteSweepOutlinedIcon/>,
                disabled: SIMULATION_STATUS_1_In_PENDING.includes(selectedSimulation?.status),
                onClick: () => {
                    setShowDeleteConfirmation(true);
                },
            },
        ];
        setSimActions(editSimulationActions);

    }, [selectedSimulation]);

    useEffect(() => {
        setSimStatus(selectedSimulation?.status || 0);
    }, [selectedSimulation?.status]);

    const handleCloseResults = () => {
        navigate(location.pathname.replace('results', 'editor') + location.search);
    };


    const [simulationOptions, setSimulationOptions] = useState<IDropdownOptions[]>([]);
    const [selectedOption, setSelectedOption] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (availableSimulations && availableSimulations.length > 0) {
            const options: IDropdownOptions[] = availableSimulations.map((simulation) => {
                if (simulation.id === selectedSimulation?.id)
                    setSelectedOption(simulation.id)
                return {
                    value: simulation.id || 'none',
                    label: simulation.name || 'None',
                    element: () => (
                        <Box component='div' display={'flex'} flexDirection={'column'} gap={1}>
                            <Box component='div'>
                                {simulation.name}
                            </Box>
                            <Box
                                component='div'
                                color={'darkgray'}
                                fontSize={'smaller'}
                                display={'flex'}
                                flexDirection={'row'}
                                alignItems={'center'}
                                gap={1}
                            >
                                <RunSimulationBadge status={simulation?.status}/>
                                <div>{simulation?.status} in {dayjs(simulation.createdAt).format('MMM DD HH:mm')}</div>
                            </Box>
                        </Box>
                    ),
                };
            });
            setSimulationOptions(options);
        } else {
            setSimulationOptions([])
        }
    }, [availableSimulations, selectedSimulation]);

    const changeSelectedSim = (simulationId: string) => {
        const simulation = availableSimulations.filter(
            (simulation) => simulation.id === simulationId
        );
        setSearchParams({
                modelId: simulation[0].modelId,
                simulationId: simulation[0].id
            }, {replace: true}
        )
    };


    return (
        <div className={`toolbar_header ${isDisabled ? 'disabled' : ''}`}>
            <div className="content">
                {!isInResultsMode && availableSimulations && availableSimulations.length > 0 ? (
                    <>
                        <ModelTrainingOutlinedIcon/>
                        <Dropdown
                            className={'dropdown_custom'}
                            bodyClassName={'dropdown_custom_body'}
                            title={'Simulations'}
                            options={simulationOptions}
                            callback={(e) => changeSelectedSim(e)}
                            selectedOption={selectedOption}
                            setSelectedOption={setSelectedOption}
                            withAll={false}
                        />
                        <RunSimulationBadge status={selectedSimulation?.status}/>
                    </>
                ) : null}
            </div>
            {!isInResultsMode ? (
                availableSimulations && availableSimulations.length > 0 ? (
                    <div className="content">
                        <ActionsMenu
                            actions={simActions}
                            id={selectedSimulation?.id || ''}
                        />
                    </div>
                ) : null
            ) : (
                <IconButton
                    onClick={handleCloseResults}
                    name="Close results">
                    <CloseOutlinedIcon/>
                </IconButton>
            )}
            <DeleteSimulationPopup
                showDeleteConfirmation={showDeleteConfirmation}
                setShowDeleteConfirmation={setShowDeleteConfirmation}
                setIsDisabled={setIsDisabled}
            />
            {showEditPopup && <EditSimAttrPopup showPopup={showEditPopup} setShowPopup={setShowEditPopup}/>}
        </div>
    );
};
