import { StateStorage } from "zustand/middleware";

const ChromeLocalStorage: StateStorage = {
  getItem: (name) => {
    return new Promise<string>((resolve, reject) => {
      chrome.storage.local.get(name, (result) => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve(result[name]);
      });
    });
  },
  setItem: (name, value) => {
    return new Promise<void>((resolve, reject) => {
      chrome.storage.local.set({ [name]: value }, () => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve();
      });
    });
  },
  removeItem: (name) => {
    return new Promise<void>((resolve, reject) => {
      chrome.storage.local.remove(name, () => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve();
      });
    });
  },
};

const ChromeSyncStorage: StateStorage = {
  getItem: (name) => {
    return new Promise<string>((resolve, reject) => {
      chrome.storage.sync.get(name, (result) => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve(result[name]);
      });
    });
  },
  setItem: (name, value) => {
    return new Promise<void>((resolve, reject) => {
      chrome.storage.sync.set({ [name]: value }, () => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve();
      });
    });
  },
  removeItem: (name) => {
    return new Promise<void>((resolve, reject) => {
      chrome.storage.sync.remove(name, () => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve();
      });
    });
  },
};

const ChromeSessionStorage: StateStorage = {
  getItem: (name) => {
    return new Promise<string>((resolve, reject) => {
      chrome.storage.session.get(name, (result) => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve(result[name]);
      });
    });
  },
  setItem: (name, value) => {
    return new Promise<void>((resolve, reject) => {
      chrome.storage.session.set({ [name]: value }, () => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve();
      });
    });
  },
  removeItem: (name) => {
    return new Promise<void>((resolve, reject) => {
      chrome.storage.session.remove(name, () => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve();
      });
    });
  },
};

export { ChromeLocalStorage, ChromeSessionStorage, ChromeSyncStorage };
