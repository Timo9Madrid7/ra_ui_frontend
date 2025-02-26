import React, {
    ChangeEvent,
} from 'react';

import styles from './styles.module.scss';

/**
 *
 * Components
 * */
import {
    Checkbox,
    FormControlLabel,
    Box,
} from "@mui/material";




export const SelectPlotsOptions = ({ checkedPlot, setCheckedPlot }) => {

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


    return (
        <div>
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
        </div>                                                        
    );
};


