/**
 * Components
 * */
import  {
    FC,
    useState,
    useEffect, useRef,
} from 'react';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';

/**
 * Styles
 * */
import styles from './styles.module.scss';

/**
 * Interfaces
 * */
interface IDropdownBaseProps {
    value: string;
    onChange: (value: string) => void;
    options: IDropdownOptions[];
    className?: string,
    bodyClassName?: string
}

interface IDropdownProps {
    title: string;
    options: IDropdownOptions[];
    callback: (newValue: string) => void;

    selectedOption: string;
    setSelectedOption: (value: string) => void;
    withAll?: boolean,
    className?: string,
    bodyClassName?: string,
}

export interface IDropdownOptions {
    value: string;
    label: string;
    element?: string | (() => JSX.Element);
}

const DropdownBase: FC<IDropdownBaseProps> = (
    {
        value,
        onChange,
        className = '',
        bodyClassName = '',
        options
    }) => {

    const [
        isOpen,
        setIsOpen
    ] = useState(false);

    const handleSelect = (newValue: string) => {
        onChange(newValue);
        setIsOpen(false);
    };
    const dropdownRef = useRef(null);

    useEffect(() => {
        document.addEventListener('mousedown', (event) => {
            // @ts-expect-error: i know
            if (dropdownRef && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        });

    }, []);


    return (
        <div className={styles.dropdown} ref={dropdownRef}>
            <div className={`${styles.dropdown_header} ${className} ${isOpen ? styles.close : ''}`}
                 onClick={() => setIsOpen(!isOpen)}>
                <span>{options.find(option => option.value === value)?.label}</span>
                <ExpandMoreRoundedIcon/>
            </div>
            {isOpen && (
                <div className={`${styles.dropdown_body} ${bodyClassName}`}>
                    {options.map(option => (
                        <div
                            key={option.value}
                            className={styles.dropdown_option}
                            onClick={() => handleSelect(option.value)}>
                            {typeof option.element === 'function' ? option.element() : option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


export function Dropdown(
    {
        title,
        options,
        callback,
        selectedOption,
        setSelectedOption,
        withAll = true,
        className,
        bodyClassName,
    }: IDropdownProps
) {
    const [dropdownOptions, setDropdownOptions] = useState<IDropdownOptions[]>([]);

    const onChange = (newValue: string): void => {
        setSelectedOption(newValue);
        callback(newValue);
    };

    useEffect(() => {
        if (options) {
            const seen: { [key: string]: boolean } = {};
            const uniqOptions = options.filter(option => {
                const key = JSON.stringify(option);
                return Object.prototype.hasOwnProperty.call(seen, key) ? false : (seen[key] = true);
            });

            const parsedOpts: IDropdownOptions[] = withAll
                ? [{value: 'all', label: 'All'}].concat(uniqOptions)
                : uniqOptions;
            setDropdownOptions(parsedOpts);
        }
    }, [options]);

    return (
        <div className={styles.dropdown_container}>
            <p className={styles.dropdown_title}>{title}</p>
            <DropdownBase
                onChange={onChange}
                value={selectedOption}
                options={dropdownOptions}
                className={className}
                bodyClassName={bodyClassName}
            />
        </div>
    );
}

