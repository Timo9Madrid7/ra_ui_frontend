import ReactAudioPlayer from 'react-audio-player';
import axios from '@/client';
import { useQueryClient } from '@tanstack/react-query';
import {
    Avatar,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    CircularProgress,
} from '@mui/material';
import classes from '../styles.module.scss';
import { useLocation } from 'react-router-dom';


/** Components */
import { SelectAutoComplete } from '@/components/Base/Select/SelectAutoComplete';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import FolderIcon from '@mui/icons-material/Folder';
import { ImpulseResponse } from '@/components/UI/Results/components/ImpulseResponse';
import {
    PrimaryButton,
    useAudioOptions,
    useAuralizationStatus,
    useImpulseResponseAudio,
} from '@/components';
import { useState } from 'react';
import { SelectOptionsPopup } from '@/components/UI/Editor/components/ResultsContainer/SelectOptionsPopup';
import { AnechoicOption } from '@/types';

export const AuralizationPlot = ({
    value,
    index,
}: {
    value: number;
    index: number;
}) => {
    const queryClient = useQueryClient();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const simulationId = queryParams.get('simulationId') || '';

    const {
        audioOptions,
        isLoadingAudioOptions,
        audioOptionsError,
        selectedAudioOption,
        setSelectedAudioOption,
        formatedAudioOptions,
    } = useAudioOptions();

    const {
        auralizationStatus,
        loadingAuralization,
        wavURL,
        postAuralization,
        setAuralizationStatus,
        setLoadingAuralization,
        setAuralizationId,
        setWavURL,
    } = useAuralizationStatus(simulationId, selectedAudioOption);

    const { impulseURL } = useImpulseResponseAudio(simulationId);

    const getCurrentAuralizationAction = () => {
        if (wavURL) {
            return <ReactAudioPlayer autoPlay src={wavURL} controls />;
        }
        return !loadingAuralization ? (
            <span>
                <span>{auralizationStatus}</span>
                <IconButton
                    edge='end'
                    aria-label='delete'
                    onClick={() => {
                        if (simulationId && selectedAudioOption) {
                            postAuralization();
                        }
                    }}
                >
                    <PlayCircleIcon color='primary' />
                </IconButton>
            </span>
        ) : (
            <div>
                <span>{auralizationStatus}</span>
                <CircularProgress
                    size={24}
                    style={{
                        marginLeft: '10px',
                    }}
                />
            </div>
        );
    };

    // for download button  
    const [isPopupDialogOpen, setIsPopupDialogOpen] = useState(false);

    // for upload button
    const [file, setFile] = useState<File | null>(null);
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = event.target.files ? event.target.files[0] : null;
        
        if (!uploadedFile) return;

        setFile(uploadedFile)
        
        const formData = new FormData();
        formData.append("file", uploadedFile);
        formData.append("name", uploadedFile.name.split('.').shift() || '');
        formData.append("description", 'description of the file');
        formData.append("extension", uploadedFile.name.split('.').pop() || '');
        formData.append("simulation_id", simulationId);

        try {
            const response = await axios.post('/auralizations/upload/audiofile', formData, {headers: { "Content-Type": "multipart/form-data" }});
            const result = response.data;

            if (response.status == 200) {
                const newAudioOption = result;
                queryClient.setQueryData(['anechoic'], (oldData: AnechoicOption[] | undefined) => oldData ? [...oldData, newAudioOption] : [newAudioOption]);
                console.log('File uploaded successfully:', result);
            }else{
                throw new Error(`Upload failed: ${response.statusText}`);
            }
        }catch (error) {
        console.error(error);
      }
    };

    return (
        <div style={{display: value === index ? 'block' : 'none', width: "100%"}}>
            <div style={ {  display: "block",
                width: "100%" }}>
                <div style={{                    
                        width: "100%",
                        }}>
                    <div className={classes.plot_container}>            
                        <h2 className={classes.plot_header}>Impulse Response</h2>
                        {impulseURL && <ImpulseResponse impulseURL={impulseURL} />}
                        <List>
                            <h2 className={classes.plot_header}>Convolved Sound</h2>
                            <div style={{ marginLeft: '80%' }}>
                                <input
                                    type="file"
                                    id="file-upload"
                                    style={{ display: 'none' }}
                                    onChange={handleFileUpload}
                                />
                                <label htmlFor="file-upload">
                                    <PrimaryButton
                                        className={classes.bottom_upload_btn}
                                        label="Upload Audio"
                                        onClick={() => document.getElementById('file-upload')?.click()}
                                    />
                                </label>
                            </div>
                            {isLoadingAudioOptions ? (
                                <CircularProgress size={24} />
                            ) : (
                                <SelectAutoComplete
                                    options={formatedAudioOptions()}
                                    label='Audio Options'
                                    isOptionEqualToValue={(option, value) =>
                                        option.id === value.id
                                    }
                                    onChange={(_, value) => {
                                        const newSelectedOption = audioOptions?.find(
                                            (audioOption) => audioOption.id === value?.id
                                        );
                                        if (newSelectedOption) {
                                            setSelectedAudioOption(newSelectedOption);
                                        }
                                        setAuralizationStatus('');
                                        setLoadingAuralization(false);
                                        setAuralizationId(0);
                                        setWavURL(null);
                                    }}
                                />
                            )}
                            {selectedAudioOption && (
                                <ListItem
                                    key={selectedAudioOption.id}
                                    secondaryAction={getCurrentAuralizationAction()}
                                >
                                    <ListItemAvatar>
                                        <Avatar>
                                            <FolderIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={selectedAudioOption.name} />
                                </ListItem>
                            )}
                        </List>
                        
                    </div>
                </div>

                <div>                       
                    <PrimaryButton 
                            className={classes.bottom_download_btn}
                            label="Download Convolved Audio"                        
                            // icon={<Download/>}
                            onClick={()=>setIsPopupDialogOpen(true)} 
                            />                            

                    {isPopupDialogOpen && <SelectOptionsPopup isPopupDialogOpen={setIsPopupDialogOpen} isOptions = {"aur"}/>}      
                </div>
            </div>
              
        </div>
    );
};
