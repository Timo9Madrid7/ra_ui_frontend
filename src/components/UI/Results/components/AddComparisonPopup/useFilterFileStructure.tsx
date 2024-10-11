import { TreeStructure } from '@/components/Shared/TreeView/types';
import {array} from "yup";

export const useFilterFileStructure = () => {
  // recursive function to set isOpen true for the branches that are being filtered
  const filterFileStructure = (input: string, fileStructure: TreeStructure, shouldHide: boolean = false) => {
    const newFileStructure = Object.keys(fileStructure).reduce((newStructure, objectKey) => {
      const parsedInput = input;
      let currentItem = fileStructure[objectKey];
      if (currentItem.id === input) {
        currentItem.meta.scroll = true;
      }
      // if current item includes the simulation name
      if (
        (currentItem.meta.simulationNames &&
          currentItem.meta.simulationNames.find((element: any) => element.includes(parsedInput))) ||
        (currentItem.meta.simulationIds &&
          currentItem.meta.simulationIds.find((element: any) => element.includes(parsedInput)))
      ) {
        currentItem.isOpen = true;

        if (currentItem.children && Object.keys(currentItem.children).length > 0) {
          currentItem.children = filterFileStructure(parsedInput, currentItem.children, shouldHide);
        }
      } else {
        // if current item does NOT include the simulation name AND we want to hide it
        if (shouldHide) {
          // if the current item is a simulation (has no children)
          if (currentItem.children && Object.keys(currentItem.children).length === 0) {
            // AND the simulation name includes the searched term
            if (!currentItem.name.toLowerCase().includes(parsedInput)) {
              currentItem.isHidden = true;
            }
          } else {
            // if the current item is not a simulation
            currentItem.isHidden = true;
          }
        }
      }
      return {
        ...newStructure,
        [objectKey]: { ...currentItem },
      };
    }, {});

    return newFileStructure;
  };
  return filterFileStructure;
};
