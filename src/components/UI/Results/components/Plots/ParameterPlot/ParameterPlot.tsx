import {useEffect, useState} from 'react';
import Plot from 'react-plotly.js';
import {ParsedResponseData} from '../ResponsePlot/types';
import {createPlotlyDataObjects} from './utils';
import classes from "../styles.module.scss";
import {RESULT_PARAMETERS} from "@/constants";
import {Button} from "@mui/material";
import {getParameterYPlotRange, PrimaryButton, useParameterData, useResultsContext} from "@/components";
import {ParameterPlot as ParameterPlotType} from "@/types";
import {
    plotlyDefaultConfig,
    plotlyDefaultLayout,
    plotlyDefaultTitle,
    getParameterYaxisTitle
} from "@/components";
import styles from '../styles.module.scss';
import { SelectOptionsPopup } from '@/components/UI/Editor/components/ResultsContainer/SelectOptionsPopup';

export const ParameterPlot = (
    {
        value,
        index,
    }: {
        value: number,
        index: number,
    }) => {


    const {availableComparisons} = useResultsContext();

    const parameterData: ParameterPlotType[] = useParameterData(availableComparisons);

    const [plotlyData, setPlotlyData] = useState<ParsedResponseData[]>([]);

    const [selectedParameter, setSelectedParameter] = useState(RESULT_PARAMETERS[0]);

    const [yAxisRange, setYAxisRange] = useState<number[]>([]);

    useEffect(() => {
        if (parameterData) {
            const {newPlotlyData} = createPlotlyDataObjects(
                parameterData,
                selectedParameter,
            );

            setPlotlyData(newPlotlyData as ParsedResponseData[]);
        }
    }, [parameterData, selectedParameter]);

    useEffect(() => {
        const yAxisRange = getParameterYPlotRange(selectedParameter, plotlyData);
        setYAxisRange(yAxisRange);
    }, [plotlyData]);


    // for download button  
    const [isPopupDialogOpen, setIsPopupDialogOpen] = useState(false);

     // find the resolution of user screen
     const resolutionWidth = window.screen.width * 0.3;
     const resolutionHeight = window.screen.height * 0.4;

    return (
        <div style={{display: value === index ? 'block' : 'none', width: "100%"}}> 
                <div style={{  width: "100%" }}>
                    <div className={classes.plot_container}>
                        <div>
                            <div className={classes.plot_header}>
                                <>
                                    Select parameter
                                </>
                            </div>
                            <div className={classes.plot_actions}>
                                {RESULT_PARAMETERS.map((parameter) => (
                                    <Button
                                        key={parameter}
                                        variant={'outlined'}
                                        color={parameter === selectedParameter ? 'error' : 'secondary'}
                                        onClick={() => setSelectedParameter(parameter)}>
                                        {parameter}
                                    </Button>
                                ))}
                            </div>
                        </div>
                        
                        <div className={classes.plot}                             
                            style={{
                                flex: 2,                            
                                position: 'relative',
                            }}>
                            <Plot
                                data={plotlyData}
                                config={plotlyDefaultConfig}
                                style={{minWidth: '50%'}}
                                useResizeHandler={true}
                                layout={
                                    {
                                        ...plotlyDefaultLayout,
                                        yaxis: {
                                            ...plotlyDefaultLayout.yaxis,
                                            range: yAxisRange,
                                            title: {
                                                ...plotlyDefaultTitle,
                                                text: getParameterYaxisTitle(selectedParameter),
                                            }
                                        },
                                        width: resolutionWidth,
                                        height: resolutionHeight,
                                    }
                                }
                            />                            
                    </div>      
                    <div style={{ display: "flex", flexDirection: "column"}}>                        
                        <PrimaryButton 
                                style={{
                                    position: "absolute",                                                                       
                                    alignSelf: "flex-end",                                    
                                    border: "1px solid #2e7d32",                                                             
                                }}
                                    className={styles.bottom_download_btn}
                                    label="Download Parameter"
                                    // icon={<Download/>}
                                    onClick={()=>setIsPopupDialogOpen(true)} 
                                    />                                
                        {isPopupDialogOpen && <SelectOptionsPopup isPopupDialogOpen={setIsPopupDialogOpen} isOptions = {"param"}/>}           
                    </div>
                                    
                    </div>                    
                </div>
        </div>        
    );
};
