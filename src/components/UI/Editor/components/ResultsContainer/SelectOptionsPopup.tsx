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



import {FREQUENCY_OPTIONS, RESULT_PARAMETERS} from "@/constants";



export const SelectOptionsPopup = ({isPopupDialogOpen}: { isPopupDialogOpen: (show: boolean) => void }) => {

// parameters 
    const [checkedParam, setCheckedParam] = useState<boolean[]>(
        new Array(RESULT_PARAMETERS.length).fill(false)
      );
    const handleParameterParentChange = (event: ChangeEvent<HTMLInputElement>) => {
        setCheckedParam(new Array(RESULT_PARAMETERS.length).fill(event.target.checked));
    };
    const handleParamChildChange = (index: number) => (
        event: ChangeEvent<HTMLInputElement>
        ) => {
        const updatedChecked = [...checkedParam];
        updatedChecked[index] = event.target.checked;
        setCheckedParam(updatedChecked);
    };
    const allCheckedParam = checkedParam.every(Boolean);
    const someCheckedParam = checkedParam.some(Boolean) && !allCheckedParam;

// plots 
    const [checkedPlot, setCheckedPlot] = useState<boolean[]>(
        new Array(FREQUENCY_OPTIONS.length).fill(false)
      );
    const handlePlotParentChange = (event: ChangeEvent<HTMLInputElement>) => {
        setCheckedPlot(new Array(FREQUENCY_OPTIONS.length).fill(event.target.checked));
    };
    const handlePlotChildChange = (index: number) => (
        event: ChangeEvent<HTMLInputElement>
        ) => {
        const updatedChecked = [...checkedPlot];
        updatedChecked[index] = event.target.checked;
        setCheckedPlot(updatedChecked);
    };
    const allCheckedPlot = checkedPlot.every(Boolean);
    const someCheckedPlot = checkedPlot.some(Boolean) && !allCheckedPlot;


//Auralization
    const [checkedAur, setCheckedAur] = useState<boolean[]>([false, false]);
    const handleParentAurChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCheckedAur([event.target.checked, event.target.checked]);
    };
    const handleChildAurChange = (index: number) => (
        event: React.ChangeEvent<HTMLInputElement>
        ) => {
        const updatedChecked = [...checkedAur];
        updatedChecked[index] = event.target.checked;
        setCheckedAur(updatedChecked);
    };

    const allCheckedAur = checkedAur.every(Boolean);
    const someCheckedAur = checkedAur.some(Boolean) && !allCheckedAur;
    // const [frequencies, setFrequencies] = React.useState<string[]>(['125']);
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
                        label="Parameters"                       
                        control={
                        <Checkbox
                            checked={allCheckedParam}
                            indeterminate={someCheckedParam}
                            onChange={handleParameterParentChange}
                        />
                        }
                    />                    
                    <Box>
                        {RESULT_PARAMETERS.map((param, index) => (
                        <FormControlLabel
                            key={param}
                            label={param}
                            control={
                            <Checkbox checked={checkedParam[index]} onChange={handleParamChildChange(index)} />
                            }
                        />
                        ))}
                    </Box>

                    {/* plots  */}
                    <FormControlLabel
                        label="Plots"                       
                        control={
                        <Checkbox
                            checked={allCheckedPlot}
                            indeterminate={someCheckedPlot}
                            onChange={handlePlotParentChange}
                        />
                        }
                    />                    
                    <Box>
                    {FREQUENCY_OPTIONS.map((option, index) => (
                                    <FormControlLabel key={option.value} label={option.label} control={
                                        <Checkbox checked={checkedPlot[index]} onChange={handlePlotChildChange(index)} />
                                        }/>
                                        
                                ))}
                    </Box>      
                    {/* auralization  */}
                    <FormControlLabel
                        label="Auralization"                       
                        control={
                        <Checkbox
                            checked={allCheckedAur}
                            indeterminate={someCheckedAur}
                            onChange={handleParentAurChange}
                        />
                        }
                    />                    
                    <Box>
                        <FormControlLabel
                            label=".WAV"
                            key = "wav"
                            control={<Checkbox checked={checkedAur[0]} onChange={handleChildAurChange("wav")} />}
                        />
                        <FormControlLabel
                            label="Impulse Response"
                            key = "ir"
                            control={<Checkbox checked={checkedAur[1]} onChange={handleChildAurChange("ir")} />}
                        />
                    </Box>
                </DialogContent>
                {/* <DialogActions>
                    <div>
                        <DefaultButton
                            label="Cancel"
                            icon={<ClearRounded/>}
                            onClick={() => isPopupDialogOpen(false)}
                        />
                    </div>
                    <div>
                        <SuccessButton
                            label="Create"
                            type="submit"
                            icon={<Done/>}
                            disabled={!isFormValid}
                            onClick={(e) => handleCreateSimulation(e)}
                        />
                    </div>
                </DialogActions> */}
            </form>
        </Dialog>
    );
};
