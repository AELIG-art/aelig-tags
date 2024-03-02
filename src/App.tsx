import React, { useEffect, useState } from 'react';
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home/Home";
import Layout from "./Layout";
import { initJuno } from "@junobuild/core";
import Tag from "./pages/Tag/Tag";
import { satelliteId, thirdWebClientIt } from "./utils/constants";
import Admin from "./pages/Admin/Admin";

function App() {
    const [junoLoaded, setJunoLoaded] = useState(false);

    useEffect(() => {
        initJuno({satelliteId}).then(() => {
            setJunoLoaded(true);
        });
    }, []);

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
                    path: "admin",
                    element: <Admin />
                },
                {
                    path: "tag/:id",
                    element: <Tag />
                }
            ]
        }
    ]);

    return junoLoaded ? <ThirdwebProvider clientId={thirdWebClientIt}>
        <RouterProvider router={router} />
    </ThirdwebProvider> : null;
}

export default App;
