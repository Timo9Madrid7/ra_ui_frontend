import React, {
    ChangeEvent,
    useState
} from 'react';

import styles from './styles.module.scss';

/**
 *
 * Component of parameter options
 * */

import {

    Checkbox,
    FormControlLabel,
    Box,
} from "@mui/material";



import {RESULT_PARAMETERS} from "@/constants";


export const SelectParametersOptions = ({ checkedParam, setCheckedParam }) => {


    const handleParameterParentChange = (event: ChangeEvent<HTMLInputElement>) => {
        setCheckedParam(event.target.checked ? RESULT_PARAMETERS : []);
    };

    const handleParamChildChange = (param: number) => (
        event: ChangeEvent<HTMLInputElement>
        ) => {
            setCheckedParam(event.target.checked
                ? [...checkedParam, param]
                : checkedParam.filter(item => item !== param));
    };

    const allCheckedParam = checkedParam.length === RESULT_PARAMETERS.length;
    const someCheckedParam = checkedParam.length > 0 && !allCheckedParam;

    return (                    
            <div>
                {/* parameters  */}
                <FormControlLabel                                   
                    label="Parameters :"                       
                    control={
                    <Checkbox
                        checked={allCheckedParam}
                        indeterminate={someCheckedParam}
                        onChange={handleParameterParentChange}
                    />
                    }
                />                    
                <Box className={styles.options_show} >
                    {RESULT_PARAMETERS.map((param) => (
                    <FormControlLabel
                        key={param}
                        label={param}
                        control={
                            <Checkbox
                                    // icon={<CircleOutlined />}
                                    // checkedIcon = {<CircleRounded/>}
                                    checked={checkedParam.includes(param)}
                                    onChange={handleParamChildChange(param)}
                                />
                        }
                    />
                    ))}
                </Box>
            </div>       
    );
};


