/** Context */
import { ActionType as EditorActionType, useEditorContext } from '@/context/EditorContext';

//TODO: moves these hooks to the root folder Hassan

export const usePoints = () => {
  const { dispatch: editorDispatch, isInResultsMode } = useEditorContext();

  const handleSelectionChange = (pointId?: string, pointType?: 'SourcePoint' | 'ReceiverPoint' | 'GridReceiver') => {
    if (isInResultsMode) return;

    if (pointId && pointType) {
      editorDispatch({
        type: EditorActionType.SET_SELECTED,
        selected: { type: pointType, id: pointId },
      });
    } else {
      editorDispatch({
        type: EditorActionType.CLEAR_SELECTED,
      });
    }
  };

  return {
    handleSelectionChange,
  };
};
