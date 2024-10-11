/** Components */
import {Box, FormControl, Stack, TextField} from '@mui/material';

import {TextArea} from '@/components';

type PopupContent = {
    name: string;
    setName: (name: string) => void;
    description: string;
    setDescription: (description: string) => void;
};

export const EditSimAttrPopupContent = ({name, setName, description, setDescription}: PopupContent) => {
    return (
        <Stack>
            <FormControl>
                <Box component={'div'} paddingBottom={1}>
                    <TextField
                        autoFocus
                        color={'secondary'}
                        label="Simulation Name"
                        placeholder={'enter name of the simulation'}
                        variant="outlined"
                        autoComplete="off"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value)
                        }}
                    />
                </Box>
            </FormControl>
            <FormControl>
                <Box component="div" paddingBottom={1}>
                    <TextArea placeholder="Simulation description" value={description} onChange={setDescription}/>
                </Box>
            </FormControl>
        </Stack>
    );
};
