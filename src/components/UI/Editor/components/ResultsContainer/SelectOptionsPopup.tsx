import React, {
    ChangeEvent,
    useEffect,
    useState
} from 'react';
import styles from './styles.module.scss';
import { saveAs } from 'file-saver';
/**
 *
 * Components
 * */
import {
    Dialog,
    DefaultButton, SuccessButton
} from "@/components";
import {
    DialogContent,
    DialogActions,
    Tooltip,
    IconButton,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

import { ClearRounded, Done } from '@mui/icons-material';
import axios, { AxiosResponse } from 'axios';
import { SelectParametersOptions } from './SelectParametersOptions';
import { SelectPlotsOptions } from './SelectPlotsOptions';
import { SelectAuralizationOptions } from './SelectAuralizationOptions';

import { useResultsContext } from '../../../Results/context/ResultsContext';

export const SelectOptionsPopup = ({isPopupDialogOpen,selectedSimulation}: { isPopupDialogOpen: (show: boolean) => void, selectedSimulation: any }) => {
    
    const { availableComparisons } = useResultsContext();
// parameters 
    const [checkedParam, setCheckedParam] = useState<string[]>([]);

// plots 
    const [checkedPlot, setCheckedPlot] = useState<string[]>([]);

//Auralization
    const [checkedAur, setCheckedAur] = useState<string[]>([]);

//// Download button    
    const [isFormValid, setIsFormValid] = useState(false); // Disable/Enable Button Logic
    const simulationID = [selectedSimulation.id];
    useEffect(() => {
        setIsFormValid(checkedParam.length > 0 || checkedPlot.length > 0 || checkedAur.length > 0);
    }, [checkedParam, checkedPlot, checkedAur]);

    const handleDownloadFiles= async (e: React.MouseEvent) =>{

        e.preventDefault();

        const selectedOptions = {
            // All: "",
            Parameters: checkedParam, // Example: ["Option1", "Option2"]
            EDC: checkedPlot, // Example: ["80Hz", "125Hz"]
            Auralization: checkedAur, // Example: ["OptionA", "OptionB"]
            SimulationId: simulationID,
        };
        console.log("Selected Parameters:", selectedOptions);
        
        try{
 
            const response = await axios.post(`exports/custom_export`, selectedOptions, {responseType: 'blob'});
            downloadFile(response);
                    
        } catch(error: any)
        {
            if (error.response) {                
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {               
                console.log(error.request);
            } else {                
                console.log('Error', error.message);
            }          
        }
    }
    const downloadFile = (response:AxiosResponse) => {
        const blob = new Blob([response.data], { type: 'application/zip' });
        saveAs(blob, 'SimulationResult.zip');
    };

    return (
        <Dialog
            open={true}
            hideBackdrop={false}
            title={'Select your preferences'}
            onClose={() => isPopupDialogOpen(false)}
        >
            <form>
                <DialogContent>     
                    {/* <h1>Available Comparisons</h1>
                    <ul>
                        {availableComparisons.map((comparison, index) => (
                            <li key={index}>
                                {comparison.formState?.title} - {comparison.color}
                            </li>
                        ))}
                    </ul> */}
                    <Tooltip title="If you don't choose any options then an Excel file with all the values will download. But if you select some options then it will also download the CSV's" className={styles.info_btn}>
                        <IconButton color="primary">
                            <InfoIcon />
                        </IconButton>
                    </Tooltip>
                    <SelectParametersOptions checkedParam={checkedParam} 
                        setCheckedParam={setCheckedParam} />

                    <SelectPlotsOptions checkedPlot={checkedPlot} 
                        setCheckedPlot={setCheckedPlot} />
                        
                    <SelectAuralizationOptions checkedAur = {checkedAur}
                        setCheckedAur = {setCheckedAur}/> 

                </DialogContent>
                <DialogActions>
                    <div>
                        <DefaultButton
                            label="Cancel"
                            icon={<ClearRounded/>}
                            onClick={() => isPopupDialogOpen(false)}
                        />
                    </div>
                    <div>
                        <SuccessButton
                            label="Download"
                            type="submit"
                            icon={<Done/>}
                            // disabled={!isFormValid}
                            onClick={(e) => handleDownloadFiles(e)}
                        />
                    </div>
                </DialogActions>
            </form>
        </Dialog>
    );
};



