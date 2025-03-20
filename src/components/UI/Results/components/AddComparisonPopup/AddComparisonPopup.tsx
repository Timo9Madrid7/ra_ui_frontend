/** Components */
import { Dialog, useCreateTreeView } from '@/components';
import { DialogContent } from '@mui/material';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { NewComparion } from '../../types';

import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import {
    useResultsContext,
    ActionType,
} from '@/components/UI/Results/context/ResultsContext.tsx';

const POPUP_TITLE = 'Add simulation';

export const AddComparisonPopup = ({
    showPopup,
    setShowPopup,
}: {
    showPopup: boolean;
    setShowPopup: (showPopup: boolean) => void;
}) => {
    const { allProjectsWithSims, dispatch } = useResultsContext();
    const treeView = useCreateTreeView(allProjectsWithSims);

    const addComparison = (modelName, projectName, simulation) => {
        const newComparison: NewComparion = {
            selectedSimulation: simulation,
            modelName: modelName,
            projectName: projectName,
        };
        setShowPopup(false);
        dispatch({ type: ActionType.ADD_COMPARISON, newComparison });
    };

    return (
        <Dialog
            width='400px'
            height='472px'
            hideBackdrop={false}
            aria-labelledby={POPUP_TITLE}
            sx={{ fontSize: '12px', minHeight: '400px' }}
            open={showPopup}
            title={POPUP_TITLE}
            onClose={() => setShowPopup(false)}
        >
            <DialogContent>
                <SimpleTreeView>
                    {treeView &&
                        treeView.length &&
                        treeView.map((groupByGroup, index) => (
                            <TreeItem
                                key={groupByGroup.label + '-' + index}
                                itemId={groupByGroup.label + '-' + index}
                                label={groupByGroup.label}
                            >
                                {groupByGroup.children.map(
                                    (groupByProject, projIndex) => (
                                        <TreeItem
                                            key={
                                                groupByProject.label +
                                                '-' +
                                                index +
                                                '-' +
                                                projIndex
                                            }
                                            itemId={
                                                groupByProject.label +
                                                '-' +
                                                index +
                                                '-' +
                                                projIndex
                                            }
                                            label={groupByProject.label}
                                        >
                                            {groupByProject.children.map(
                                                (object, objIndex) => (
                                                    <TreeItem
                                                        key={
                                                            object.label +
                                                            '-' +
                                                            index +
                                                            '-' +
                                                            projIndex +
                                                            '-' +
                                                            objIndex
                                                        }
                                                        itemId={
                                                            object.label +
                                                            '-' +
                                                            index +
                                                            '-' +
                                                            projIndex +
                                                            '-' +
                                                            objIndex
                                                        }
                                                        label={object.label}
                                                    >
                                                        {object.children.map(
                                                            (
                                                                simulation,
                                                                simIndex
                                                            ) => (
                                                                <TreeItem
                                                                    key={
                                                                        simIndex
                                                                    }
                                                                    itemId={
                                                                        simulation.label
                                                                    }
                                                                    onClick={() => {
                                                                        addComparison(
                                                                            object.label,
                                                                            groupByProject.label,
                                                                            simulation.obj
                                                                        );
                                                                    }}
                                                                    label={
                                                                        simulation.label
                                                                    }
                                                                />
                                                            )
                                                        )}
                                                    </TreeItem>
                                                )
                                            )}
                                        </TreeItem>
                                    )
                                )}
                            </TreeItem>
                        ))}
                </SimpleTreeView>
                {/*<AddComparisonContent setShowPopup={setShowPopup} />*/}
            </DialogContent>
        </Dialog>
    );
};
