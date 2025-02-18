import {FC, useEffect, useState} from 'react';

/** Components */
import {
    ParameterPlot,
    PrimaryButton,
    ResponsePlot
} from '@/components';

import {ResultsComparisonsPanel} from './ResultsComparisonsPanel'
import {Tabs} from '@mui/material';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
/** Hooks */
import InsightsIcon from '@mui/icons-material/Insights';
import styles from './styles.module.scss';
import Tab from "@mui/material/Tab";


import {ModelInformation, Simulation} from "@/types";
import { MusicVideo } from '@mui/icons-material';

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


    useEffect(() => {
        setActive(true);
    }, []);

    return (
        <div className={`${styles.results_container}  ${active ? styles.active : ''}`}>
            <PrimaryButton className={styles.download_btn}
                            label="Download"
                            onClick={function(){console.log("hello")}} />
            <Tabs
                value={selectedResultTab}
                variant="fullWidth"
                // @ts-expect-error: we won't use event data
                onChange={(e, value) => setSelectedResultTab(value)}
                aria-label="icon label tabs example"

            >                
                <Tab icon={<BarChartOutlinedIcon/>} label="Parameters"/>
                <Tab icon={<InsightsIcon/>} label="Plots"/>
                <Tab icon={<MusicVideo/>} label="Auralization"/>
            </Tabs>

            <ParameterPlot
                value={selectedResultTab}
                index={0}
            />

            <ResponsePlot
                value={selectedResultTab}
                index={1}
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
