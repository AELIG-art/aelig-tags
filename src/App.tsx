import React from 'react';
import Navbar from "./components/NavBar";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home/Home";

function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Home />,
        },
    ]);

    return <ThirdwebProvider>
        <Navbar />
        <RouterProvider router={router} />
    </ThirdwebProvider>;
}

export default App;
