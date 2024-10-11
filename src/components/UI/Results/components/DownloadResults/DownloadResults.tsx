import axios from '@/client';

import { useState } from 'react';

import { CircularProgress, Menu, MenuItem, Button } from '@mui/material';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import FolderZipOutlinedIcon from '@mui/icons-material/FolderZipOutlined';


/** Styles */
import classes from './styles.module.scss';
import toast from 'react-hot-toast';
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

  const exportSimulationResult = async (simulationId: string) => {
    const { data } = await axios.get(`/api/ResultExport/ExportSimulationResult?simulationId=${simulationId}`);
    return data;
  };
  const getExportSolveResult = async (solveResultId: string) => {
    const { data } = await axios.get(`/api/ResultExport/ExportSolveResult?solveResultId=${solveResultId}`);
    return data;
  };

  const handleDownloadParameters = async (e: React.MouseEvent) => {
    e.stopPropagation();

    setIsLoading(true);
    handleClose();
    const downloadUrl = await exportSimulationResult(simulationId);
    handleDownload(downloadUrl);
    setIsLoading(false);
  };

  const handleDownloadSource = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (solveResultId) {
      setIsLoading(true);
      handleClose();

      const downloadUrl = await getExportSolveResult(solveResultId);
      handleDownload(downloadUrl);

      setIsLoading(false);
    }
  };

  const handleDownload = (downloadUrl: string) => {
    const anchorElement = document.createElement('a');
    if (downloadUrl) {
      anchorElement.href = downloadUrl;
      document.body.appendChild(anchorElement);
      anchorElement.click();
      document.body.removeChild(anchorElement);
    } else {
      if (selectedSimulation) {
        toast.error(`No file found for ${selectedSimulation.name}`);
      }
    }
  };

  return (
    <>
      <Button
        id="download-button"
        aria-controls={open ? 'download-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        disabled={solveResultId === undefined}
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
          <FolderZipOutlinedIcon /> <span>IRs for selected source (.zip)</span>
        </MenuItem>
      </Menu>
    </>
  );
};
