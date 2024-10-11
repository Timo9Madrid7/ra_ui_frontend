import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';

/** Context */
import {useEditorContext} from '@/context/EditorContext';

/** Components */
import {PrimaryButton} from '@/components';
import InsertChartOutlinedSharpIcon from '@mui/icons-material/InsertChartOutlinedSharp';

/** Types */
import {Simulation, Status} from '@/types';

import '../../styles.scss';

export const ResultsButton = (
    {
        status,
        selectedSimulation,
        originalSimulation,
        userTouched,
    }: {
        status: string | null;
        selectedSimulation: Simulation | null;
        originalSimulation: Simulation | null;
        userTouched: boolean;
    }) => {
    const navigate = useNavigate();

    const { isInResultsMode} = useEditorContext();
    const [showResultButton, setShowResultButton] = useState(false);

    useEffect(() => {
        switch (status) {
            case Status.Completed:
                setShowResultButton(true);
                break;
            default:
                setShowResultButton(false);
        }
    }, [status, userTouched]);

    const toggleResults = () => {
        if (selectedSimulation) {
            if (isInResultsMode) {
                navigate(`/editor?modelId=${selectedSimulation.modelId}&simulationId=${selectedSimulation.id}`);
            } else {
                navigate(`/results?modelId=${selectedSimulation.modelId}&simulationId=${selectedSimulation.id}`);
            }
        }
    };

    return (
        <>
            {showResultButton && (
                <PrimaryButton
                    label={isInResultsMode ? 'Exit Results' : 'Results'}
                    disabled={!isInResultsMode && (userTouched)}
                    className="result-button"
                    icon={<InsertChartOutlinedSharpIcon/>}
                    onClick={toggleResults}>
                </PrimaryButton>
            )}
        </>
    );
};
