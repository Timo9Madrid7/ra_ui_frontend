/**
 * Routing
 * */
import {
    RouterProvider,
    createBrowserRouter
} from 'react-router-dom';

/**
 * Theme
 */
import {raTheme} from '@/theme/Theme.ts';
import {ThemeProvider, StyledEngineProvider} from '@mui/material/styles';


import {
    Home,
    Root,
    Error,
    EditorPage,
    Project
} from '@/pages';

/**
 * Hooks for fetching, caching and updating asynchronous data
 */
import {QueryClient, QueryClientProvider, QueryCache} from '@tanstack/react-query';


/**
 * Client side routing with React Router
 */
const router = createBrowserRouter([
    {
        path: '/',
        element: <Root/>,
        errorElement: <Error
            title={"something went wrong!"}
            errorInfo={"The page you are trying to access is not available!"}
        />,
        children: [
            {
                path: '/',
                element: <Home/>,
            },

            {
                path: 'projects',
                element: <Home/>,
            },
            {
                path: 'projects/:id',
                element: <Project/>,
            },
            {
                path: 'results',
                element: <EditorPage showResults={true}/>,
            },
            {
                path: 'editor',
                element: <EditorPage/>,
            }
        ],
    }
]);


/**
 * Create a client query and config the cache
 */
const queryClient = new QueryClient({
    queryCache: new QueryCache({
        onError: (error, query) => {
            if (query.state.data !== undefined) {
                // TODO: how to handle errors? maybe a place to show the error or external sources
            }
        },
    }),
});

const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={raTheme}>
                <StyledEngineProvider injectFirst>
                    <RouterProvider router={router}/>
                </StyledEngineProvider>
            </ThemeProvider>
        </QueryClientProvider>
    );
};

export default App;
