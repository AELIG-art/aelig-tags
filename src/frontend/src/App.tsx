import React from 'react';
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home/Home";
import DefaultLayout from "./layouts/DefaultLayout/DefaultLayout";
import Tag from "./pages/Tag/Tag";
import { THIRDWEB_CLIENT_ID } from "./utils/constants";
import Admin from "./pages/Admin/Admin";
import Verification from "./pages/Verification/Verification";
import VerificationLayout from "./layouts/VerificationLayout/VerificationLayout";
import {AuthClientContext} from "./contexts/AuthClientContext";

function App() {

    const router = createBrowserRouter([
        {
            path: "/",
            element: <DefaultLayout />,
            children: [
                {
                    path: '/',
                    element: <Home />
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
            path: "/verify",
            element: <VerificationLayout />,
            children: [
                {
                    path: "/verify/:msg",
                    element:  <Verification />
                }
            ]
        }
    ]);

    return <ThirdwebProvider clientId={THIRDWEB_CLIENT_ID}>
        <AuthClientContext>
            <RouterProvider router={router} />
        </AuthClientContext>
    </ThirdwebProvider>;
}

export default App;
