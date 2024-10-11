import {FC, CSSProperties} from 'react';
import {TextareaAutosize} from "@mui/base";

type TextAreaProps = {
    autoFocus?: boolean;
    onChange?: (value: string) => void;
    placeholder?: string;
    value?: string;
    className?: string;
    style?: CSSProperties;
};

export const TextArea: FC<TextAreaProps> = (
    {
        placeholder,
        value,
        onChange
    }) => {
    const textAreaStyles: CSSProperties = {
        padding: '10px',
        lineHeight: 1.5,
        fontSize: '13px',
        fontFamily: 'inherit',
        borderRadius: '2px',
        letterSpacing: '0.05em',
        background: 'transparent',
        border: '1px solid rgb(172 172 172)',
        overflowWrap: 'anywhere',
        height: '100px',
        width: '100%',
        minHeight: '50px',
        maxHeight: '250px',
        resize: 'vertical',

    };

    const focusStyles: CSSProperties = {
        border: '1px solid black',
    };

    return (
        <TextareaAutosize
            placeholder={placeholder}
            value={value || ''}
            onChange={onChange ? (event) => onChange(event.target.value) : undefined}
            style={textAreaStyles}
            // @ts-expect-error: border always has value
            onFocus={(e) => (e.currentTarget.style.border = focusStyles.border)}
            // @ts-expect-error: border always has value
            onBlur={(e) => (e.currentTarget.style.border = textAreaStyles.border)}
        />
    );
};
