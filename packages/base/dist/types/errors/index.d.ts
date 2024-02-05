import { CustomError } from "ts-custom-error";
export interface IWeb3AuthError extends CustomError {
    code: number;
    message: string;
    toString(): string;
}
export type ErrorCodes = {
    [key: number]: string;
};
export declare abstract class Web3AuthError extends CustomError implements IWeb3AuthError {
    code: number;
    message: string;
    constructor(code: number, message?: string);
    toJSON(): IWeb3AuthError;
    toString(): string;
}
export declare class WalletInitializationError extends Web3AuthError {
    protected static messages: ErrorCodes;
    constructor(code: number, message?: string);
    static fromCode(code: number, extraMessage?: string): IWeb3AuthError;
    static notFound(extraMessage?: string): IWeb3AuthError;
    static notInstalled(extraMessage?: string): IWeb3AuthError;
    static notReady(extraMessage?: string): IWeb3AuthError;
    static windowBlocked(extraMessage?: string): IWeb3AuthError;
    static windowClosed(extraMessage?: string): IWeb3AuthError;
    static incompatibleChainNameSpace(extraMessage?: string): IWeb3AuthError;
    static duplicateAdapterError(extraMessage?: string): IWeb3AuthError;
    static invalidProviderConfigError(extraMessage?: string): IWeb3AuthError;
    static providerNotReadyError(extraMessage?: string): IWeb3AuthError;
    static rpcConnectionError(extraMessage?: string): IWeb3AuthError;
    static invalidParams(extraMessage?: string): IWeb3AuthError;
    static invalidNetwork(extraMessage?: string): IWeb3AuthError;
}
/**
 * wallet login errors
 */
export declare class WalletLoginError extends Web3AuthError {
    protected static messages: ErrorCodes;
    constructor(code: number, message?: string);
    static fromCode(code: number, extraMessage?: string): IWeb3AuthError;
    static connectionError(extraMessage?: string): IWeb3AuthError;
    static disconnectionError(extraMessage?: string): IWeb3AuthError;
    static notConnectedError(extraMessage?: string): IWeb3AuthError;
    static popupClosed(extraMessage?: string): IWeb3AuthError;
    static mfaEnabled(extraMessage?: string): IWeb3AuthError;
    static chainConfigNotAdded(extraMessage?: string): IWeb3AuthError;
    static unsupportedOperation(extraMessage?: string): IWeb3AuthError;
    static coreKitKeyNotFound(extraMessage?: string): IWeb3AuthError;
    static userNotLoggedIn(extraMessage?: string): IWeb3AuthError;
}
export declare class WalletOperationsError extends Web3AuthError {
    protected static messages: ErrorCodes;
    constructor(code: number, message?: string);
    static fromCode(code: number, extraMessage?: string): IWeb3AuthError;
    static chainIDNotAllowed(extraMessage?: string): IWeb3AuthError;
    static operationNotAllowed(extraMessage?: string): IWeb3AuthError;
    static chainNamespaceNotAllowed(extraMessage?: string): IWeb3AuthError;
}
export declare class WalletProviderError extends Web3AuthError {
    protected static messages: ErrorCodes;
    constructor(code: number, message?: string);
    static fromCode(code: number, extraMessage?: string): IWeb3AuthError;
    static invalidRequestArgs(extraMessage?: string): IWeb3AuthError;
    static invalidRequestMethod(extraMessage?: string): IWeb3AuthError;
    static invalidRequestParams(extraMessage?: string): IWeb3AuthError;
}
