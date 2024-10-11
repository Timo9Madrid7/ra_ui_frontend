import {GuideGroup} from "@/enums";

export const steps: { selector: string; content: string, group: GuideGroup}[] = [
    {
        selector: '#import_geometry_button',
        content: "Import a new room geometry into the system to seamlessly update or " +
            "expand the existing layout. This allows for accurate modeling and enhanced visualization of the space.",
        group: GuideGroup.HOME
    },
    {
        selector: "[data-tour='filter_projects_by_group']",
        content: "By this dropdown button, you are able to filter down the projects based on their group.",
        group: GuideGroup.HOME
    },
    {
        selector: '#model_of_a_project_container',
        content: "This section contains all the models in which belongs to the project you have selected!",
        group: GuideGroup.PROJECT
    },

]
