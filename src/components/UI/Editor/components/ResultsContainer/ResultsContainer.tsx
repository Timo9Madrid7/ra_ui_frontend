import {FC, useEffect, useState} from 'react';

/** Components */
import {
    Dialog,
    ParameterPlot,
    PrimaryButton,
    ResponsePlot
} from '@/components';

import {ResultsComparisonsPanel} from './ResultsComparisonsPanel'
import {DialogContent, Tabs} from '@mui/material';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
/** Hooks */
import InsightsIcon from '@mui/icons-material/Insights';
import styles from './styles.module.scss';
import Tab from "@mui/material/Tab";


import {ModelInformation, Simulation} from "@/types";
import { MusicNote } from '@mui/icons-material';
import { AuralizationPlot } from '@/components/UI/Results/components/Plots/AuralizationPlot/AuralizationPlot';
import { Download, MusicVideo } from '@mui/icons-material';



type ResultsContainerProps = {
    showResults: boolean;
    modelInformation: ModelInformation | null;
    selectedSimulation: Simulation | null;
};

export const ResultsContainer: FC<ResultsContainerProps> = (
    {
        showResults,
        modelInformation,
        selectedSimulation
    }) => {


    const [selectedResultTab, setSelectedResultTab] = useState<number>(0);

    const [active, setActive] = useState(false);
    
    // SBG 
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    // Function to open the pop-up
    const handleOpenPopup = () => {
        setIsPopupOpen(true);
    };

    // Function to close the pop-up (pass to the popup component)
    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    useEffect(() => {
        setActive(true);
    }, []);

    return (
        <div className={`${styles.results_container}  ${active ? styles.active : ''}`}>
            {/* for download button  */}
            <PrimaryButton
                className={styles.download_btn}
                label="Download"
                icon={<Download/>}
                onClick={handleOpenPopup}
            />                      

            {isPopupOpen && <Dialog fullWidth
            maxWidth={'sm'}
            open={true}
            title={'Select your preferences'} onClose={handleClosePopup}/>}

            <Tabs
                value={selectedResultTab}
                variant="fullWidth"
                // @ts-expect-error: we won't use event data
                onChange={(e, value) => setSelectedResultTab(value)}
                aria-label="icon label tabs example"

            >                
                <Tab icon={<BarChartOutlinedIcon/>} label="Parameters"/>
                <Tab icon={<InsightsIcon/>} label="Plots"/>
                <Tab icon={<MusicNote />} label="Auralization"/>
            </Tabs>

            <ParameterPlot
                value={selectedResultTab}
                index={0}
            />

            <ResponsePlot
                value={selectedResultTab}
                index={1}
            />

            <AuralizationPlot
                value={selectedResultTab}
                index={2}
            />

            {showResults && modelInformation && selectedSimulation && (
                <ResultsComparisonsPanel
                    key={selectedSimulation.id}
                    originalModelInformation={modelInformation}
                    selectedSimulation={selectedSimulation}
                />
            )}

        </div>
    );
};
