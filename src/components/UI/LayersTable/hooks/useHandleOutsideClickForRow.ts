import { useMaterialPanelContext, ActionType } from '@/components/UI/MaterialPanel';
import { useEditorContext, ActionType as EdActionType } from '@/context/EditorContext';

export const useHandleOutsideClickForRow = () => {
  const { dispatch: editorDisp } = useEditorContext();
  const { dispatch } = useMaterialPanelContext();

  const handleOutsideClickForRow = (event: any) => {
    // de-select layer if user clicks anywhere the sidepanel component, that is not a layer row, button or dropdown

    if (
      event.target.matches('.simulations.container.panel *')
    ) {
      window.removeEventListener('click', handleOutsideClickForRow);
      // @ts-ignore prevent global event listener for being added multiple times
      window.eventAddedForOutsideClick = false;
      dispatch({
        type: ActionType.CLOSE_MATERIALS_PANEL,
      });
      dispatch({
        type: ActionType.SET_MULTI_SELECT_ITEMS,
        multiSelectedItemIds: [],
      });
      editorDisp({
        type: EdActionType.CLEAR_SELECTED,
      });
    }
  };
  return handleOutsideClickForRow;
};
