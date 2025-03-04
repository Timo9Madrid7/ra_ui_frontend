import React, { Component } from 'react';
import { SuccessButton } from "@/components";
import { useResultsContext } from '../../../Results/context/ResultsContext';
import axios, { AxiosResponse } from 'axios';
import saveAs from 'file-saver';
import { Download } from '@mui/icons-material';

export const DownloadAll = () => {

    

    const parameters = ['edt', 't20', 't30', 'c80', 'd50', 'ts', 'spl_t0_freq' ]
    const plots = ['125Hz', '250Hz', '500Hz', '1000Hz', '2000Hz'] 
    const aur = ['wavIR', 'csvIR']
    const xlsx = ["true"];  
    const { availableComparisons } = useResultsContext();
    const handleDownloadAllFiles= async (e: React.MouseEvent) =>{

        e.preventDefault();

        
    
        const formatedSimulation = availableComparisons.map((comparison) => {
            return {
                ID : comparison.formState.simulationId,
                // title: comparison.formState.title,
            }     
        })    
        const simulationID = formatedSimulation.map(sim => sim.ID);
        const selectedOptions = {
            xlsx: xlsx,
            Parameters: parameters,
            EDC: plots,
            Auralization: aur,
            SimulationId: simulationID,
        };
    
        try{
            const response = await axios.post(`exports/custom_export`, selectedOptions, {responseType: 'blob'});
            downloadFile(response);
                    
        } catch(error: any)
        {
            alert(error);
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
        <div>
            <SuccessButton
                label="Download All"
                type="submit"    
                icon={<Download/>}            
                // disabled={!isFormValid}
                onClick={(e) => handleDownloadAllFiles(e)}
            />
        </div>
    )
  }
