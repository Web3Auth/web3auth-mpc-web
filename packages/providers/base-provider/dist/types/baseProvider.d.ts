import { BaseConfig, BaseController, BaseState } from "@toruslabs/base-controllers";
import { JRPCRequest, JRPCResponse, SendCallBack } from "@toruslabs/openlogin-jrpc";
import { CustomChainConfig, IBaseProvider, Maybe, RequestArguments, SafeEventEmitterProvider } from "@web3auth-mpc/base";
export interface BaseProviderState extends BaseState {
    chainId: string;
}
export interface BaseProviderConfig extends BaseConfig {
    chainConfig: Partial<CustomChainConfig>;
    networks?: Record<string, CustomChainConfig>;
    skipLookupNetwork?: boolean;
}
export declare abstract class BaseProvider<C extends BaseProviderConfig, S extends BaseProviderState, P> extends BaseController<C, S> implements IBaseProvider<P> {
    _providerEngineProxy: SafeEventEmitterProvider | null;
    constructor({ config, state }: {
        config: C;
        state?: S;
    });
    get currentChainConfig(): Partial<CustomChainConfig>;
    get provider(): SafeEventEmitterProvider | null;
    get chainId(): string;
    set provider(_: SafeEventEmitterProvider | null);
    request<T, R>(args: RequestArguments<T>): Promise<Maybe<R>>;
    sendAsync<T, U>(req: JRPCRequest<T>, callback: SendCallBack<JRPCResponse<U>>): void;
    sendAsync<T, U>(req: JRPCRequest<T>): Promise<JRPCResponse<U>>;
    send<T, U>(req: JRPCRequest<T>, callback: SendCallBack<JRPCResponse<U>>): void;
    addChain(chainConfig: CustomChainConfig): void;
    getChainConfig(chainId: string): CustomChainConfig | null;
    updateProviderEngineProxy(provider: SafeEventEmitterProvider): void;
    protected getProviderEngineProxy(): SafeEventEmitterProvider | null;
    abstract setupProvider(provider: P): Promise<void>;
    abstract switchChain(params: {
        chainId: string;
    }): Promise<void>;
    protected abstract lookupNetwork(provider?: P): Promise<string | void>;
}