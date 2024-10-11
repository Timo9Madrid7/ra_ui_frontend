import axios from '@/client';
import toast from 'react-hot-toast';
import {useMutation} from '@tanstack/react-query';

import {
    Material,
    NewMaterial
} from '@/types';


const createMaterial = async (newMaterial: NewMaterial): Promise<Material> => {
    const {data} = await axios.post(`materials`, newMaterial);

    return data;
};

export const useCreateMaterial = () => {
    return useMutation(async (newMaterial: NewMaterial) => await createMaterial(newMaterial), {
        onError: (error) => toast.error(`Error creating new material: ${error}`),
        onSuccess: (material) => toast.success(`Material with name: ${material.name} created!`)
    });
};
