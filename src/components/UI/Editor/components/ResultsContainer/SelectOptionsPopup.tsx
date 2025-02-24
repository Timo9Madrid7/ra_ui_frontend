import React, {
    ChangeEvent,
    useEffect,
    useState
} from 'react';
import toast from 'react-hot-toast'; 
import {useSearchParams} from 'react-router-dom';
import styles from './styles.module.scss';
import { saveAs } from 'file-saver';
/**
 *
 * Components
 * */
import {
    Dialog,
    TextArea,
    DefaultButton, SuccessButton
} from "@/components";
import {
    TextField,
    FormControl,
    DialogContent,
    DialogActions,
    Checkbox,
    FormControlLabel,
    Box,
    MenuItem
} from "@mui/material";



import {AURALIZATION_OPTIONS, RESULT_PARAMETERS} from "@/constants";
import { CircleOutlined, CircleRounded, ClearRounded, Done } from '@mui/icons-material';
import axios, { AxiosResponse } from 'axios';


export const SelectOptionsPopup = ({isPopupDialogOpen,selectedSimulation}: { isPopupDialogOpen: (show: boolean) => void, selectedSimulation: any }) => {
    // console.log("simulationID:",  selectedSimulation.id);
// parameters 
    const [checkedParam, setCheckedParam] = useState<string[]>([]);

    const handleParameterParentChange = (event: ChangeEvent<HTMLInputElement>) => {
        setCheckedParam(event.target.checked ? RESULT_PARAMETERS : []);
    };

    const handleParamChildChange = (param: number) => (
        event: ChangeEvent<HTMLInputElement>
        ) => {
            setCheckedParam(event.target.checked
                ? [...checkedParam, param]
                : checkedParam.filter(item => item !== param));
    };

    const allCheckedParam = checkedParam.length === RESULT_PARAMETERS.length;
    const someCheckedParam = checkedParam.length > 0 && !allCheckedParam;

// plots 
    const FREQUENCY_OPTIONS_RESULT = [
        {value: '63', label: '63Hz', disable: true},
        {value: '125', label: '125Hz', disable: false},
        {value: '250', label: '250Hz', disable: false},
        {value: '500', label: '500Hz', disable: false},
        {value: '1000', label: '1000Hz', disable: false},
        {value: '2000', label: '2000Hz', disable: false},
        {value: '4000', label: '4000Hz', disable: true},
        {value: '8000', label: '8000Hz', disable: true},
    ];
    const [checkedPlot, setCheckedPlot] = useState<string[]>([]);

    const handlePlotParentChange = (event: ChangeEvent<HTMLInputElement>) => {
        console.log("hi im here", FREQUENCY_OPTIONS_RESULT.filter(f => !f.disable).map(f=>f.label))
        setCheckedPlot(event.target.checked ? FREQUENCY_OPTIONS_RESULT.filter(f => !f.disable).map(f=>f.label) : []);
    };

    const handlePlotChildChange = (value: string) => (event: ChangeEvent<HTMLInputElement>) => {
        console.log([...checkedPlot, value])
        setCheckedPlot(event.target.checked
            ? [...checkedPlot, value]
            : checkedPlot.filter(item => item !== value));
    };

    // const allCheckedPlot = checkedPlot.length === FREQUENCY_OPTIONS_RESULT.length;
    const enabledPlotOptions = FREQUENCY_OPTIONS_RESULT.filter(f => !f.disable).map(f => f.label);
    const allCheckedPlot = enabledPlotOptions.every(opt => checkedPlot.includes(opt));
    const someCheckedPlot = checkedPlot.length > 0 && !allCheckedPlot;


//Auralization
    const [checkedAur, setCheckedAur] = useState<string[]>([]);

    const handleParentAurChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCheckedAur(event.target.checked ? AURALIZATION_OPTIONS.map(f => f.value) : []);
    };

    const handleChildAurChange = (option: string) => (
        event: React.ChangeEvent<HTMLInputElement>
        ) => {
        setCheckedAur(event.target.checked
            ? [...checkedAur, option]
            : checkedAur.filter(item => item !== option));
    };

    const allCheckedAur = checkedAur.length === AURALIZATION_OPTIONS.length;
    const someCheckedAur = checkedAur.length > 0 && !allCheckedAur;

    //// Download button
    
    const [isFormValid, setIsFormValid] = useState(false); // Disable/Enable Button Logic
    const simulationID = [selectedSimulation.id];
    useEffect(() => {
        setIsFormValid(checkedParam.length > 0 || checkedPlot.length > 0 || checkedAur.length > 0);
    }, [checkedParam, checkedPlot, checkedAur]);

    const handleDownloadFiles= async (e: React.MouseEvent) =>{

        e.preventDefault();

        const selectedOptions = {
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
        // console.log("000000000000=> ", response);
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

                    {/* parameters  */}
                    <FormControlLabel                                   
                        label="Parameters :"                       
                        control={
                        <Checkbox
                            checked={allCheckedParam}
                            indeterminate={someCheckedParam}
                            onChange={handleParameterParentChange}
                        />
                        }
                    />                    
                    <Box className={styles.options_show} >
                        {RESULT_PARAMETERS.map((param) => (
                        <FormControlLabel
                            key={param}
                            label={param}
                            control={
                                <Checkbox
                                        // icon={<CircleOutlined />}
                                        // checkedIcon = {<CircleRounded/>}
                                        checked={checkedParam.includes(param)}
                                        onChange={handleParamChildChange(param)}
                                    />
                            }
                        />
                        ))}
                    </Box>

                    {/* plots  */}
                    <FormControlLabel
                        label="Plots :"                       
                        control={
                        <Checkbox
                            checked={allCheckedPlot}
                            indeterminate={someCheckedPlot}
                            onChange={handlePlotParentChange}
                        />
                        }
                    />                    
                    <Box className={styles.options_show}>
                    {FREQUENCY_OPTIONS_RESULT.map((option) => (
                                    <FormControlLabel key={option.label} label={option.label} control={
                                        <Checkbox 
                                            // icon={<CircleOutlined />}
                                            // checkedIcon = {<CircleRounded/>}
                                            checked={checkedPlot.includes(option.label)}
                                            onChange={handlePlotChildChange(option.label)} disabled={option.disable}/>
                                        }/>                                        
                                ))}
                    </Box>      
                    {/* auralization  */}
                    <FormControlLabel
                        label="Auralization :"                       
                        control={
                        <Checkbox                            
                            checked={allCheckedAur}
                            indeterminate={someCheckedAur}
                            onChange={handleParentAurChange}
                        />
                        }
                    />                    
                    <Box className={styles.options_show}>
                        {AURALIZATION_OPTIONS.map((option) => (
                        <FormControlLabel
                            key={option.value}
                            label={option.label}
                            control={
                                <Checkbox
                                    // icon={<CircleOutlined />}
                                    // checkedIcon = {<CircleRounded/>}
                                    checked={checkedAur.includes(option.value)}
                                    onChange={handleChildAurChange(option.value)}
                            />
                            }
                        />
                        ))}
                    </Box>
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
                            disabled={!isFormValid}
                            onClick={(e) => handleDownloadFiles(e)}
                        />
                    </div>
                </DialogActions>
            </form>
        </Dialog>
    );
};


