import ReactAudioPlayer from 'react-audio-player';
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

export const AuralizationPlot = ({
    value,
    index,
}: {
    value: number;
    index: number;
}) => {
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

    return (
        <div style={{display: value === index ? 'block' : 'none', width: "100%"}}>
            {/* <div style={ {  display: "block",
                width: "100%" }}>
                <div style={{                    
                        width: "100%",
                        }}> */}
                    <div className={classes.plot_container}>            
                        <h2 className={classes.plot_header}>Impulse Response</h2>
                        {impulseURL && <ImpulseResponse impulseURL={impulseURL} />}
                        <List>
                            <h2 className={classes.plot_header}>Convolved Sound</h2>
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
                {/* </div> */}
                {/* <div>                    
                    <PrimaryButton 
                            className={classes.bottom_download_btn}
                            label="Download Convolved Audio"                        
                            // icon={<Download/>}
                            onClick={()=>setIsPopupDialogOpen(true)} 
                            />                            

                    {isPopupDialogOpen && <SelectOptionsPopup isPopupDialogOpen={setIsPopupDialogOpen} isOptions = {"aur"}/>}
                      
                </div> */}
            </div>
            
           
        // </div>
    );
};
