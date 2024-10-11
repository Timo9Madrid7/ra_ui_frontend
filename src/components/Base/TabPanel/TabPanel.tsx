import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
    className?: string;
}

export const TabPanel = (props: TabPanelProps) => {
    const {
        children,
        value,
        index,
        className = '',
        ...other
    } = props;

    return (
        <div
            style={{display: value === index ? 'block' : 'none'}}
            role="tabpanel"
            className={className}
            hidden={value !== index}
            id={`simple-tab-panel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {children}
        </div>
    );
}