import { useMemo, useCallback, useRef, useState, useEffect } from 'react';
import { useWavesurfer } from '@wavesurfer/react';
import Timeline from 'wavesurfer.js/dist/plugins/timeline.esm.js';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircle from '@mui/icons-material/PauseCircle';

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
        waveColor: 'rgb(200, 0, 200)',
        progressColor: 'rgb(100, 0, 100)',
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
                    {isPlaying ? <PauseCircle /> : <PlayCircleIcon />}
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
            </div>
        </>
    );
};

// import * as React from 'react';
// const { useMemo, useCallback, useRef } = React;
// import { useWavesurfer } from '@wavesurfer/react';
// import Timeline from 'wavesurfer.js/dist/plugins/timeline.esm.js';

// const formatTime = (seconds: number) =>
//     [seconds / 60, seconds % 60]
//         .map((v) => `0${Math.floor(v)}`.slice(-2))
//         .join(':');

// export const ImpulsePlayback = ({ impulseURL }: { impulseURL: string }) => {
//     const containerRef = useRef(null);
//     const { wavesurfer, isPlaying, currentTime } = useWavesurfer({
//         container: containerRef,
//         height: 100,
//         waveColor: 'rgb(200, 0, 200)',
//         progressColor: 'rgb(100, 0, 100)',
//         url: impulseURL,
//         plugins: useMemo(() => [Timeline.create()], []),
//     });

//     const onPlayPause = useCallback(() => {
//         wavesurfer && wavesurfer.playPause();
//     }, [wavesurfer]);

//     return (
//         <>
//             <div ref={containerRef} />

//             <p>Current time: {formatTime(currentTime)}</p>

//             <div style={{ margin: '1em 0', display: 'flex', gap: '1em' }}>
//                 <button onClick={onPlayPause} style={{ minWidth: '5em' }}>
//                     {isPlaying ? 'Pause' : 'Play'}
//                 </button>
//             </div>
//         </>
//     );
// };