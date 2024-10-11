import {ActionType, useEditorContext} from '@/context/EditorContext';
import {useResultsContext} from '@/components';
import {Point} from './Point.tsx'

// import
export const PointContainer = () => {
    const {selected, receivers, sources, isInResultsMode, dispatch} =
        useEditorContext();

    const {selectedComparisonIndex, availableComparisons} = useResultsContext();

    let sourceSelectedResults: string | undefined, receiverSelectedResults: string[] | undefined;

    if (isInResultsMode && availableComparisons) {
        sourceSelectedResults = availableComparisons[selectedComparisonIndex].formState?.sourcePointId;
        receiverSelectedResults = availableComparisons[selectedComparisonIndex].formState?.receiverPointIds;
    }

    const handlePointSelect = (pointId: string, type: 'SourcePoint' | 'ReceiverPoint') => {
        if (selected?.id !== pointId) {
            dispatch({
                type: ActionType.SET_SELECTED,
                selected: {
                    type: type,
                    id: pointId,
                },
            });
        } else {
            dispatch({type: ActionType.CLEAR_SELECTED});
        }
    };

    return (
        <>
            {sources && (
                sources.map((s, index) =>
                    s.x !== undefined && s.y !== undefined && s.z !== undefined ? (
                        <Point
                            key={s.id}
                            id={s.id}
                            index={index}
                            type="SourcePoint"
                            x={s.x}
                            y={s.y}
                            z={s.z}
                            params={s.params}
                            onSelect={handlePointSelect}
                            inEditor={!isInResultsMode}
                            isSelected={
                                !isInResultsMode
                                    ? selected?.type === 'SourcePoint' && selected.id === s.id
                                    : s.id == sourceSelectedResults
                            }
                            validationError={s.validationError}
                        />
                    ) : null
                )
            )}
            {receivers.map((r, index) =>
                r.x !== undefined && r.y !== undefined && r.z !== undefined ? (
                    <Point
                        key={r.id}
                        id={r.id}
                        index={index}
                        type="ReceiverPoint"
                        x={r.x}
                        y={r.y}
                        z={r.z}
                        onSelect={handlePointSelect}
                        inEditor={!isInResultsMode}
                        isSelected={
                            !isInResultsMode
                                ? selected?.type === 'ReceiverPoint' && selected.id === r.id
                                : receiverSelectedResults?.includes(r.id) ?? false
                        }
                        validationError={r.validationError}
                    />
                ) : null
            )}
        </>
    );
};
