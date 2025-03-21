import axios, { AxiosResponse } from '@/client';
import toast from 'react-hot-toast';
import { saveAs } from 'file-saver';

import { useState } from 'react';

import { CircularProgress, Menu, MenuItem, Button } from '@mui/material';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import FolderZipOutlinedIcon from '@mui/icons-material/FolderZipOutlined';

/** Styles */
import classes from './styles.module.scss';
import { Simulation } from '@/types';

export const DownloadResults = ({
    simulationId,
    solveResultId,
    selectedSimulation,
}: {
    simulationId: string;
    solveResultId?: string;
    selectedSimulation: Simulation | null;
}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isLoading, setIsLoading] = useState(false);

    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const parameters = ['edt', 't20', 't30', 'c80', 'd50', 'ts', 'spl_t0_freq'];
    const plots = ['125Hz', '250Hz', '500Hz', '1000Hz', '2000Hz'];
    const aur = ['wavIR', 'csvIR'];
    const xlsx = ['true'];

    const getExportSolveResult = async (simulationId: string) => {
        const selectedOptions = {
            xlsx: xlsx,
            Parameters: parameters,
            EDC: plots,
            Auralization: aur,
            SimulationId: [simulationId],
        };
        try {
            const zipfile = await axios.post(
                `exports/custom_export`,
                selectedOptions,
                { responseType: 'blob' }
            );
            return zipfile;
        } catch (error: any) {
            setIsLoading(false);
            toast.error('Can not download the result', error);
            error.response.data;
            return;
        }
    };

    const handleDownloadSource = async (e: React.MouseEvent) => {
        e.stopPropagation();

        if (simulationId) {
            setIsLoading(true);
            handleClose();

            const response = await getExportSolveResult(simulationId);

            if (response instanceof Error) {
                toast.error(`Error downloading the file`);

                setIsLoading(false);
                return;
            }
            handleDownload(response);

            setIsLoading(false);
        }
    };

    const handleDownload = (response: AxiosResponse) => {
        const blob = new Blob([response.data], { type: 'application/zip' });
        saveAs(blob, 'SimulationResult.zip');
    };

    return (
        <>
            <Button
                id='download-button'
                aria-controls={open ? 'download-menu' : undefined}
                aria-haspopup='true'
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                // disabled={solveResultId === undefined}
                className={classes.download_button}
            >
                {isLoading ? (
                    <CircularProgress size={16} />
                ) : (
                    <>
                        <FileDownloadOutlinedIcon /> Download
                    </>
                )}
            </Button>
            <Menu
                id='download-menu'
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'download-button',
                }}
            >
                <span className={classes.menu_title}> Download </span>

                {/*<MenuItem onClick={handleDownloadParameters} className={classes.menu_item}>*/}
                {/*  <span>Parameters values (.xlsx)</span>*/}
                {/*</MenuItem>*/}
                <MenuItem
                    onClick={handleDownloadSource}
                    className={classes.menu_item}
                >
                    <FolderZipOutlinedIcon />{' '}
                    <span>Simulation Result(.zip)</span>
                </MenuItem>
                {/* <MenuItem onClick={handleDownloadSource} className={classes.menu_item}> */}
                {/* <FolderZipOutlinedIcon /> <span>IRs for selected source (.zip)</span> */}
                {/* </MenuItem> */}
            </Menu>
        </>
    );
};
