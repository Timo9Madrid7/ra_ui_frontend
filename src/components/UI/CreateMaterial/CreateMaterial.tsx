import {Data} from 'plotly.js';
import Plot from 'react-plotly.js';
import React, {useEffect, useState} from 'react';

/**
 * Components
 * */
import {
    Table,
    TableRow,
    TextField,
    TableBody,
    TableHead,
    TableCell,
    DialogActions,
    DialogContent,
    TableContainer
} from '@mui/material';

import {
    Select,
    Dialog,
    TextArea,
    NumberInput,
    DefaultButton, SuccessButton
} from '@/components';

/**
 * Context
 * */
import {useAppContext} from '@/context/AppContext';
import {AppContextActionType} from '@/enums';

/**
 * Hooks
 * */
import {useCreateMaterial} from './hooks/useCreateMaterial.tsx';

import {SelectType} from '@/types';

/**
 * Assets
 * */
import classes from './styles.module.scss'
import {Done, RestartAlt} from "@mui/icons-material";

/**
 * Constants
 */
import {
    FREQUENCIES,
    FREQUENCIES_VALUES,
    DEFAULT_COEFFICIENTS
} from "@/constants";


export const CreateMaterial = ({setShowDialog}: { setShowDialog: (show: boolean) => void }) => {

    const {
        dispatch,
        appState: {filteredMaterials},
    } = useAppContext();

    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [category, setCategory] = useState<string>('');

    const [isFormValid, setIsFormValid] = useState(true);

    const [absorptionCoefficients, setAbsorptionCoefficients] = useState<(number | undefined)[]>(DEFAULT_COEFFICIENTS);
    const [plotlyData, setPlotlyData] = useState<Data[]>([] as Data[]);
    const [menuItems, setMenuItems] = useState<SelectType[]>([]);

    // Initialize state with the current window size
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    const {mutate: createMaterial, isLoading: isCreatingMaterial} = useCreateMaterial();
    const {
        appState: {materialCategories},
    } = useAppContext();

    /**
     * Form validation: validate the name and category
     *
     */
    useEffect(() => {
        (category && (name && name.length > 0))
            ? setIsFormValid(true)
            : setIsFormValid(false);

    }, [name, category]);


    /**
     * Form: reset the form to initial values
     *    - set name to null
     *    - set category to null
     *    - set description to null
     *    - reset absorption coefficients to the initial values
     *
     */
    const resetForm = () => {
        setName('');
        setCategory('');
        setDescription('');
        setAbsorptionCoefficients(DEFAULT_COEFFICIENTS);
    };


    /**
     * initiate plot with the default values and connect to absorption coefficients
     *
     */
    useEffect(() => {
        const plotData = [
            {
                name: 'Absorption coefficients',
                x: FREQUENCIES_VALUES,
                y: absorptionCoefficients,
                type: "scatter",
                mode: "lines+markers",
                line: {
                    color: '#b728d7'
                }
            },
        ];
        // @ts-expect-error:I know
        setPlotlyData(plotData);
    }, [absorptionCoefficients]);

    /**
     * Handler: form submission
     * send material's data to create a new material
     *
     * @param {React.MouseEvent} e The submit event
     */
    const handleCreateMaterial = (e: React.MouseEvent) => {
        e.preventDefault();

        createMaterial(
            {
                name,
                category,
                description,
                absorptionCoefficients
            },
            {
                onSuccess: (data) => {
                    dispatch({
                        type: AppContextActionType.SET_MATERIALS,
                        payload: [...filteredMaterials, data],
                    });
                    setShowDialog(false);
                },
            }
        );
    };

    /**
     * Handler: resize control
     *
     */
    const handleResize = () => {
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight
        });
    };

    // Add the event listener when the component mounts
    useEffect(() => {
        window.addEventListener('resize', handleResize);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []); // Empty array ensures this effect runs only on mount and unmount

    useEffect(() => {
        if (materialCategories.length > 0) {
            const sorted = materialCategories.sort((a, b) => a.localeCompare(b));
            const menuItem = sorted.map((item) => {
                return {
                    name: item,
                    id: item,
                };
            });
            setMenuItems(menuItem);
        }
    }, [materialCategories]);

    return (
        <Dialog
            fullWidth
            open={true}
            maxWidth={'md'}
            title={'Create new material'}
            onClose={() => setShowDialog(false)}
        >
            <DialogContent>

                <div className={classes.container}>
                    <div className={classes.left}>
                        <TextField
                            autoFocus
                            placeholder={'Material name (required)'}
                            color={'secondary'}
                            label="Material Name"
                            variant="outlined"
                            autoComplete="off"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value)
                            }}
                        />
                        <Select
                            value={category || ''}
                            setValue={setCategory}
                            items={menuItems}
                            label={'Material category'}
                            placeholder="Select category (required)"
                        />
                    </div>
                    <div className={classes.right}>
                        <TextArea
                            placeholder="Material description"
                            value={description}
                            onChange={setDescription}
                        />
                    </div>
                </div>


                <div className={classes.abs_container}>
                    <h3 className={classes.title}>Absorption Coefficient</h3>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell key='freq_title_unique'>Frequency</TableCell>
                                    {FREQUENCIES.map((label) => (
                                        <TableCell key={label}>{label}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell key='imp_value_unique'>Coefficients</TableCell>
                                    {FREQUENCIES.map((_, i) => (
                                        <TableCell key={i}>
                                            <NumberInput
                                                min={0.01}
                                                max={0.99}
                                                step={0.01}
                                                toFixed={false}
                                                value={absorptionCoefficients[i]}
                                                onChange={(value) => {
                                                    const newAbsorptionCoefficients = [...absorptionCoefficients];
                                                    newAbsorptionCoefficients[i] = value;
                                                    setAbsorptionCoefficients(newAbsorptionCoefficients);
                                                }}
                                            />
                                        </TableCell>
                                    ))}
                                </TableRow>

                            </TableBody>
                        </Table>
                    </TableContainer>

                    <div className={classes.plot}>
                        <Plot
                            data={plotlyData}
                            layout={{
                                autosize: true,
                                width: Math.round(windowSize.width / 3) || 450,
                                height: Math.round(windowSize.height / 5) || 350,
                                legend: {
                                    y: 1.15,
                                    orientation: 'h',
                                    font: {
                                        color: 'black',
                                    },
                                },
                                xaxis: {
                                    title: {
                                        text: 'Frequency [Hz]',
                                        font: {
                                            color: 'black',
                                            size: 10
                                        },
                                    },
                                    tickmode: 'array',
                                    tickvals: FREQUENCIES_VALUES,
                                    ticktext: FREQUENCIES,
                                    type: 'log',
                                    gridcolor: '#b6b6b6',
                                    griddash: 'dot', // "solid" | "dot" | "dash" | "longdash" | "dashdot" | "longdashdot"
                                },
                                yaxis: {
                                    range: [-0.005, 1.1],
                                    title: {
                                        text: 'Absorption Coefficient',
                                        font: {
                                            color: 'black',
                                            size: 10
                                        },
                                        standoff: 25,
                                    },

                                    gridcolor: '#b6b6b6',
                                    griddash: 'dot',
                                    zeroline: false,

                                },
                                margin: {
                                    l: 54,
                                    r: 10,
                                    b: 40,
                                    t: 2,
                                    pad: 5,
                                },

                                paper_bgcolor: 'transparent',
                                plot_bgcolor: 'transparent',
                                font: {
                                    family: 'Inter, Helvetica, Arial',
                                    size: 11,
                                },
                            }}
                            useResizeHandler={true}
                        />
                    </div>

                </div>

            </DialogContent>
            <DialogActions>

                <div>
                    <DefaultButton
                        icon={<RestartAlt/>}
                        label='Reset form'
                        disabled={isCreatingMaterial}
                        onClick={resetForm}
                    />
                </div>
                <div>
                    <SuccessButton
                        icon={<Done/>}
                        label="Create material"
                        disabled={!isFormValid}
                        onClick={handleCreateMaterial}
                    />
                </div>
            </DialogActions>
        </Dialog>
    );
};
