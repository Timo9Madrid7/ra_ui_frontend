import {
    Button,
    Checkbox,
    MenuItem,
    SelectChangeEvent,
} from '@mui/material';
import React, {useState} from 'react';
import Plot from 'react-plotly.js';

/** Components */
import {Select} from '@mui/material';

/** Types */
import {ParsedResponseData, PlotType} from './types';

/** Hooks */
import {useResponseData} from './useResponseData';
import {useResponsePlot} from './useResponsePlot';

/** Styles */
import classes from '../styles.module.scss';

/** Constants */
import {FREQUENCY_OPTIONS} from '@/constants';

/** Helper functions */
import {getPlotLayoutConfig} from './utils';
import FormControl from "@mui/material/FormControl";
import {PrimaryButton, useResultsContext} from '@/components';
import {RESULT_RESPONSES} from "@/constants";
import { SelectOptionsPopup } from '@/components/UI/Editor/components/ResultsContainer/SelectOptionsPopup';

// import styles from '../styles.module.scss';

export const ResponsePlot = (
    {
        value,
        index,
    }: {
        value: number,
        index: number,
    }) => {

    const {availableComparisons} = useResultsContext();

    const responseData: ParsedResponseData[] = useResponseData(availableComparisons);

    const [selectedPlotType, setSelectedPlotType] = useState(RESULT_RESPONSES[0]);
    const [frequencies, setFrequencies] = React.useState<string[]>(['125']);

    const responsePlotData = useResponsePlot(responseData, selectedPlotType, frequencies);
    const handleTypeChange = (type: string) => {
        setSelectedPlotType(type as PlotType);

    };

    const handleMultiSelect = (event: SelectChangeEvent<typeof frequencies>) => {
        const {
            target: {value},
        } = event;
        setFrequencies(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    // for download button  
    const [isPopupDialogOpen, setIsPopupDialogOpen] = useState(false);

    // find the resolution of user screen
    const resolutionWidth = window.screen.width * 0.3;
    const resolutionHeight = window.screen.height * 0.4;
    return (
        <div style={{display: value === index ? 'block' : 'none', width: "100%"}}> 
            <div style={{ width: "100%"}}>
               
                <div className={classes.plot_container} >
                    <div>
                        <div className={classes.plot_header}>
                            <span>Select type</span>
                            {selectedPlotType === 'EDC' && (
                                <div className={classes.edc_freq}>
                                    <span>select frequency:</span>
                                    <FormControl sx={{width: 150}} size='small'>
                                        <Select
                                            className={classes.plot_header_select}
                                            size='small'
                                            labelId="multiple-checkbox-label"
                                            id="multiple-checkbox"
                                            multiple
                                            value={frequencies}
                                            onChange={handleMultiSelect}
                                            renderValue={(selected) => selected.join(', ')}
                                            MenuProps={{
                                                anchorOrigin: {
                                                    vertical: 'top',
                                                    horizontal: 'right',
                                                },
                                                transformOrigin: {
                                                    vertical: 'top',
                                                    horizontal: 'left',
                                                },

                                            }}
                                        >
                                            {FREQUENCY_OPTIONS.map((option, index) => (
                                                <MenuItem key={index} value={option.value} className={classes.menu_item}>
                                                    <Checkbox checked={frequencies.indexOf(option.value) > -1}/>
                                                    <span>{option.label}</span>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>
                            )}                
                        </div>
                        <div className={classes.plot_actions}>
                            {RESULT_RESPONSES.map((response) => (
                                <Button
                                    key={response}
                                    variant={'outlined'}
                                    color={response === selectedPlotType ? 'error' : 'secondary'}
                                    onClick={() => handleTypeChange(response)}>
                                    {response}
                                </Button>
                            ))}
                        </div>   
                    </div>
                             
                    <div className={classes.plot} style={{ position: "relative", flex:1, }}>
                        <Plot
                            data={responsePlotData}
                            style = {
                                {width: resolutionWidth,
                                height: resolutionHeight}
                            }
                            config={{
                                modeBarButtonsToRemove: ['resetScale2d'],
                                displaylogo: false,
                                doubleClick: 'autosize',
                                responsive: true,
                            }}
                        
                            useResizeHandler={true}
                            layout={
                                getPlotLayoutConfig(selectedPlotType)}
                        />    
                                                                                                     
                    </div>   
                    <div style={{ display: "flex", flexDirection: "column"}}>
                        <PrimaryButton 
                            style={{
                                position: "absolute",                                                                       
                                alignSelf: "flex-end",                                    
                                border: "1px solid #2e7d32",
                            }}
                                className={classes.bottom_download_btn}
                                label="Download Plots"
                                // icon={<Download/>}
                                onClick={()=>setIsPopupDialogOpen(true)} 
                        /> 
                        {isPopupDialogOpen && <SelectOptionsPopup isPopupDialogOpen={setIsPopupDialogOpen} isOptions = {"plot"}/>} 
                    </div>                            
                </div>                                
            </div>            
        </div>
    );
};
