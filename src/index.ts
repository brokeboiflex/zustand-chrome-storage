import type { StateStorage } from "zustand/middleware";

function createChromeStorage(storage: chrome.storage.StorageArea): StateStorage {
  return {
    getItem: (name) => {
      return new Promise<string | null>((resolve, reject) => {
        storage.get(name, (result) => {
          if (chrome.runtime.lastError) {
            return reject(chrome.runtime.lastError);
          }
          const value = result[name];
          resolve(typeof value === "string" ? value : null);
        });
      });
    },
    setItem: (name, value) => {
      return new Promise<void>((resolve, reject) => {
        storage.set({ [name]: value }, () => {
          if (chrome.runtime.lastError) {
            return reject(chrome.runtime.lastError);
          }
          resolve();
        });
      });
    },
    removeItem: (name) => {
      return new Promise<void>((resolve, reject) => {
        storage.remove(name, () => {
          if (chrome.runtime.lastError) {
            return reject(chrome.runtime.lastError);
          }
          resolve();
        });
      });
    },
  };
}

const ChromeLocalStorage = createChromeStorage(chrome.storage.local);
const ChromeSyncStorage = createChromeStorage(chrome.storage.sync);
const ChromeSessionStorage = createChromeStorage(chrome.storage.session);

export { ChromeLocalStorage, ChromeSessionStorage, ChromeSyncStorage };
