import React, {
    ChangeEvent,
    useEffect,
    useState
} from 'react';
import styles from './styles.module.scss';

/**
 *
 * Components
 * */
import {
    Dialog,
    DefaultButton
} from "@/components";
import {
    DialogContent,
    DialogActions,
    Tooltip,
    IconButton,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

import { ClearRounded } from '@mui/icons-material';

import { SelectParametersOptions } from './SelectParametersOptions';
import { SelectPlotsOptions } from './SelectPlotsOptions';
import { SelectAuralizationOptions } from './SelectAuralizationOptions';


import { DownloadSelectedOptions } from './DownloadSelectedOptions';

export const SelectOptionsPopup = ({isPopupDialogOpen, isOptions}: { isPopupDialogOpen: (show: boolean) => void, isOptions: any }) => {

// parameters 
    const [checkedParam, setCheckedParam] = useState<string[]>([]);

// plots 
    const [checkedPlot, setCheckedPlot] = useState<string[]>([]);

//Auralization
    const [checkedAur, setCheckedAur] = useState<string[]>([]);


    return (
        <Dialog
            open={true}
            hideBackdrop={false}
            title={'Select your preferences'}
            onClose={() => isPopupDialogOpen(false)}
        >
            <form>
                <DialogContent>
                    <Tooltip title="If you don't choose any options then an Excel file with all the values will download. But if you select some options then it will also download the CSV's" className={styles.info_btn}>
                        <IconButton color="primary">
                            <InfoIcon />
                        </IconButton>
                    </Tooltip>
                    
                    { (isOptions === 'all' || isOptions == 'param') &&(
                        <SelectParametersOptions checkedParam={checkedParam} 
                        setCheckedParam={setCheckedParam} />
                    )}
                    
                    { (isOptions == 'all' || isOptions == 'plot') && 
                    <SelectPlotsOptions checkedPlot={checkedPlot} 
                        setCheckedPlot={setCheckedPlot} />
                    }
                    { (isOptions == 'all' || isOptions == 'aur') && 
                    <SelectAuralizationOptions checkedAur = {checkedAur}
                        setCheckedAur = {setCheckedAur}/> 
                    }
                </DialogContent>
                <DialogActions>
                    <div>
                        <DefaultButton
                            label="Cancel"
                            icon={<ClearRounded/>}
                            onClick={() => isPopupDialogOpen(false)}
                        />
                    </div>
                    <div>
                        <DownloadSelectedOptions checkedParam={checkedParam}
                            checkedPlot={checkedPlot}
                            checkedAur={checkedAur} isOptions = {isOptions} />
                    </div>
                </DialogActions>
            </form>
        </Dialog>
    );
};



