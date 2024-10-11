import {createTheme} from '@mui/material/styles';
import colors from './colors.module.scss';

export const raTheme = createTheme({

        typography: {
            fontFamily: [
                'Inter',
                'Helvetica',
                'sans-serif',
            ].join(','),
        },
        components: {
            MuiFormControl: {
                styleOverrides: {
                    root: {
                        width: '100%',
                        fontSize: '12px',
                        margin: '5px 0px',
                    },
                },
            },
            MuiTypography: {
                styleOverrides: {
                    root: {
                        fontSize: '13px'
                    }
                }
            },
            MuiFormGroup: {
                styleOverrides: {
                    root: {
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }
                }
            },
            MuiTextField: {
                styleOverrides: {
                    root: {
                        '& .MuiInputBase-root': {
                            fontSize: '13px',
                            borderRadius: '2px',
                            letterSpacing: '0.05em',
                        },
                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderWidth: '1px',
                        }
                    },
                },
            },
            MuiFormLabel: {
                styleOverrides: {
                    root: {
                        fontSize: '13px'
                    }
                }
            },
            MuiSelect: {
                styleOverrides: {
                    root: {
                        color: "black",
                        borderRadius: '2px',

                        '.Mui-disabled': {}
                    },
                },
            },
            MuiList: {
                styleOverrides: {
                    root: {
                        padding: 0,
                        backgroundColor: colors.raGreenLike,
                        letterSpacing: '0.05em',
                        borderRadius: 0,
                    },

                },
            },
            MuiMenuItem: {
                styleOverrides: {
                    root: {
                        backgroundColor: colors.raGreenLike,
                        color: "black",
                        fontWeight: 500,
                        padding: 10,
                        fontSize: '13px',
                        letterSpacing: '0.05em',
                        '&:hover': {
                            backgroundColor: colors.raGreenLikeHover,
                            transition: '0.2s background, 0.25s color, 0.15s border-color, 0.5s margin, 0.4s opacity',

                        },
                        '&.Mui-selected': {
                            fontWeight: 'bold',
                            backgroundColor: '#ececae',
                            '&:hover': {
                                backgroundColor: colors.raGreenLikeHover,
                            }
                        },
                    },
                },
            },
            MuiTabs: {
                styleOverrides: {
                    root: {},
                    indicator: {
                        backgroundColor: colors.raDarkPurple,
                    },
                    flexContainer: {}
                },
            },
            MuiTab: {
                styleOverrides: {
                    root: {
                        color: colors.raGray400,
                        // backgroundColor: '#c4dbc8',
                        textTransform: "none",
                        fontSize: '13px',
                        letterSpacing: 0.3,
                        padding: '12px 0',
                        '&.Mui-selected': {
                            backgroundColor: 'transparent',
                            color: colors.raDarkPurple,
                            transition: '1s background',
                        },
                    },
                },
            },
            MuiRadio: {
                styleOverrides: {
                    root: {
                        '&.Mui-checked': {
                            color: colors.raDarkPurple,
                        },
                    }
                }
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundColor: '#dcf6f2',
                        padding: 0,
                    },
                },
            },
            MuiDialog: {
                styleOverrides: {
                    root: {},
                    paper: {
                        backgroundImage: "none",
                        fontSize: '12px',
                        backgroundColor: colors.raGray1000,
                        padding: "20px 20px",
                        minWidth: '350px',
                        borderRadius: '4px',

                    }
                },
            },
            MuiDialogTitle: {
                styleOverrides: {
                    root: {
                        display: 'flex',
                        height: '50px',
                        padding: '0px 10px',
                        fontSize: "16px",
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        color: colors.raBlack,
                        margin: '0px 0px 10px',
                        letterSpacing: '0.05em'
                    },
                },
            },
            MuiDialogContent: {
                styleOverrides: {
                    root: {
                        padding: '20px 0px !important',
                        borderTop: `1px solid ${colors.raGray800}`,
                        letterSpacing: '0.05em',
                        overflow: "hidden",
                    },
                },
            },
            MuiDialogContentText: {
                styleOverrides: {
                    root: {
                        fontSize: '12px',
                        padding: '10px',
                        color: colors.raBlack,
                        letterSpacing: '0.05em'
                    },
                },
            },
            MuiDialogActions: {
                styleOverrides: {
                    root: {
                        display: "flex",
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                        padding: 0,
                        margin: 0,
                        button: {
                            margin: '10px 0px 0px'
                        },
                    },

                },
            },
            MuiTableRow: {
                styleOverrides: {
                    root: {
                        borderBottom: '1px solid black',
                    }
                }
            },
            MuiTableCell: {
                styleOverrides: {
                    root: {
                        borderBottom: "none",
                        textAlign: "center",
                        padding: '12px'
                    }
                }
            }
        },
        palette:
            {
                mode: 'light',
                secondary:
                    {
                        main: colors.raBlack,
                    }
                ,
                text: {
                    primary: colors.raBlack,
                }
                ,
                background: {
                    default:
                    colors.raGray100,
                    paper:
                    colors.raGray200,
                }
                ,
                error: {
                    main: colors.raRed,
                }
                ,
                warning: {
                    main: colors.raOrange,
                }
                ,
                info: {
                    main: colors.raLightBlue,
                }
                ,
                action: {
                    disabled: colors.raGray1200,
                }
                ,
            }
        ,
    })
;
