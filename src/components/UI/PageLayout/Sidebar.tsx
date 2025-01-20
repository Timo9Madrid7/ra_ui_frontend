/** Components */
import {Divider} from '@mui/material';

import {DefaultButton} from "@/components";
import GitHubIcon from '@mui/icons-material/GitHub';
/** Context */
import SourceIcon from '@mui/icons-material/Source';

/** Styles */
import classes from './styles.module.scss';
import image from '@/assets/images/audio-waves.png';
import soundImage from '@/assets/images/sound_image.webp'
import {ReactNode} from "react";


type SidebarProps = {
    withWelcome?: boolean,
    toolbar?: ReactNode,
}

// TODO: later replace it with drawer mui
export const Sidebar = (
    {
        withWelcome = true,
        toolbar = null
    }: SidebarProps) => {


    const handleClick = (url: string) => {
        window.open(url, '_blank', 'noreferrer');
    };

    return (
        <div className={classes.sidebar}>

            {toolbar
                ? toolbar
                : <div className={classes.image_sidebar}></div>
            }

            {withWelcome && (
                <>
                    <div className={classes.welcome}>
                        <Divider style={{whiteSpace: 'normal', fontSize: 12}}>
                            CHORAS
                        </Divider>
                        <h5>
                            <center>
                            Welcome to the <br/><br/>
                            Community Hub for Open-source Room Acoustics Software (CHORAS)<br/>
                            <br/>
                            - Open Source and Free! -
                            </center>
                        </h5>
                        <div className={classes.message}>
                            To import your room geometry use <span
                            className={classes.highlight}>Import geometry (Model)</span> on
                            the home page.
                        </div>

                        <div className={classes.links}>
                            <DefaultButton
                                label={'Repository'}
                                icon={<GitHubIcon/>}
                                onClick={() => {
                                    handleClick('https://github.com')
                                }}
                            />
                            <DefaultButton
                                label={'Document'}
                                icon={<SourceIcon/>}
                                onClick={() => {
                                    handleClick('https://github.com')
                                }}
                            />
                        </div>
                        <div className={classes.img_container}>
                            <img src={image} alt=""/>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
