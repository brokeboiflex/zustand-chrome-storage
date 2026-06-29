import type { StateStorage } from "zustand/middleware";

export type ChromeStorageAreaName = "local" | "sync" | "session";

export type ChromeStorageArea = {
  get: (keys: string, callback: (items: Record<string, unknown>) => void) => void;
  set: (items: Record<string, unknown>, callback: () => void) => void;
  remove: (keys: string, callback: () => void) => void;
};

type ChromeApi = {
  runtime?: {
    lastError?: unknown;
  };
  storage?: Partial<Record<ChromeStorageAreaName, ChromeStorageArea>>;
};

type ChromeStorageResolver = ChromeStorageArea | (() => ChromeStorageArea);

function getChromeApi(): ChromeApi | undefined {
  return (globalThis as { chrome?: ChromeApi }).chrome;
}

function getChromeLastError(): unknown {
  return getChromeApi()?.runtime?.lastError;
}

function chromeStorageError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return new Error(error.message);
  }

  return new Error("Chrome storage operation failed");
}

export function getChromeStorageArea(area: ChromeStorageAreaName): ChromeStorageArea {
  const storage = getChromeApi()?.storage?.[area];

  if (!storage) {
    throw new Error(`chrome.storage.${area} is unavailable`);
  }

  return storage;
}

function resolveChromeStorage(storage: ChromeStorageResolver): ChromeStorageArea {
  return typeof storage === "function" ? storage() : storage;
}

export function createChromeStorage(storage: ChromeStorageResolver): StateStorage {
  return {
    getItem: (name) => {
      return new Promise<string | null>((resolve, reject) => {
        resolveChromeStorage(storage).get(name, (result) => {
          const lastError = getChromeLastError();
          if (lastError) {
            return reject(chromeStorageError(lastError));
          }
          const value = result[name];
          resolve(typeof value === "string" ? value : null);
        });
      });
    },
    setItem: (name, value) => {
      return new Promise<void>((resolve, reject) => {
        resolveChromeStorage(storage).set({ [name]: value }, () => {
          const lastError = getChromeLastError();
          if (lastError) {
            return reject(chromeStorageError(lastError));
          }
          resolve();
        });
      });
    },
    removeItem: (name) => {
      return new Promise<void>((resolve, reject) => {
        resolveChromeStorage(storage).remove(name, () => {
          const lastError = getChromeLastError();
          if (lastError) {
            return reject(chromeStorageError(lastError));
          }
          resolve();
        });
      });
    },
  };
}

const ChromeLocalStorage = createChromeStorage(() => getChromeStorageArea("local"));
const ChromeSyncStorage = createChromeStorage(() => getChromeStorageArea("sync"));
const ChromeSessionStorage = createChromeStorage(() => getChromeStorageArea("session"));

function getChromeLocalStorage(): StateStorage {
  getChromeStorageArea("local");
  return ChromeLocalStorage;
}

function getChromeSyncStorage(): StateStorage {
  getChromeStorageArea("sync");
  return ChromeSyncStorage;
}

function getChromeSessionStorage(): StateStorage {
  getChromeStorageArea("session");
  return ChromeSessionStorage;
}

export {
  ChromeLocalStorage,
  ChromeSessionStorage,
  ChromeSyncStorage,
  getChromeLocalStorage,
  getChromeSessionStorage,
  getChromeSyncStorage,
};
