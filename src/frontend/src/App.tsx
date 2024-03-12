import React, { useEffect, useState } from 'react';
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home/Home";
import DefaultLayout from "./layouts/DefaultLayout/DefaultLayout";
import { initJuno } from "@junobuild/core";
import Tag from "./pages/Tag/Tag";
import { satelliteId, thirdWebClientIt } from "./utils/constants";
import Admin from "./pages/Admin/Admin";
import Verification from "./pages/Verification/Verification";
import VerificationLayout from "./layouts/VerificationLayout/VerificationLayout";

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
            element: <DefaultLayout />,
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
        },
        {
            path: "/",
            element: <VerificationLayout />,
            children: [
                {
                    path: "/verification/:msg",
                    element:  <Verification />
                }
            ]
        }
    ]);

    return junoLoaded ? <ThirdwebProvider clientId={thirdWebClientIt}>
        <RouterProvider router={router} />
    </ThirdwebProvider> : null;
}

export default App;
