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
    useAudioOptions,
    useAuralizationStatus,
    useImpulseResponseAudio,
} from '@/components';

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

    return (
        <div
            className={classes.plot_container}
            style={{ display: value === index ? 'block' : 'none' }}
        >
            <h2 className={classes.plot_header}>Impulse Response</h2>
            {impulseURL && <ImpulseResponse impulseURL={impulseURL} />}
            <List>
                <h2 className={classes.plot_header}>Auralization</h2>
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
    );
};
