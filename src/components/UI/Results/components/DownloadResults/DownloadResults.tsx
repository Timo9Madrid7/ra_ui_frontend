import axios, { AxiosResponse } from '@/client';

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

  const getExportSolveResult = async (simulationId: string) => {
    const zipfile = await axios.get(`/exports/${simulationId}`, {responseType: 'blob',});
    return zipfile;
  };

  const handleDownloadSource = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (simulationId) {
      setIsLoading(true);
      handleClose();

      const response = await getExportSolveResult(simulationId);
      handleDownload(response);

      setIsLoading(false);
    }
  };

  const handleDownload = (response: AxiosResponse<Blob>) => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const anchorElement = document.createElement('a');
    anchorElement.href = url;
    anchorElement.setAttribute('download', 'SimulationResult.zip'); // Set the file name
    document.body.appendChild(anchorElement);
    anchorElement.click();
    document.body.removeChild(anchorElement);
    window.URL.revokeObjectURL(url); // Clean up the URL object
  };

  return (
    <>
      <Button
        id="download-button"
        aria-controls={open ? 'download-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        // disabled={solveResultId === undefined}
        className={classes.download_button}>
        {isLoading ? (
          <CircularProgress size={16} />
        ) : (
          <>
            <FileDownloadOutlinedIcon /> Download
          </>
        )}
      </Button>
      <Menu
        id="download-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'download-button',
        }}>
        <span className={classes.menu_title}> Download </span>

        {/*<MenuItem onClick={handleDownloadParameters} className={classes.menu_item}>*/}
        {/*  <span>Parameters values (.xlsx)</span>*/}
        {/*</MenuItem>*/}
        <MenuItem onClick={handleDownloadSource} className={classes.menu_item}>
          <FolderZipOutlinedIcon /> <span>Simulation Result(.zip)</span>
        </MenuItem>
        {/* <MenuItem onClick={handleDownloadSource} className={classes.menu_item}> */}
          {/* <FolderZipOutlinedIcon /> <span>IRs for selected source (.zip)</span> */}
        {/* </MenuItem> */}
      </Menu>
    </>
  );
};
