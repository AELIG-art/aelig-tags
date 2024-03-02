import React, { useEffect } from 'react';
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home/Home";
import Layout from "./Layout";
import { initJuno } from "@junobuild/core";
import Tag from "./pages/Tag/Tag";
import { thirdWebClientIt } from "./utils/constants";
import Admin from "./pages/admin/Admin";

function App() {
    useEffect(() => {
        (async () =>
            await initJuno({
                satelliteId: "fq2tz-xqaaa-aaaal-adv3q-cai"
            }))();
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

    return <ThirdwebProvider clientId={thirdWebClientIt}>
        <RouterProvider router={router} />
    </ThirdwebProvider>;
}

export default App;
