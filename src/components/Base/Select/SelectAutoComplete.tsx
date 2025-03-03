import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export const SelectAutoComplete = ({
    options,
    label,
    onChange,
    isOptionEqualToValue,
}: {
    options: { label: string; id: number }[];
    label: string;
    onChange: (
        event: React.SyntheticEvent,
        value: { label: string; id: number } | null
    ) => void;
    isOptionEqualToValue: (
        option: { label: string; id: number },
        value: { label: string; id: number }
    ) => boolean;
}) => {
    return (
        <Autocomplete
            disablePortal
            onChange={onChange}
            options={options}
            isOptionEqualToValue={isOptionEqualToValue}
            renderInput={(params) => <TextField {...params} label={label} />}
        />
    );
};
