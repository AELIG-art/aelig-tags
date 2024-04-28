import React, {ReactNode} from "react";
import {getDefaultConfig, lightTheme, RainbowKitProvider, Theme} from "@rainbow-me/rainbowkit";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {mainnet} from "viem/chains";
import {APP_NAME, WALLET_CONNECT_PROJECT_ID} from "../utils/constants";
import {WagmiProvider} from "wagmi";
import merge from "lodash.merge";

const WalletConnectProvider = (props: {
    children: ReactNode
}) => {
    const {children} = props;

    const config = getDefaultConfig({
        appName: 'AELIG | Tags',
        projectId: WALLET_CONNECT_PROJECT_ID,
        chains: [mainnet],
        ssr: false
    });

    const rainbowKitProviderTheme = merge(lightTheme({
        accentColor: 'var(--primary-color)',
        accentColorForeground: 'white',
        borderRadius: "none",
        overlayBlur: "none",
        fontStack: "system",
    }), {
        colors: {
            actionButtonSecondaryBackground: 'var(--secondary-color)',
            closeButton: 'var(--primary-color)',
            connectButtonBackground: 'var(--primary-color)',
            connectButtonInnerBackground: 'var(--primary-color)',
            menuItemBackground: 'var(--secondary-color)',
            profileActionHover: 'var(--secondary-color)',
            connectButtonText: "white",
        },
    } as Theme);

    const appInfo = {
        appName: APP_NAME,
    }

    const queryClient = new QueryClient();

    return <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
            <RainbowKitProvider
                theme={rainbowKitProviderTheme}
                appInfo={appInfo}
                modalSize={"compact"}
            >
                {children}
            </RainbowKitProvider>
        </QueryClientProvider>
    </WagmiProvider>;
}

export default WalletConnectProvider;