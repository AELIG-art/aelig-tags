import React from 'react';
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home/Home";
import NewTag from "./pages/NewTag/NewTag";
import Layout from "./Layout";

function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Layout />,
            children: [
                {
                    path: '/',
                    element: <Home/>
                },
                {
                    path: "/newTag",
                    element: <NewTag />
                }
            ]
        }
    ]);

    return <ThirdwebProvider>
        <RouterProvider router={router} />
    </ThirdwebProvider>;
}

export default App;
