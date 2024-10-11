import React from 'react';
import {Link} from 'react-router-dom';

import logo from '@/assets/logos/logo.png';

import styles from './styles.module.scss';
import {IconButton} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';


interface HeaderProps {
    hasNavbar: boolean;
    toggleSidebar?: () => void;
    children: React.ReactNode;
}


export const Header: React.FC<HeaderProps> = ({children, hasNavbar, toggleSidebar}) => {
    return (
        <header className={styles['header-container']}>
            {hasNavbar ? (
                <nav className={styles['header-nav']}>
                    {toggleSidebar && (
                        <IconButton
                            edge="start"
                            onClick={toggleSidebar}>
                            <MenuIcon/>
                        </IconButton>
                    )}

                    <Link to="/">
                        <img src={logo} alt="Logo"/>
                    </Link>

                    <div className={styles['header-items']}>{children}</div>
                </nav>
            ) : (
                children
            )}
        </header>
    );
};