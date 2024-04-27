import React from "react";
import CertificatesList from "./CertificatesList";
import Disconnected from "./Disconnected";
import Loading from "./Loading";
import {useAccount} from "wagmi";

const Home = () => {
    const {status} = useAccount();

    switch (status) {
        case "connected":
            return <CertificatesList />;
        case "disconnected":
            return <Disconnected />;
        default:
            return <Loading />;
    }
};

export default Home;
