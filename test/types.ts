/// <reference types="chrome" />

import { createJSONStorage, type StateStorage } from "zustand/middleware";
import {
  ChromeLocalStorage,
  ChromeSessionStorage,
  ChromeSyncStorage,
  createChromeStorage,
  getChromeLocalStorage,
  getChromeSessionStorage,
  getChromeStorageArea,
  getChromeSyncStorage,
  type ChromeStorageArea,
} from "zustand-chrome-storage";

const localArea: ChromeStorageArea = chrome.storage.local;
const syncArea: ChromeStorageArea = chrome.storage.sync;
const sessionArea: ChromeStorageArea = chrome.storage.session;
const resolvedArea: ChromeStorageArea = getChromeStorageArea("local");

const localStorage: StateStorage = createChromeStorage(chrome.storage.local);
const syncStorage: StateStorage = createChromeStorage(chrome.storage.sync);
const sessionStorage: StateStorage = createChromeStorage(chrome.storage.session);
const thunkStorage: StateStorage = createChromeStorage(() => chrome.storage.local);

const exportedLocalStorage: StateStorage = ChromeLocalStorage;
const exportedSyncStorage: StateStorage = ChromeSyncStorage;
const exportedSessionStorage: StateStorage = ChromeSessionStorage;

createJSONStorage(() => localStorage);
createJSONStorage(() => syncStorage);
createJSONStorage(() => sessionStorage);
createJSONStorage(() => thunkStorage);
createJSONStorage(() => getChromeLocalStorage());
createJSONStorage(() => getChromeSyncStorage());
createJSONStorage(() => getChromeSessionStorage());

// @ts-expect-error chrome.storage.managed is read-only and not valid StateStorage.
getChromeStorageArea("managed");

void localArea;
void syncArea;
void sessionArea;
void resolvedArea;
void exportedLocalStorage;
void exportedSyncStorage;
void exportedSessionStorage;
