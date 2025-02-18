import { Avatar, IconButton, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import classes from "../styles.module.scss";
import axios from '@/client';
import { useLocation } from 'react-router-dom';

/** Components */  
import { useGetAudios } from '@/hooks/Auralization/useAudioOption';
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
        try {
            const response = await axios.post('/auralizations', {
                "audioFileId": audioOptionId,
                "simulationId": simulationId,
            });
            console.log(response.data)
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
                    console.log(value);
                    const newSelectedOption = audioOptions?.find((audioOption) => audioOption.id === value?.id);
                    if (newSelectedOption) {
                        setSelectedAudioOption(newSelectedOption);
                    }
                }}
            />
            {
                selectedAudioOption && <ListItem
                    key={selectedAudioOption.id}
                    secondaryAction={
                        <IconButton edge="end" aria-label="delete"  onClick={() => {
                            if (simulationId && selectedAudioOption.id) {
                                postAuralization({simulationId: simulationId, audioOptionId: selectedAudioOption.id})
                            }}
                        }>
                            <PlayCircleIcon/>
                        </IconButton>}
                    >
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