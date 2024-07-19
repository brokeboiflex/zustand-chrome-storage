import { StateStorage } from "zustand/middleware";
declare const ChromeLocalStorage: StateStorage;
declare const ChromeSyncStorage: StateStorage;
declare const ChromeSessionStorage: StateStorage;
export { ChromeLocalStorage, ChromeSessionStorage, ChromeSyncStorage };
