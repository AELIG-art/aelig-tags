import {ReactNode, useEffect} from "react";
import {useSiweIdentity} from "ic-use-siwe-identity";
import {useAccount} from "wagmi";

const SiweIdentityGuardProvider = (props: {
    children: ReactNode
}) => {
    const {children} = props;

    const { isConnected, address } = useAccount();

    const {
        clear,
        identity,
        identityAddress
    } = useSiweIdentity();

    useEffect(() => {
        if (!isConnected && identity) {
            clear();
        }
    }, [isConnected, clear, identity]);

    useEffect(() => {
        if (identityAddress && address && address !== identityAddress) {
            clear();
        }
    }, [address, clear, identityAddress]);


    return children;
}

export default SiweIdentityGuardProvider;