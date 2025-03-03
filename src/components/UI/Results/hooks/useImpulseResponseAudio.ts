import { useState, useEffect } from 'react';
import axios from '@/client';
import { useQuery } from '@tanstack/react-query';

const getImpulseResponseAudio = async (simulationId: string) => {
    const { data } = await axios.get(
        `/auralizations/${simulationId}/impulse/wav`,
        {
            responseType: 'arraybuffer',
        }
    );

    return data;
};

const useGetImpulseResponseAudio = (simulationId: string, enabled = true) => {
    const query = useQuery(
        ['impulse'],
        () => getImpulseResponseAudio(simulationId),
        {
            enabled: enabled,
            refetchOnWindowFocus: false,
        }
    );

    return query;
};

export const useImpulseResponseAudio = (simulationId: string) => {
    const [impulseURL, setImpulseURL] = useState<string | null>(null);
    const {
        data: impulseResponseAudio,
        isLoading: isLoadingImpulseResponseAudio,
        error: impulseResponseAudioError,
    } = useGetImpulseResponseAudio(simulationId);

    useEffect(() => {
        if (!isLoadingImpulseResponseAudio && impulseResponseAudio) {
            const blob = new Blob([impulseResponseAudio], {
                type: 'audio/x-wav',
            });
            const url = window.URL.createObjectURL(blob);
            setImpulseURL(url);
        }
    }, [isLoadingImpulseResponseAudio, impulseResponseAudio]);

    return {
        impulseURL,
        isLoadingImpulseResponseAudio,
        impulseResponseAudioError,
    };
};
