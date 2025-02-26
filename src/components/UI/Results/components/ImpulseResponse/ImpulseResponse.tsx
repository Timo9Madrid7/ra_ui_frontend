import { useMemo, useCallback, useRef, useState, useEffect } from 'react';
import { useWavesurfer } from '@wavesurfer/react';
<<<<<<< HEAD
import { saveAs } from 'file-saver';
=======
>>>>>>> auralization_UI
import Timeline from 'wavesurfer.js/dist/plugins/timeline.esm.js';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircle from '@mui/icons-material/PauseCircle';
import colors from '@/theme/colors.module.scss';
<<<<<<< HEAD
import DownloadIcon from "@mui/icons-material/Download";

=======
>>>>>>> auralization_UI

const formatTime = (seconds: number) =>
    [seconds / 60, seconds % 60]
        .map((v) => `0${Math.floor(v)}`.slice(-2))
        .join(':');
export const ImpulseResponse = ({ impulseURL }: { impulseURL: string }) => {
    const containerRef = useRef(null);
    const [duration, setDuration] = useState(0);
    const { wavesurfer, isPlaying, currentTime } = useWavesurfer({
        container: containerRef,
        height: 100,
        waveColor: colors.raDarkPurple,
        progressColor: 'rgb(100, 0, 100)',
        cursorColor: 'transparent',
        url: impulseURL,
        plugins: useMemo(() => [Timeline.create()], []),
    });
    const onPlayPause = useCallback(() => {
        wavesurfer && wavesurfer.playPause();
    }, [wavesurfer]);

    useEffect(() => {
        if (wavesurfer) {
            wavesurfer.on('ready', () => {
                setDuration(wavesurfer.getDuration());
            });
        }
    }, [wavesurfer]);

    const handleImpulseDownload = () => {
        const blob = new Blob([impulseURL], { type: 'audio/x-wav' });
        saveAs(blob, 'ImpulseResponse.wav');
    };

    const onSeek = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            if (wavesurfer) {
                const progress = event.target.value;
                wavesurfer.seekTo(+progress / 100);
            }
        },
        [wavesurfer]
    );

    return (
        <>
            <div ref={containerRef} />
            <div
                style={{
                    margin: '1em 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1em',
                }}
            >
                <button onClick={onPlayPause} style={{ minWidth: '5em' }}>
                    {isPlaying ? (
                        <PauseCircle color='primary' />
                    ) : (
                        <PlayCircleIcon color='primary' />
                    )}
                </button>
                
                <input
                    type='range'
                    min='0'
                    max='100'
                    value={(currentTime / duration) * 100 || 0}
                    onChange={onSeek}
                    style={{ flex: 1 }}
                />
                <span>
                    {formatTime(currentTime)} / {formatTime(duration)}
                </span>

                <button onClick={handleImpulseDownload}
                        style={{ minWidth: '7em', display: 'flex', alignItems: 'center', gap: '0.1em' }}>
                    <DownloadIcon color="primary" />
                    Download Audio
                </button>
            </div>
        </>
    );
};
