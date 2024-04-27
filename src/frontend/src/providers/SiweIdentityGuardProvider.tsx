import {ReactNode, useEffect, useState} from "react";
import {useSiweIdentity} from "ic-use-siwe-identity";
import {useAccount} from "wagmi";

const SiweIdentityGuardProvider = (props: {
    children: ReactNode
}) => {
    const {children} = props;
    const [isSigning, setIsSigning] = useState(false);

    const { isConnected, address } = useAccount();

    const {
        clear,
        identity,
        identityAddress,
        isPrepareLoginIdle,
        isInitializing,
        prepareLogin,
        prepareLoginError,
        loginError,
        login
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

    useEffect(() => {
        if (!isPrepareLoginIdle || !isConnected || !address) return;
        prepareLogin();
    }, [isConnected, address, prepareLogin, isPrepareLoginIdle]);

    useEffect(() => {
        if (prepareLoginError) {
            // todo: show an error toast with message: `prepareLoginError.message`
        }
    }, [prepareLoginError]);

    useEffect(() => {
        if (loginError) {
            // todo: show an error toast with message: `loginError.message`
            // todo: disconnect wallet
        }
    }, [loginError]);

    useEffect(() => {
        if (address && !isInitializing && !identityAddress && !isSigning) {
            setIsSigning(true);
            login().then(() => {
                setIsSigning(false);
            }).catch(() => {
                setIsSigning(false);
                // todo: disconnect wallet
            });
        }
    }, [address, isInitializing, identityAddress, login, isSigning]);

    return children;
}

export default SiweIdentityGuardProvider;