import {Outlet, useLocation} from 'react-router-dom';
import {Toaster} from 'react-hot-toast';


/**
 *
 * Components */
import {AppProvider} from "@/context";
import {steps} from "@/guidance";
import {TourProvider} from "@reactour/tour";
import {GuideGroup} from "@/enums";
import {useMemo} from "react";

export const Root = () => {
    const location = useLocation();
    const filteredSteps = useMemo(() => {
        return steps.filter(step => {
            if (location.pathname.includes('project'))
                return step.group === GuideGroup.PROJECT;
            else if (location.pathname.includes('editor'))
                return step.group === GuideGroup.EDITOR;
            else if (location.pathname.includes('result'))
                return step.group === GuideGroup.RESULT
            else return step.group === GuideGroup.HOME
        });
    }, [location.pathname])
    return (
        <TourProvider steps={filteredSteps} showNavigation={true} key={location.pathname}>
            <AppProvider>
                <Outlet/>
                <Toaster
                    position="top-right"
                    reverseOrder={false}
                    containerStyle={{top: 70}}
                    toastOptions={{
                        duration: 5000,
                        style: {
                            padding: '10px'
                        },
                        success: {
                            style: {
                                border: '1px solid green',
                            }
                        },
                        error: {
                            style: {
                                border: '1px solid darkred'
                            }
                        }
                    }}/>
            </AppProvider>
        </TourProvider>
    );
};
