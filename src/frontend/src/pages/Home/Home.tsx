import React from "react";
import Disconnected from "./Disconnected";
import Loading from "./Loading";
import {useSiweIdentity} from "ic-use-siwe-identity";
import Connected from "./Connected";

const Home = () => {
    const { isInitializing, identityAddress } = useSiweIdentity();

    if (isInitializing) {
        return <Loading />;
    } else {
        return identityAddress ? <Connected /> : <Disconnected />;
    }
};

export default Home;
