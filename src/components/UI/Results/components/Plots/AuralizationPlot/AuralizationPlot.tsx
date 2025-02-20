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
import axios from '@/client';
import { useLocation } from 'react-router-dom';

/** Components */
import { useGetAudios, useGetAuralizationStatus, useGetImpulseResponseAudio } from '@/hooks/Auralization';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import FolderIcon from '@mui/icons-material/Folder';
import { SelectAutoComplete } from '@/components/Base/Select/SelectAutoComplete';
import { AnechoicOption } from '@/types';
import { useEffect, useState } from 'react';

export const AuralizationPlot = ({
    value,
    index,
}: {
    value: number;
    index: number;
}) => {
    const [selectedAudioOption, setSelectedAudioOption] =
        useState<AnechoicOption | null>(null);
    const [loadingAuralization, setLoadingAuralization] =
        useState<boolean>(false);
    const [auralizationStatus, setAuralizationStatus] = useState<string>('');
    const [auralizationId, setAuralizationId] = useState<number>(0);
    const [wavURL, setWavURL] = useState<string | null>(null);
    const [impulseURL, setImpulseURL] = useState<string | null>(null);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const simulationId = queryParams.get('simulationId') || "";

    const {
        data: audioOptions,
        isLoading: isLoadingAudioOptions,
        error: audioOptionsError,
    } = useGetAudios();

    const {
        data: impulseResponseAudio,
        isLoading: isLoadingimpulseResponseAudio,
        error: impulseResponseAudioError,
    } = useGetImpulseResponseAudio(simulationId);

    useEffect(() => {
        if(!isLoadingimpulseResponseAudio && impulseResponseAudio){
            const blob = new Blob([impulseResponseAudio], {
                type: 'audio/x-wav',
            });
            const url = window.URL.createObjectURL(blob);
            setImpulseURL(url);
        }
    },[isLoadingimpulseResponseAudio]);
    
    // this useEffect is used to set the selectedAudioOption to the first element of the audioOptions array
    useEffect(() => {
        if (audioOptions && !isLoadingAudioOptions && !audioOptionsError) {
            if (audioOptions.length > 0) {
                setSelectedAudioOption(audioOptions[0]);
            }
        }
    }, [audioOptions, isLoadingAudioOptions, audioOptionsError]);

    // this useEffect is used to set the loadingAuralization to false when the auralization status is
    // completed
    useEffect(() => {
        if (auralizationStatus === 'Completed') {
            setLoadingAuralization(false);
        }
    }, [auralizationStatus]);

    const { data: checkAuralizationResult } = useGetAuralizationStatus(
        auralizationId,
        auralizationStatus !== '' &&
            auralizationStatus !== 'Error' &&
            auralizationStatus !== 'Completed' &&
            auralizationId !== 0,
        5000
    );

    // this useEffect is used to update the auralization status when the checkAuralizationResult changes
    useEffect(() => {
        if (checkAuralizationResult) {
            if (checkAuralizationResult.status) {
                setAuralizationStatus(checkAuralizationResult.status);
                if (checkAuralizationResult.status === 'Error') {
                    setLoadingAuralization(false);
                }
            }
        }
    }, [checkAuralizationResult]);

    // this useEffect is used to get the wav file when the auralization status is completed
    useEffect(() => {
        if (auralizationStatus === 'Completed' && auralizationId !== 0) {
            getAuralizationWav();
        }
    }, [auralizationStatus, auralizationId]);

    // this function formats the audioOptions to be used in the SelectAutoComplete component
    const formatedAudioOptions = () => {
        if (audioOptions) {
            return audioOptions.map((audioOption) => {
                return {
                    label: audioOption.name,
                    id: audioOption.id,
                };
            });
        } else {
            return [];
        }
    };

    const postAuralization = async ({
        simulationId,
        audioOptionId,
    }: {
        simulationId: string;
        audioOptionId: number;
    }) => {
        setAuralizationStatus('');
        setLoadingAuralization(true);
        try {
            const response = await axios.post('/auralizations', {
                audioFileId: audioOptionId,
                simulationId: simulationId,
            });
            setAuralizationStatus(response.data.status);
            setAuralizationId(response.data.id);
        } catch (error) {
            console.log(error);
        }
    };

    const getAuralizationWav = async () => {
        try {
            const response = await axios.get(
                `/auralizations/${auralizationId}/wav`,
                {
                    responseType: 'arraybuffer',
                }
            );
            const blob = new Blob([response.data], {
                type: response.headers['content-type'],
            });
            const url = window.URL.createObjectURL(blob);
            setWavURL(url);
        } catch (error) {
            console.log(error);
        }
    };

    // this function determine which component should be rendered based on the current auralization status and the wavURL
    const getCurrentAuralizationAction = () => {
        if (wavURL) {
            return <ReactAudioPlayer src={wavURL} controls />;
        }
        return !loadingAuralization ? (
            <span>
                <span>{auralizationStatus}</span>
                <IconButton
                    edge='end'
                    aria-label='delete'
                    onClick={() => {
                        if (simulationId && selectedAudioOption) {
                            postAuralization({
                                simulationId: simulationId,
                                audioOptionId: selectedAudioOption.id,
                            });
                        }
                    }}
                >
                    <PlayCircleIcon />
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

    return (
        <div
            className={classes.plot_container}
            style={{ display: value === index ? 'block' : 'none' }}
        >
            <p>
                
            </p>
            <List>
                <h2 className={classes.plot_header}>Auralization</h2>
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
    );
};
