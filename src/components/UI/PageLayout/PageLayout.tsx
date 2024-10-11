import {ReactNode} from 'react';
import {useState, useEffect} from 'react';

/**
 * Components
 *
 * */
import {Box} from '@mui/material'
import {Header} from '@/components';
import {Loading} from '@/components';

import classes from './styles.module.scss';
import {ModelProvider, SimulationProvider} from "@/context";


type PageLayout = {
    isFetching?: boolean;
    extraHeader?: ReactNode;
    sidepanel?: ReactNode;
    sidepanelExtraHeader?: ReactNode;
    children: ReactNode;
};

export const PageLayout = (
    {
        isFetching,
        extraHeader,
        sidepanel,
        children,
        sidepanelExtraHeader,
    }: PageLayout) => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
        // Check if there's a value in local storage, if not, default to true
        // @ts-expect-error: I know
        return JSON.parse(localStorage.getItem('isSidebarOpen')) ?? true;
    });

    useEffect(() => {
        // Update local storage whenever isSidebarOpen changes
        localStorage.setItem('isSidebarOpen', JSON.stringify(isSidebarOpen));
    }, [isSidebarOpen]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <Box component='div' display={'flex'} height={'100%'} flexDirection={'column'}>
            <div className={classes['page-layout']}>
                {isSidebarOpen && (
                    <div className={classes['sidebar-container']}>
                        <Header hasNavbar={false}>{sidepanelExtraHeader}</Header>
                        {sidepanel}
                    </div>
                )}
                <div className={classes['content-container']}>
                    <Header hasNavbar={true} toggleSidebar={toggleSidebar}>{extraHeader}</Header>
                    {isFetching ? <Loading/> : children}
                </div>
            </div>
        </Box>
    );
};
