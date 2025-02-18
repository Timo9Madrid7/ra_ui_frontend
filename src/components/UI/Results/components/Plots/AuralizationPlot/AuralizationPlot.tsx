import { Avatar, IconButton, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import classes from "../styles.module.scss";
import axios from '@/client';
import { useLocation } from 'react-router-dom';

/** Components */  
import { useGetAudios } from '@/hooks/Auralization/useAudioOption';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import FolderIcon from '@mui/icons-material/Folder';

export const AuralizationPlot = ({
    value,
    index
}: {
    value: number,
    index: number,
}) => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const simulationId = queryParams.get('simulationId');

    const { data: audioOptions, isLoading: isLoadingAudioOptions } = useGetAudios();
    const postAuralization = async ({simulationId, audioOptionId}: {simulationId: string, audioOptionId: number}) => {
        console.log('Post auralization', simulationId, audioOptionId)
        try {
            const response = await axios.post('/auralizations', {
                // "createdAt": "string",
                "audioFileId": 1,
                "simulationId": 1,
                // "id": 0,
                // "status": "Uncreated",
                // "updatedAt": "string"
            });
            console.log(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    return <div className={classes.plot_container} style={{display: value === index ? 'block' : 'none'}}>
        <List>
            <h2>Auralization</h2>
            {
                !isLoadingAudioOptions && audioOptions && audioOptions.map((audioOption) => {
                    return <ListItem
                        key={audioOption.id}
                        secondaryAction={
                            <IconButton edge="end" aria-label="delete"  onClick={() => {
                                if (simulationId && audioOption.id) {
                                    postAuralization({simulationId: simulationId, audioOptionId: audioOption.id})
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
                            primary={audioOption.name}
                        />
                    </ListItem>
                })
            }
        </List>
        
    </div>
}