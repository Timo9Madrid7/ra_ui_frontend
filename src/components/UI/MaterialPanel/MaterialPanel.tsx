import React from 'react';
import {useEffect, useState, useTransition} from 'react';

/**
 * Context
 * */
import {useAppContext} from '@/context';
import {
    ActionType,
    useMaterialPanelContext
} from './MaterialPanelContext.tsx';


/**
 * Components
 **/
import {
    IconButton
} from "@mui/material";
import {
    MaterialRow,
    MaterialDetails,
} from './components'

/**
 *
 * Types
 * */
import {
    Material,
    GroupedMaterial
} from '@/types';

/**
 * Assets
 **/
import classes from './classes.module.scss'
import {
    CloseRounded,
    SearchRounded,
    LayersOutlined
}
    from "@mui/icons-material";
import {EMPTY_MATERIAL_NAME} from "@/constants";
import {DefaultButton} from "@/components";

export const MaterialPanel = () => {
    const {highlightedMaterialId} = useMaterialPanelContext();

    const {
        appState: {filteredMaterials},
    } = useAppContext();

    const [
        groupedMaterials,
        setGroupedMaterial
    ] = useState<GroupedMaterial>({});

    const [searchValue, setSearchValue] = useState<string>('');

    const [, startTransition] = useTransition();

    useEffect(() => {
        searchAndFilterMaterials(searchValue);
    }, [searchValue, filteredMaterials]);

    /**
     * Function: group the materials by category
     *
     * @param {Material[]} materials : list of all materials
     */
    const groupByCategory = (materials: Material[]) => {
        return materials.filter((material) => material.name !== EMPTY_MATERIAL_NAME).reduce(
            (groups: GroupedMaterial, currentMaterial) => {
                const group: Material[] = groups[currentMaterial.category] || [];
                group.push(currentMaterial)
                groups[currentMaterial.category] = group;

                return groups;
            }, {}
        );
    };

    /**
     * Function: filter down list of materials based on the given search value
     *
     * @param {string} searchValue : string to be searched in the materials
     */
    const searchAndFilterMaterials = (searchValue: string) => {
        let searchedMaterials = filteredMaterials;
        if (searchValue) {
            searchedMaterials = filteredMaterials.filter((material) => {
                const parsedValue = searchValue.trim().toLowerCase();
                if (
                    material.name.toLowerCase().includes(parsedValue) ||
                    material.category.toLowerCase().includes(parsedValue)
                ) {
                    return true
                }
            });
        }

        const materialGrouping = groupByCategory(searchedMaterials);

        startTransition(() => {
            setGroupedMaterial(materialGrouping);
        });
    };


    const {dispatch} = useMaterialPanelContext();

    const closePanel = () => {
        dispatch({
            type: ActionType.CLOSE_MATERIALS_PANEL,
        });
    };


    return (
        <div className={classes.panel_container}>
            <div className={classes.panel_header}>
                <div className={classes.title}>
                    <LayersOutlined/> <h5>Materials</h5>
                </div>
                <DefaultButton label='Create a new material' sx={{ width:'auto'}}/>
                <IconButton
                    name="Close panel"
                    onClick={closePanel}>
                    <CloseRounded/>
                </IconButton>
            </div>

            <div className={classes.panel_content}>
                <div className={classes.search_container}>
                    <SearchRounded/>
                    <input
                        onChange={
                            (e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)
                        }
                        type="text"
                        placeholder='Search to filter ...'/>
                </div>

                <div className={classes.materials_container}>
                    <ul className={classes.materials}>
                        {Object.keys(groupedMaterials).map(
                            (category: string, categoryIndex: number) => (
                                <li key={categoryIndex}>
                                    <p className={classes.category_title}>{category}</p>
                                    <ul>
                                        {groupedMaterials[category].map(
                                            (material: Material, index: number) => (
                                                <MaterialRow
                                                    index={index}
                                                    key={`unique-${material.id}`}
                                                    material={material}
                                                    categoryIndex={categoryIndex}
                                                />
                                            ))}
                                    </ul>
                                </li>
                            )
                        )}
                    </ul>
                    {highlightedMaterialId && <MaterialDetails materialId={highlightedMaterialId}/>}
                </div>


            </div>
        </div>
    );
};
