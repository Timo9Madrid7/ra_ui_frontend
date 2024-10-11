import {useNavigate, Link} from 'react-router-dom';
import {Fragment, useEffect, useState} from 'react';

/**
 * Icons
 * */
import {IconButton} from '@mui/material';

import UndoSharpIcon from '@mui/icons-material/UndoSharp';
import NavigateNextTwoToneIcon from '@mui/icons-material/NavigateNextTwoTone';

/**
 * Styles
 * */
import styles from './styles.module.scss';

type Breadcrumb = {
    text: string;
    link?: string;
};

export const Breadcrumbs = ({items}: { items: Breadcrumb[] }) => {
    const [
        location,
        setLocation
    ] = useState<Breadcrumb>();

    const [
        previousLocations,
        setPreviousLocations
    ] = useState<Breadcrumb[]>([]);

    useEffect(() => {
        const itemsCopy = [...items];
        setLocation(itemsCopy.pop());
        setPreviousLocations(itemsCopy);
    }, [items]);

    const navigate = useNavigate();

    return (
        <>
            {location && (
                <div className={styles['breadcrumbs-container']}>
                    <IconButton className="back-btn" onClick={() => navigate(-1)}>
                        <UndoSharpIcon/>
                    </IconButton>
                    <div className={styles['items']}>
                        {previousLocations.map((item: Breadcrumb, index: number) => (
                            <Fragment key={index}>
                                {item.link &&
                                    <Link to={item.link}>{item.text}</Link>
                                }
                                {index < items.length
                                    &&
                                    <span className={styles['icon']}> <NavigateNextTwoToneIcon/> </span>
                                }
                            </Fragment>
                        ))}
                        <span className={styles['active']}>{location.text}</span>

                    </div>
                </div>
            )}
        </>
    );
};
