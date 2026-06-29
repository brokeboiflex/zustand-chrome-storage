import type { StateStorage } from "zustand/middleware";
export type ChromeStorageAreaName = "local" | "sync" | "session";
export type ChromeStorageArea = {
    get: (keys: string, callback: (items: Record<string, unknown>) => void) => void;
    set: (items: Record<string, unknown>, callback: () => void) => void;
    remove: (keys: string, callback: () => void) => void;
};
type ChromeStorageResolver = ChromeStorageArea | (() => ChromeStorageArea);
export declare function getChromeStorageArea(area: ChromeStorageAreaName): ChromeStorageArea;
export declare function createChromeStorage(storage: ChromeStorageResolver): StateStorage;
declare const ChromeLocalStorage: StateStorage;
declare const ChromeSyncStorage: StateStorage;
declare const ChromeSessionStorage: StateStorage;
declare function getChromeLocalStorage(): StateStorage;
declare function getChromeSyncStorage(): StateStorage;
declare function getChromeSessionStorage(): StateStorage;
export { ChromeLocalStorage, ChromeSessionStorage, ChromeSyncStorage, getChromeLocalStorage, getChromeSessionStorage, getChromeSyncStorage, };
