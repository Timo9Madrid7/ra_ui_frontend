import * as React from 'react';
import {FC} from 'react';
import {styled} from '@mui/material/styles';
import {
    Step,
    Stack,
    StepLabel,
    StepConnector,
    StepIconProps,
    stepConnectorClasses,
    Stepper as BaseStepper,
} from '@mui/material';

const Connector = styled(StepConnector)(() => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 22,
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundImage:
                'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundImage:
                'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        height: 3,
        border: 0,
        backgroundColor: '#b7b6b6',
        borderRadius: 1,
    },
}));

const StepIconBase = styled('div')<{
    ownerState: { completed?: boolean; active?: boolean };
}>(({ownerState}) => ({
    backgroundColor: '#b7b6b6',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    ...(ownerState.active && {
        backgroundImage:
            'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
        boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    }),
    ...(ownerState.completed && {
        backgroundImage:
            'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    }),
}));

interface CustomizedStepperProps {
    steps: string[];
    icons: { [index: string]: React.ReactElement };
    activeStep: number;
}

function StepIcon(props: StepIconProps & { icons: { [index: string]: React.ReactElement } }) {
    const {active, completed, className, icon, icons} = props;

    return (
        <StepIconBase ownerState={{completed, active}} className={className}>
            {icons[String(icon)]}
        </StepIconBase>
    );
}

export const Stepper: FC<CustomizedStepperProps> = ({steps, icons, activeStep}) => {
    return (
        <Stack sx={{width: '90%', margin: 'auto', paddingBottom: '20px'}}  spacing={4}>
            <BaseStepper alternativeLabel activeStep={activeStep} connector={<Connector/>}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel StepIconComponent={(props) => <StepIcon {...props} icons={icons}/>}>
                            {label}
                        </StepLabel>
                    </Step>
                ))}
            </BaseStepper>
        </Stack>
    );
};

