import React, {FC, useState} from 'react';
import FileDownloadDoneIcon from '@mui/icons-material/FileDownloadDone';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import NewReleasesOutlinedIcon from '@mui/icons-material/NewReleasesOutlined';

/**
 *
 * Assets
 */
// import image from '@/assets/images/arrow-gif.gif'

/**
 * Styles
 */
import classes from './classes.module.scss';

/**
 *
 * Types
 */
export type UploaderProps = {
    accept: string;
    title?: string;
    disabled?: boolean;
    acceptText: string;
    onDrop: (event: React.DragEvent<HTMLElement>) => void;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const Uploader: FC<UploaderProps> = (
    {
        title = 'Drop the file here to upload',
        accept,
        onDrop,
        disabled,
        onChange,
        acceptText,
    }) => {
    const [
        fileName,
        setFileName
    ] = useState<string | null>(null);


    const validation = (file: File) => {
        const uploadedType = (file.name.split('.').pop())?.toString().toLowerCase();

        if (uploadedType && !accept.includes(uploadedType)) {
            alert('Invalid file type');
            return false;
        } else return true;
    };

    const events = {

        onDragOver: (e: React.DragEvent<HTMLElement>) => {
            e.preventDefault();
            e.stopPropagation();
        },

        onDrop: (e: React.DragEvent<HTMLElement>) => {
            e.preventDefault();
            e.stopPropagation();

            const file = e.dataTransfer.files[0];
            if (file) {
                if (!validation(file)) return;

                setFileName(file.name);
            }
            onDrop(e);
        },
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e?.target?.files?.[0]) {
            const file = e.target.files[0];
            if (!validation(file)) return;

            setFileName(file.name);
        }else {
            setFileName('');
        }
        onChange(e);
    };

    return (
        <div className={`${classes.container} ${disabled ? classes.disabled : ''}`}>
            <div className={classes.uploader} >
                {/*{fileName && (<img src={image}/>)}*/}
                <input onChange={handleChange} accept={accept} id="uploader" type="file"/>
                <label htmlFor="uploader" {...events}>
                    <div className={classes.uploader_content}>
                        {fileName ? (
                            <div className={classes.header}>
                                <FileDownloadDoneIcon/>
                                <p className={classes.title}> {fileName} </p>
                                <p className={classes.todo}> change file </p>
                            </div>
                        ) : (
                            <div className={classes.header}>
                                {<FileUploadOutlinedIcon/>}
                                <p className={classes.title}> {title} </p>
                                <p className={classes.todo}> or click to browse </p>
                            </div>
                        )}
                        {acceptText && (
                            <div className={classes.accept_text}>
                                <NewReleasesOutlinedIcon/> {acceptText}
                            </div>
                        )}
                    </div>

                </label>
            </div>
        </div>
    );
};
