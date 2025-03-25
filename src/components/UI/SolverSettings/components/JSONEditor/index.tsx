import { JsonEditor } from 'json-edit-react'

export const JSONEditor = ({
    settingState,
    setSettingState
}: {
    settingState: {
        [key: string]: any;
    };
    setSettingState: React.Dispatch<React.SetStateAction<{
        [key: string]: any;
    }>>
    }) => {
    return <div>
            <JsonEditor
                data={ settingState }
                setData={ (data) => {
                    setSettingState(data as any)
                }}
            />
    </div>
};