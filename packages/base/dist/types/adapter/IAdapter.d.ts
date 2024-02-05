import { JRPCRequest, JRPCResponse, Maybe, RequestArguments, SafeEventEmitter, SendCallBack } from "@toruslabs/openlogin-jrpc";
import { OPENLOGIN_NETWORK_TYPE, OpenloginUserInfo } from "@toruslabs/openlogin-utils";
import { AdapterNamespaceType, ChainNamespaceType, CustomChainConfig } from "../chain/IChainInterface";
import { SafeEventEmitterProvider } from "../provider/IProvider";
export type UserInfo = OpenloginUserInfo;
export type WEB3AUTH_NETWORK_TYPE = OPENLOGIN_NETWORK_TYPE;
export declare const WEB3AUTH_NETWORK: {
    readonly MAINNET: "mainnet";
    readonly TESTNET: "testnet";
    readonly CYAN: "cyan";
    readonly AQUA: "aqua";
    readonly CELESTE: "celeste";
    readonly SAPPHIRE_DEVNET: "sapphire_devnet";
    readonly SAPPHIRE_MAINNET: "sapphire_mainnet";
};
export { OPENLOGIN_NETWORK, type OPENLOGIN_NETWORK_TYPE } from "@toruslabs/openlogin-utils";
export declare const ADAPTER_CATEGORY: {
    readonly EXTERNAL: "external";
    readonly IN_APP: "in_app";
};
export type ADAPTER_CATEGORY_TYPE = (typeof ADAPTER_CATEGORY)[keyof typeof ADAPTER_CATEGORY];
export interface AdapterInitOptions {
    /**
     * Whether to auto connect to the adapter based on redirect mode or saved adapters
     */
    autoConnect?: boolean;
}
export declare const ADAPTER_STATUS: {
    readonly NOT_READY: "not_ready";
    readonly READY: "ready";
    readonly CONNECTING: "connecting";
    readonly CONNECTED: "connected";
    readonly DISCONNECTED: "disconnected";
    readonly ERRORED: "errored";
};
export declare const ADAPTER_EVENTS: {
    readonly ADAPTER_DATA_UPDATED: "adapter_data_updated";
    readonly CACHE_CLEAR: "cache_clear";
    readonly NOT_READY: "not_ready";
    readonly READY: "ready";
    readonly CONNECTING: "connecting";
    readonly CONNECTED: "connected";
    readonly DISCONNECTED: "disconnected";
    readonly ERRORED: "errored";
};
export type ADAPTER_STATUS_TYPE = (typeof ADAPTER_STATUS)[keyof typeof ADAPTER_STATUS];
export type CONNECTED_EVENT_DATA = {
    adapter: string;
    reconnected: boolean;
};
export type TSSInfo = {
    tssShare: string;
    signatures: string[];
};
export type UserAuthInfo = {
    idToken: string;
};
export interface BaseAdapterSettings {
    clientId?: string;
    sessionTime?: number;
    chainConfig?: Partial<CustomChainConfig> & Pick<CustomChainConfig, "chainNamespace">;
    web3AuthNetwork?: OPENLOGIN_NETWORK_TYPE;
    useCoreKitKey?: boolean;
}
export interface IProvider extends SafeEventEmitter {
    get chainId(): string;
    request<S, R>(args: RequestArguments<S>): Promise<Maybe<R>>;
    sendAsync<T, U>(req: JRPCRequest<T>, callback: SendCallBack<JRPCResponse<U>>): void;
    sendAsync<T, U>(req: JRPCRequest<T>): Promise<JRPCResponse<U>>;
    send<T, U>(req: JRPCRequest<T>, callback: SendCallBack<JRPCResponse<U>>): void;
}
export interface IBaseProvider<T> extends IProvider {
    provider: SafeEventEmitterProvider | null;
    currentChainConfig: Partial<CustomChainConfig>;
    setupProvider(provider: T): Promise<void>;
    addChain(chainConfig: CustomChainConfig): void;
    switchChain(params: {
        chainId: string;
    }): Promise<void>;
    updateProviderEngineProxy(provider: SafeEventEmitterProvider): void;
}
export interface IAdapter<T> extends SafeEventEmitter {
    adapterNamespace: AdapterNamespaceType;
    currentChainNamespace: ChainNamespaceType;
    chainConfigProxy: CustomChainConfig | null;
    type: ADAPTER_CATEGORY_TYPE;
    name: string;
    sessionTime: number;
    web3AuthNetwork: OPENLOGIN_NETWORK_TYPE;
    clientId: string;
    status: ADAPTER_STATUS_TYPE;
    provider: IProvider | null;
    adapterData?: unknown;
    connnected: boolean;
    addChain(chainConfig: CustomChainConfig): Promise<void>;
    init(options?: AdapterInitOptions): Promise<void>;
    disconnect(options?: {
        cleanup: boolean;
    }): Promise<void>;
    connect(params?: T): Promise<IProvider | null>;
    getUserInfo(): Promise<Partial<UserInfo>>;
    setAdapterSettings(adapterSettings: BaseAdapterSettings): void;
    switchChain(params: {
        chainId: string;
    }): Promise<void>;
    authenticateUser(): Promise<UserAuthInfo>;
    getTSSInfo?(): Promise<TSSInfo>;
}
export declare abstract class BaseAdapter<T> extends SafeEventEmitter implements IAdapter<T> {
    adapterData?: unknown;
    sessionTime: number;
    clientId: string;
    web3AuthNetwork: OPENLOGIN_NETWORK_TYPE;
    protected rehydrated: boolean;
    protected chainConfig: CustomChainConfig | null;
    protected knownChainConfigs: Record<CustomChainConfig["chainId"], CustomChainConfig>;
    abstract adapterNamespace: AdapterNamespaceType;
    abstract currentChainNamespace: ChainNamespaceType;
    abstract type: ADAPTER_CATEGORY_TYPE;
    abstract name: string;
    abstract status: ADAPTER_STATUS_TYPE;
    constructor(options?: BaseAdapterSettings);
    get chainConfigProxy(): CustomChainConfig | null;
    get connnected(): boolean;
    abstract get provider(): IProvider | null;
    setAdapterSettings(options: BaseAdapterSettings): void;
    checkConnectionRequirements(): void;
    checkInitializationRequirements(): void;
    checkDisconnectionRequirements(): void;
    checkAddChainRequirements(chainConfig: CustomChainConfig, init?: boolean): void;
    checkSwitchChainRequirements({ chainId }: {
        chainId: string;
    }, init?: boolean): void;
    updateAdapterData(data: unknown): void;
    protected addChainConfig(chainConfig: CustomChainConfig): void;
    protected getChainConfig(chainId: string): CustomChainConfig | null;
    abstract init(options?: AdapterInitOptions): Promise<void>;
    abstract connect(params?: T): Promise<IProvider | null>;
    abstract disconnect(): Promise<void>;
    abstract getUserInfo(): Promise<Partial<UserInfo>>;
    abstract authenticateUser(): Promise<UserAuthInfo>;
    abstract addChain(chainConfig: CustomChainConfig): Promise<void>;
    abstract switchChain(params: {
        chainId: string;
    }): Promise<void>;
}
export interface BaseAdapterConfig {
    label: string;
    showOnModal?: boolean;
    showOnMobile?: boolean;
    showOnDesktop?: boolean;
}
export type LoginMethodConfig = Record<string, {
    /**
     * Display Name. If not provided, we use the default for openlogin app
     */
    name: string;
    /**
     * Description for button. If provided, it renders as a full length button. else, icon button
     */
    description?: string;
    /**
     * Logo to be shown on mouse hover. If not provided, we use the default for openlogin app
     */
    logoHover?: string;
    /**
     * Logo to be shown on dark background (dark theme). If not provided, we use the default for openlogin app
     */
    logoLight?: string;
    /**
     * Logo to be shown on light background (light theme). If not provided, we use the default for openlogin app
     */
    logoDark?: string;
    /**
     * Show login button on the main list
     */
    mainOption?: boolean;
    /**
     * Whether to show the login button on modal or not
     */
    showOnModal?: boolean;
    /**
     * Whether to show the login button on desktop
     */
    showOnDesktop?: boolean;
    /**
     * Whether to show the login button on mobile
     */
    showOnMobile?: boolean;
}>;
export interface IWalletConnectExtensionAdapter {
    name: string;
    chains: ChainNamespaceType[];
    logo: string;
    mobile: {
        native: string;
        universal: string;
    };
    desktop: {
        native: string;
        universal: string;
    };
}
export type WalletConnectV2Data = {
    uri: string;
    extensionAdapters: IWalletConnectExtensionAdapter[];
};
export interface IAdapterDataEvent {
    adapterName: string;
    data: unknown;
}
export interface INetworkSwitchProvider {
    addChain(chainConfig: CustomChainConfig): Promise<void>;
    switchChain(chainId: string): Promise<void>;
}
export interface INetworkSwitch {
    addNetwork(params: {
        chainConfig: CustomChainConfig;
        appOrigin: string;
    }): Promise<boolean>;
    switchNetwork(params: {
        currentChainConfig: CustomChainConfig;
        newChainConfig: Partial<CustomChainConfig>;
        appOrigin: string;
    }): Promise<boolean>;
}
export declare abstract class BaseNetworkSwitch implements INetworkSwitch {
    abstract switchNetwork(params: {
        currentChainConfig: CustomChainConfig;
        newChainConfig: Partial<CustomChainConfig>;
        appOrigin: string;
    }): Promise<boolean>;
    abstract addNetwork(params: {
        chainConfig: CustomChainConfig;
        appOrigin: string;
    }): Promise<boolean>;
}