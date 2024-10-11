import {FC} from 'react';

/**
 * Components
 * */
import {Link} from 'react-router-dom';

/**
 * Styles
 * */
import styles from './styles.module.scss';

/**
 * Types
 *
 */
type ErrorPageProps = {
    title?: string;
    errorInfo?: string;
};

export const Error: FC<ErrorPageProps> = (
    {
        title = 'Something went wrong',
        errorInfo = "The page you are looking for is not available!",
    }) => {


    return (
        <div className={styles['container']}>
            <h1>{title}</h1>
            <p className={styles['error-info']}>{errorInfo}</p>
            <Link className={styles['return']} to="/">
                Go Home
            </Link>
        </div>
    );
};
