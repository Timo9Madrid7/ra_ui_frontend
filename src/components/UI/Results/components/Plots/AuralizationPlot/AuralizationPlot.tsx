import { Avatar, IconButton, List, ListItem, ListItemAvatar, ListItemText, CircularProgress } from "@mui/material";
import classes from "../styles.module.scss";
import axios from '@/client';
import { useLocation } from 'react-router-dom';

/** Components */  
import { useGetAudios, useGetAuralizationStatus } from '@/hooks/Auralization';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import FolderIcon from '@mui/icons-material/Folder';
import { SelectAutoComplete } from "@/components/Base/Select/SelectAutoComplete";
import { AnechoicOption } from "@/types";
import { useEffect, useState } from "react";

export const AuralizationPlot = ({
    value,
    index
}: {
    value: number,
    index: number,
}) => {
    const [selectedAudioOption, setSelectedAudioOption] = useState<AnechoicOption | null>(null);
    const [loadingAuralization, setLoadingAuralization] = useState<boolean>(false);
    const [auralizationStatus, setAuralizationStatus] = useState<string>('');
    const [auralizationId, setAuralizationId] = useState<number>(0);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const simulationId = queryParams.get('simulationId');

    const { data: audioOptions, isLoading: isLoadingAudioOptions, error: audioOptionsError } = useGetAudios();
    useEffect(() => {
        if (audioOptions && !isLoadingAudioOptions && !audioOptionsError) {
            if (audioOptions.length > 0) {
                setSelectedAudioOption(audioOptions[0]);
            }
        }
    }, [audioOptions, isLoadingAudioOptions, audioOptionsError]);

    useEffect(() => {
        if (auralizationStatus === "Completed") {
            setLoadingAuralization(false);
        }
    }, [auralizationStatus]);

    const { data: checkAuralizationResult } = useGetAuralizationStatus(
        auralizationId,
        auralizationStatus !== "" && auralizationStatus !== "Completed" && auralizationId !== 0,
        5000
    );

    useEffect(() => {
        if (checkAuralizationResult) {
            if (checkAuralizationResult.status === "Completed") {
                setAuralizationStatus(checkAuralizationResult.status);
            }
        }
    }, [checkAuralizationResult]);

    if (audioOptionsError) {
        console.log(audioOptionsError);
    }

    const formatedAudioOptions = () => {
        if (audioOptions) {
            return audioOptions.map((audioOption) => {
                return {
                    label: audioOption.name,
                    id: audioOption.id
                };
            });
        } else {
            return [];
        }
    };

    const postAuralization = async ({simulationId, audioOptionId}: {simulationId: string, audioOptionId: number}) => {
        console.log('Post auralization', simulationId, audioOptionId);
        setAuralizationStatus('');
        setLoadingAuralization(true);
        try {
            const response = await axios.post('/auralizations', {
                "audioFileId": audioOptionId,
                "simulationId": simulationId,
            });
            setAuralizationStatus(response.data.status);
            setAuralizationId(response.data.id);
        } catch (error) {
            console.log(error);
        }
    };
    
    return <div className={classes.plot_container} style={{display: value === index ? 'block' : 'none'}}>
        <List>
            <h2 className={classes.plot_header}>Auralization</h2>
            <SelectAutoComplete
                options={formatedAudioOptions()}
                label="Audio Options"
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={( _, value) => {
                    const newSelectedOption = audioOptions?.find((audioOption) => audioOption.id === value?.id);
                    if (newSelectedOption) {
                        setSelectedAudioOption(newSelectedOption);
                    }
                    setAuralizationStatus('');
                    setLoadingAuralization(false);
                    setAuralizationId(0);
                }}
            />
            {
                selectedAudioOption && <ListItem
                    key={selectedAudioOption.id}
                    secondaryAction={
                        !loadingAuralization ? <span>
                            <span>{auralizationStatus}</span>
                            <IconButton edge="end" aria-label="delete"  onClick={() => {
                                if (simulationId && selectedAudioOption.id) {
                                    postAuralization({simulationId: simulationId, audioOptionId: selectedAudioOption.id})
                                }}
                            }>
                                <PlayCircleIcon/>
                            </IconButton>
                        </span> : <div>
                            <span>{auralizationStatus}</span>
                            <CircularProgress size={24} style={{
                                marginLeft: '10px'
                            }}/>
                        </div>
                    }>
                    <ListItemAvatar>
                    <Avatar>
                        <FolderIcon />
                    </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={selectedAudioOption.name}
                    />
                </ListItem>
            }
        </List>
    </div>
}