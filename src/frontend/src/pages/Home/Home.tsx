import React from "react";
import { useConnectionStatus } from "@thirdweb-dev/react";
import TagsList from "./TagsList";
import Disconnected from "./Disconnected";
import Loading from "./Loading";

const Home = () => {
    const connectionStatus = useConnectionStatus();

    switch (connectionStatus) {
        case "connected":
            return <TagsList />;
        case "disconnected":
            return <Disconnected />;
        default:
            return <Loading />;
    }
};

export default Home;
