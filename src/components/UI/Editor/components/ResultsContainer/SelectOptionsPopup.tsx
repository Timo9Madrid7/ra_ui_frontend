import React, {
    ChangeEvent,
    useEffect,
    useState
} from 'react';
import toast from 'react-hot-toast'; 
import {useSearchParams} from 'react-router-dom';
import styles from './styles.module.scss';
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



import {AURALIZATION_OPTIONS, FREQUENCY_OPTIONS, RESULT_PARAMETERS} from "@/constants";
import { CircleOutlined, CircleRounded, ClearRounded, Done } from '@mui/icons-material';



export const SelectOptionsPopup = ({isPopupDialogOpen}: { isPopupDialogOpen: (show: boolean) => void }) => {

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
    const [checkedPlot, setCheckedPlot] = useState<string[]>([]);
    const handlePlotParentChange = (event: ChangeEvent<HTMLInputElement>) => {
        setCheckedPlot(event.target.checked ? FREQUENCY_OPTIONS.map(f => f.value) : []);
    };
    const handlePlotChildChange = (value: string) => (event: ChangeEvent<HTMLInputElement>) => {
        setCheckedPlot(event.target.checked
            ? [...checkedPlot, value]
            : checkedPlot.filter(item => item !== value));
    };
    const allCheckedPlot = checkedPlot.length === FREQUENCY_OPTIONS.length;
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

    //// submit button
    // Disable/Enable Button Logic
    const [isFormValid, setIsFormValid] = useState(false);
    useEffect(() => {
        setIsFormValid(checkedParam.length > 0 || checkedPlot.length > 0 || checkedAur.length > 0);
    }, [checkedParam, checkedPlot, checkedAur]);
    const handleDownloadFiles= async (e: React.MouseEvent) =>{
        e.preventDefault();
        console.log("Selected Parameters:", checkedParam);
        console.log("Selected Plots:", checkedPlot);
        console.log("Selected Auralization:", checkedAur);
    }
/////////////////////////////////////////////////////////////////////////////////////////
    // console.log(styles);
///////////////////////////////////////////////////////////////////////////
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
                                        icon={<CircleOutlined />}
                                        checkedIcon = {<CircleRounded/>}
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
                    {FREQUENCY_OPTIONS.map((option) => (
                                    <FormControlLabel key={option.value} label={option.label} control={
                                        <Checkbox 
                                            icon={<CircleOutlined />}
                                            checkedIcon = {<CircleRounded/>}
                                            checked={checkedPlot.includes(option.value)}
                                            onChange={handlePlotChildChange(option.value)} />
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
                                    icon={<CircleOutlined />}
                                    checkedIcon = {<CircleRounded/>}
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
