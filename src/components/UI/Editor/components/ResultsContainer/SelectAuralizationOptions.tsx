import React, {
    ChangeEvent
} from 'react';

import styles from './styles.module.scss';

/**
 *
 * Components
 * */

import {
    Checkbox,
    FormControlLabel,
    Box
} from "@mui/material";



import {AURALIZATION_OPTIONS} from "@/constants";


export const SelectAuralizationOptions = ({checkedAur, setCheckedAur }) => {
    


//Auralization    

    const handleParentAurChange = (event: ChangeEvent<HTMLInputElement>) => {
        setCheckedAur(event.target.checked ? AURALIZATION_OPTIONS.map(f => f.value) : []);
    };

    const handleChildAurChange = (option: string) => (
        event: React.ChangeEvent<HTMLInputElement>
        ) => {
        setCheckedAur(event.target.checked
            ? [...checkedAur, option]
            : checkedAur.filter(item => item !== option));
    };

    const allCheckedAur = checkedAur.length === AURALIZATION_OPTIONS.length;
    const someCheckedAur = checkedAur.length > 0 && !allCheckedAur;

 

    return (
        <div>
            {/* auralization  */}
            <FormControlLabel
                label="Auralization :"                       
                control={
                <Checkbox                            
                    checked={allCheckedAur}
                    indeterminate={someCheckedAur}
                    onChange={handleParentAurChange}
                />
                }
            />                    
            <Box className={styles.options_show}>
                {AURALIZATION_OPTIONS.map((option) => (
                <FormControlLabel
                    key={option.value}
                    label={option.label}
                    control={
                        <Checkbox
                            // icon={<CircleOutlined />}
                            // checkedIcon = {<CircleRounded/>}
                            checked={checkedAur.includes(option.value)}
                            onChange={handleChildAurChange(option.value)}
                    />
                    }
                />
                ))}
            </Box>
        </div>
               
    );
};


