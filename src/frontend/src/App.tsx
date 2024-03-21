import React, { useEffect, useState } from 'react';
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home/Home";
import DefaultLayout from "./layouts/DefaultLayout/DefaultLayout";
import { initJuno } from "@junobuild/core";
import Tag from "./pages/Tag/Tag";
import { SATELLITE_ID, THIRDWEB_CLIENT_ID } from "./utils/constants";
import Admin from "./pages/Admin/Admin";
import Verification from "./pages/Verification/Verification";
import VerificationLayout from "./layouts/VerificationLayout/VerificationLayout";
import {AuthClientContext} from "./contexts/AuthClientContext";

function App() {
    const [junoLoaded, setJunoLoaded] = useState(false);

    useEffect(() => {
        initJuno({satelliteId: SATELLITE_ID}).then(() => {
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

    return junoLoaded ? <ThirdwebProvider clientId={THIRDWEB_CLIENT_ID}>
        <AuthClientContext>
            <RouterProvider router={router} />
        </AuthClientContext>
    </ThirdwebProvider> : null;
}

export default App;
