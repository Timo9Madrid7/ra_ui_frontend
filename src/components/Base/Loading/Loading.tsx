/**
 * Components
 * */
import {
    Box,
    LinearProgress,
    CircularProgress,
} from '@mui/material';
import classes from "./styles.module.scss";

type LoadingProps = {
    withLinear?: boolean;
}

type LoadingFullScreenProps = {
    top?: number;
    left?: number;
    note?: string;
    width?: string;
    height?: string;
    message?: string;
};

export const Loading = (
    {
        withLinear = true,
    }: LoadingProps) => {
    return (
        <>
            {withLinear ? <LinearProgress color="warning"/> : ''}
            <Box component='div' className={classes.loading}>
                <CircularProgress color={"warning"}/>
            </Box>
        </>
    );
};

export const LoadingFullScreen = (
    {
        top = 1,
        left = 1,
        note,
        width,
        height,
        message,
    }: LoadingFullScreenProps) => {
    return (
        <Box
            top={top}
            left={left}
            component="div"
            className={classes.loading_full}
            width={width ?? 'calc(100% - ' + left * 2 + 'px)'}
            height={height ?? 'calc(100% - ' + top * 2 + 'px)'}
        >
            <CircularProgress color={'warning'}/>

            {message && <div className={classes.message}>{message}</div>}
            {note && <div className={classes.note}>{note}</div>}
        </Box>
    );
};

