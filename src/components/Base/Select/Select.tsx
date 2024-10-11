import {ReactElement} from 'react';
import {Select as BaseSelect, MenuItem, FormControl, InputLabel} from '@mui/material';
import {OverridableStringUnion} from "@mui/types";

type OptionType = {
    id: string;
    name: string;
};

export const Select = (
    {
        items,
        value,
        setValue,
        disabled = false,
        autoFocus,
        label,
        size = 'medium',
        actionButton,
        className = ''
    }: {
        items: OptionType[];
        value: string;
        setValue: (value: string) => void;
        disabled?: boolean;
        size?: OverridableStringUnion<"medium" | "small">;
        placeholder?: string;
        autoFocus?: boolean;
        label?: string;
        className ?: string;
        actionButton?: { label: string; icon: ReactElement; onClick: () => void };
    }) => {
    return (
        <FormControl size={size} >
            <InputLabel className={className}>{label}</InputLabel>
            <BaseSelect
                label={label}
                value={value || ''}
                className={className}
                disabled={disabled}
                autoFocus={autoFocus}
                onChange={(event) => {
                    setValue(event.target.value);
                }}
            >
                {items.map((item) => (
                    <MenuItem key={item['id']} value={item['id']}>
                        {item.name}
                    </MenuItem>
                ))}

                {actionButton && (
                    <MenuItem
                        sx={{display:'flex', justifyContent:'center', gap:'3%'}}
                        key="action-button"
                        value=''
                        onClick={(event) => {
                            event.stopPropagation(); // Prevent the select from changing value
                            actionButton.onClick();
                        }}>
                        <strong>{actionButton.label}</strong>
                        {actionButton.icon}
                    </MenuItem>
                )}
            </BaseSelect>
        </FormControl>
    );
};
