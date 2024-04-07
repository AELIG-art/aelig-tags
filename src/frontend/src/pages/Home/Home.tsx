import React from "react";
import { useConnectionStatus } from "@thirdweb-dev/react";
import CertificatesList from "./CertificatesList";
import Disconnected from "./Disconnected";
import Loading from "./Loading";

const Home = () => {
    const connectionStatus = useConnectionStatus();

    switch (connectionStatus) {
        case "connected":
            return <CertificatesList />;
        case "disconnected":
            return <Disconnected />;
        default:
            return <Loading />;
    }
};

export default Home;
