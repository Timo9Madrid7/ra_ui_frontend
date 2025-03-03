import { SimulationSettingOption } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { useQuery } from '@tanstack/react-query';

const getSimulationSettings = async () => {
    const { data } = await axios.get('/simulation_settings');
    return data;
}

const useGetSimulationSettings = (enabled = true) => {
    const query = useQuery<SimulationSettingOption[], Error>(
        ['simulation_settings'],
        () => getSimulationSettings(),
        {
            enabled: enabled,
            refetchOnWindowFocus: false,
        }
    );

    return query;
}

export const useSimulationSettingOptions = (enabled: boolean) => {
    const [selectedOption, setSelectedOption] = useState<SimulationSettingOption | null>(null);

    const {
        data: simulationSettingOptions,
        isLoading: isLoadingSimulationSettingOptions,
        error: simulationSettingOptionsError,
    } = useGetSimulationSettings(enabled);

    useEffect(() => {
        if (simulationSettingOptions && !isLoadingSimulationSettingOptions && !simulationSettingOptionsError) {
            if (simulationSettingOptions.length > 0) {
                setSelectedOption(simulationSettingOptions[0]);
            }
        }
    }, [simulationSettingOptions, isLoadingSimulationSettingOptions, simulationSettingOptionsError]);

    const formattedSimulationSettingOptions: () => {label: string, id: number}[] = () => {
        if (simulationSettingOptions) {
            return simulationSettingOptions.map((simulationSettingOption) => ({
                label: simulationSettingOption.label,
                id: simulationSettingOption.simulationType as unknown as number,
            }));
        } else {
            return [];
        }
    }

    return {
        simulationSettingOptions,
        isLoadingSimulationSettingOptions,
        simulationSettingOptionsError,
        selectedOption,
        setSelectedOption,
        formattedSimulationSettingOptions,
    };
}