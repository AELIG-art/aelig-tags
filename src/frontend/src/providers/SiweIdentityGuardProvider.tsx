import { ReactNode, useEffect, useState } from 'react';
import { useSiweIdentity } from 'ic-use-siwe-identity';
import { useAccount } from 'wagmi';
import { enqueueSnackbar } from 'notistack';

const SiweIdentityGuardProvider = (props: { children: ReactNode }) => {
  const { children } = props;
  const [isSigning, setIsSigning] = useState(false);

  const { isConnected, address, isDisconnected, connector } = useAccount();

  const {
    clear,
    identity,
    identityAddress,
    isPrepareLoginIdle,
    isInitializing,
    prepareLogin,
    prepareLoginError,
    loginError,
    login,
  } = useSiweIdentity();

  useEffect(() => {
    if (isDisconnected && identity) {
      clear();
    }
  }, [isDisconnected, clear, identity]);

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
      enqueueSnackbar(prepareLoginError.message, {
        variant: 'error',
        persist: false,
        preventDuplicate: true,
        transitionDuration: 3,
      });
    }
  }, [prepareLoginError]);

  useEffect(() => {
    if (loginError) {
      enqueueSnackbar(loginError.message, {
        variant: 'error',
        persist: false,
        preventDuplicate: true,
        transitionDuration: 3,
      });
      connector?.disconnect().then();
    }
  }, [loginError, connector]);

  useEffect(() => {
    if (address && !isInitializing && !identityAddress && !isSigning) {
      setIsSigning(true);
      login()
        .then(() => {
          setIsSigning(false);
        })
        .catch(() => {
          setIsSigning(false);
          connector?.disconnect().then();
        });
    }
  }, [address, isInitializing, identityAddress, login, isSigning, connector]);

  return children;
};

export default SiweIdentityGuardProvider;
