import React from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home/Home";
import DefaultLayout from "./layouts/DefaultLayout/DefaultLayout";
import Tag from "./pages/Tag/Tag";
import '@rainbow-me/rainbowkit/styles.css';
import Admin from "./pages/Admin/Admin";
import Verify from "./pages/Verify/Verify";
import VerificationLayout from "./layouts/VerifyLayout/VerifyLayout";
import {AuthClientContext} from "./contexts/AuthClientContext";
import WalletConnectProvider from "./providers/WalletConnectProvider";
import { SiweIdentityProvider } from "ic-use-siwe-identity";
import {_SERVICE} from "./declarations/ic_siwe_provider/ic_siwe_provider.did";
import {canisterId, idlFactory} from "./declarations/ic_siwe_provider";
import SiweIdentityGuardProvider from "./providers/SiweIdentityGuardProvider";
import {SnackbarProvider} from "notistack";

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
                    element:  <Verify />
                }
            ]
        }
    ]);

    return <SnackbarProvider>
        <WalletConnectProvider>
            <SiweIdentityProvider<_SERVICE>
                canisterId={canisterId}
                idlFactory={idlFactory}
            >
                <SiweIdentityGuardProvider>
                        <AuthClientContext>
                            <RouterProvider router={router} />
                        </AuthClientContext>
                </SiweIdentityGuardProvider>
            </SiweIdentityProvider>
        </WalletConnectProvider>
    </SnackbarProvider>;
}

export default App;
