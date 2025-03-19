import { useState, useEffect } from 'react';
import { AnechoicOption } from '@/types';
import axios from '@/client';
import { useQuery } from '@tanstack/react-query';

const getAudios = async (simulationId: string) => {
    const { data } = await axios.get(`auralizations/${simulationId}/audiofiles`);

    return data;
};

const useGetAudios = (enabled = true, simulationId: string) => {
    const query = useQuery<AnechoicOption[], Error>(
        ['anechoic'],
        () => getAudios(simulationId),
        {
            enabled: enabled,
            refetchOnWindowFocus: false,
        }
    );

    return query;
};

export const useAudioOptions = (simulationId: string) => {
    // [1, 2, 3]
    const [selectedAudioOption, setSelectedAudioOption] =
        useState<AnechoicOption | null>(null);
    const {
        data: audioOptions,
        isLoading: isLoadingAudioOptions,
        error: audioOptionsError,
    } = useGetAudios(true, simulationId);

    useEffect(() => {
        if (audioOptions && !isLoadingAudioOptions && !audioOptionsError) {
            if (audioOptions.length > 0) {
                setSelectedAudioOption(audioOptions[0]);
            }
        }
    }, [audioOptions, isLoadingAudioOptions, audioOptionsError]);

    const formatedAudioOptions = () => {
        if (audioOptions) {
            return audioOptions.map((audioOption) => ({
                label: audioOption.name,
                id: audioOption.id,
            }));
        } else {
            return [];
        }
    };

    return {
        audioOptions,
        isLoadingAudioOptions,
        audioOptionsError,
        selectedAudioOption,
        setSelectedAudioOption,
        formatedAudioOptions,
    };
};
