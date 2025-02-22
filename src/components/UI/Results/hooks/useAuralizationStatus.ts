import { useState, useEffect } from 'react';
import axios from '@/client';
import { AnechoicOption, SimulationRun } from '@/types';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const getAuralizationStatusById = async (auralizationId: number) => {
    const { data } = await axios.get<SimulationRun>(
        `/auralizations/${auralizationId}/status`
    );
    return data;
};

export const useGetAuralizationStatus = (
    auralizationId: number,
    enabled = true,
    refetchInterval: number | false = false,
    staleTime?: number | undefined
) => {
    return useQuery(
        ['auralizationStatus', auralizationId],
        () => getAuralizationStatusById(auralizationId),
        {
            refetchOnWindowFocus: false,
            refetchInterval: enabled ? refetchInterval : false,
            enabled,
            staleTime,
        }
    );
};

export const useAuralizationStatus = (
    simulationId: string,
    selectedAudioOption: AnechoicOption | null
) => {
    const [auralizationStatus, setAuralizationStatus] = useState<string>('');
    const [loadingAuralization, setLoadingAuralization] =
        useState<boolean>(false);
    const [auralizationId, setAuralizationId] = useState<number>(0);
    const [wavURL, setWavURL] = useState<string | null>(null);

    const { data: checkAuralizationResult } = useGetAuralizationStatus(
        auralizationId,
        // continue to fetch if the auralization is not completed
        !['', 'Error', 'Completed', 0].includes(auralizationStatus),
        5000
    );

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

    useEffect(() => {
        if (auralizationStatus === 'Completed' && auralizationId !== 0) {
            getAuralizationWav();
        }
    }, [auralizationStatus, auralizationId]);

    const postAuralization = async () => {
        if (selectedAudioOption === null) {
            toast.error('Please select an audio option');
            return;
        }
        setAuralizationStatus('');
        setLoadingAuralization(true);
        try {
            const response = await axios.post('/auralizations', {
                audioFileId: selectedAudioOption.id,
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

    return {
        auralizationStatus,
        loadingAuralization,
        wavURL,
        postAuralization,
        setAuralizationStatus,
        setLoadingAuralization,
        setAuralizationId,
        setWavURL,
    };
};
