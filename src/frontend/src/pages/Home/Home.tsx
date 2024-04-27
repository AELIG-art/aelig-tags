import React from "react";
import CertificatesList from "./CertificatesList";
import Disconnected from "./Disconnected";
import Loading from "./Loading";
import {useSiweIdentity} from "ic-use-siwe-identity";

const Home = () => {
    const { isInitializing, identityAddress } = useSiweIdentity();

    if (isInitializing) {
        return <Loading />;
    } else {
        return identityAddress ? <CertificatesList /> : <Disconnected />;
    }
};

export default Home;
