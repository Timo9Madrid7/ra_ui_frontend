import {FC} from 'react';

import styles from './styles.module.scss';

type PointMarkerProps = {
    label: string;
    isSelected?: boolean;
    color: 'blue' | 'green' | 'white' | 'purple' | 'orange';
};

export const PointMarker: FC<PointMarkerProps> = (
    {
        label,
        isSelected,
        color
    }) => {
    return (
        <div
            className={`${styles.point_marker} ${styles[color]} ${isSelected ? styles.selected: ''}`}>
            <div className={styles.circle_container}>
                <p>{label}</p>
            </div>
        </div>
    );
};
