import {
    useEffect,
    useState
} from 'react';


/**
 * Components
 * */
import {
    Sidebar,
    PageLayout,
    ProjectsView,
    IDropdownOptions,
    ProjectsViewManager,
    RecentSimulationNav
} from '@/components';

/**
 *
 * Hooks
 * */
import {useGetProjects} from "@/hooks";

/**
 * Types
 * **/
import {Project} from "@/types";
import {ModelProvider, SimulationProvider} from "@/context";

export const Home = () => {

    const {data: availableProjects, isLoading} = useGetProjects();
    const [filter, setFilter] = useState('all');
    const [groups, setGroups] = useState<IDropdownOptions[]>([]);
    const [viewType, setViewType] = useState('grid');
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        if (availableProjects && availableProjects.length > 0) {
            setProjects(availableProjects);
        }
    }, [availableProjects]);

    useEffect(() => {
        if (projects.length) {
            const options: IDropdownOptions[] = projects.map((project) => {
                return {value: project.group || 'none', label: project.group || 'None'};
            });
            setGroups(options);
        } else {
            setGroups([])
        }
    }, [projects]);
    const shouldShowItem = (group: string): boolean => {

        return ((filter === 'all') || !group)
            ? true
            : (group === filter);
    };

    return (
        <ModelProvider>
            {/*TODO: think about this: how to solve etc*/}
            <SimulationProvider>
                <PageLayout
                    isFetching={isLoading}
                    extraHeader={
                        <ProjectsViewManager
                            filterOptions={groups}
                            onFilter={setFilter}
                            setViewType={setViewType}
                        />
                    }
                    sidepanel={<Sidebar/>}
                    sidepanelExtraHeader={<RecentSimulationNav/>}>


                    <ProjectsView
                        projects={projects}
                        setProjects={setProjects}
                        groups={groups}
                        shouldShowItem={shouldShowItem}
                        viewType={viewType}
                    />
                </PageLayout>
            </SimulationProvider>
        </ModelProvider>
    );
};
