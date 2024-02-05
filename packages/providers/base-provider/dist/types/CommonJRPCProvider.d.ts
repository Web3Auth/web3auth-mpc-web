import { CustomChainConfig, SafeEventEmitterProvider } from "@web3auth-mpc/base";
import { BaseProvider, BaseProviderConfig, BaseProviderState } from "./baseProvider";
export type CommonJRPCProviderConfig = BaseProviderConfig;
export type CommonJRPCProviderState = BaseProviderState;
export declare class CommonJRPCProvider extends BaseProvider<CommonJRPCProviderConfig, CommonJRPCProviderState, never> {
    constructor({ config, state }: {
        config: CommonJRPCProviderConfig;
        state?: CommonJRPCProviderState;
    });
    static getProviderInstance: (params: {
        chainConfig: CustomChainConfig;
    }) => Promise<CommonJRPCProvider>;
    setupProvider(): Promise<void>;
    switchChain(params: {
        chainId: string;
    }): Promise<void>;
    updateProviderEngineProxy(provider: SafeEventEmitterProvider): void;
    protected getProviderEngineProxy(): SafeEventEmitterProvider | null;
    protected lookupNetwork(): Promise<string | void>;
}