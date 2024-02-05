import { SafeEventEmitterProvider } from "@toruslabs/openlogin-jrpc";
import { CustomChainConfig, IBaseProvider } from "@web3auth-mpc/base";
import { BaseProvider, BaseProviderConfig, BaseProviderState } from "./baseProvider";
export interface CommonPrivKeyProviderConfig extends BaseProviderConfig {
    chainConfig: Omit<CustomChainConfig, "chainNamespace">;
}
export interface CommonPrivKeyProviderState extends BaseProviderState {
    privateKey?: string;
}
export declare class CommonPrivateKeyProvider extends BaseProvider<BaseProviderConfig, CommonPrivKeyProviderState, string> implements IBaseProvider<string> {
    _providerEngineProxy: SafeEventEmitterProvider | null;
    constructor({ config, state }: {
        config: CommonPrivKeyProviderConfig;
        state?: CommonPrivKeyProviderState;
    });
    get provider(): SafeEventEmitterProvider | null;
    set provider(_: SafeEventEmitterProvider | null);
    static getProviderInstance: (params: {
        privKey: string;
        chainConfig: Omit<CustomChainConfig, "chainNamespace">;
    }) => Promise<CommonPrivateKeyProvider>;
    addChain(_: CustomChainConfig): void;
    setupProvider(privKey: string): Promise<void>;
    updateProviderEngineProxy(provider: SafeEventEmitterProvider): void;
    switchChain(_: {
        chainId: string;
    }): Promise<void>;
    protected getProviderEngineProxy(): SafeEventEmitterProvider | null;
    protected lookupNetwork(): Promise<string>;
    private getPrivKeyMiddleware;
    private createPrivKeyMiddleware;
}