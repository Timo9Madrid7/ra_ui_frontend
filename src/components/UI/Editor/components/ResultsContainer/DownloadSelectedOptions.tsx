import React, {
    ChangeEvent,
    useEffect,
    useState
} from 'react';
import styles from './styles.module.scss';
import { saveAs } from 'file-saver';
/**
 *
 * Components for downloading excel and csv
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
import toast from 'react-hot-toast';

import { ClearRounded, Done } from '@mui/icons-material';
import axios, { AxiosResponse } from 'axios';
import { SelectParametersOptions } from './SelectParametersOptions';
import { SelectPlotsOptions } from './SelectPlotsOptions';
import { SelectAuralizationOptions } from './SelectAuralizationOptions';

import { useResultsContext } from '../../../Results/context/ResultsContext';
import { file } from 'jszip';

export const DownloadSelectedOptions = ({checkedParam, checkedPlot, checkedAur, isOptions}) => {

    let downloadFileName = 'SimulationResult.zip';
    if (isOptions === 'param') { downloadFileName  = 'ParametersResult.zip'; }
    else if (isOptions === 'plot') { downloadFileName  = 'PlotsResult.zip'; }
    else if (isOptions === 'aur') { downloadFileName  = 'ImpulseResponseResult.zip'; }
    // console.log("====================>>>>>>>>>>>>>>>>>>>>", fileName );

    
    const { availableComparisons } = useResultsContext();
    
    const formatedSimulation = availableComparisons.map((comparison) => {
        return {
            ID : comparison.formState.simulationId,
            // title: comparison.formState.title,
        }     
    })    
    console.log("simulationID:", formatedSimulation);
    const simulationID = formatedSimulation.map(sim => sim.ID);
    // const simulationID = [selectedSimulation.id]


    const handleDownloadFiles= async (e: React.MouseEvent) =>{
       
        e.preventDefault();
             
        const xlsx = ["true"];  
        const selectedOptions = {
            xlsx: xlsx,
            Parameters: checkedParam.length>0 ? checkedParam : [],
            EDC: checkedPlot.length>0 ? checkedPlot: [] ,
            Auralization: checkedAur.length>0 ? checkedAur: [],
            SimulationId: simulationID,
        };
        console.log("Selected Parameters:", selectedOptions);
        
        try{
            const response = await axios.post(`exports/custom_export`, selectedOptions, {responseType: 'blob'});
            downloadFile(response);
                    
        } catch(error: any)
        {
            toast.error('Can not download the result',error);(error.response.data);
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
        saveAs(blob, downloadFileName);
    };

    return (        
            <div>
                <SuccessButton
                    label="Download"
                    type="submit"
                    icon={<Done/>}
                    // disabled={!isFormValid}
                    onClick={(e) => handleDownloadFiles(e)}
                />
            </div>        
    );
};



