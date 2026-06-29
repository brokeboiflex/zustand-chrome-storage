# Usage

⚠️ This package is for use within chrome extensions only ⚠️

Just import the type of storage you need and use it like you would normally.
Refer to `chrome.storage` [documentation](https://developer.chrome.com/docs/extensions/reference/api/storage) for more info about specific storage.

```js
import {
  getChromeLocalStorage,
  getChromeSessionStorage,
  getChromeSyncStorage,
} from "zustand-chrome-storage";

const useFishLocalStore = create(
  persist(
    (set, get) => ({
      fishes: 0,
      addAFish: () => set({ fishes: get().fishes + 1 }),
    }),
    {
      name: "food-storage", // Name of the item in chrome.storage.local
      storage: createJSONStorage(getChromeLocalStorage),
    }
  )
);

const useFishSessionStore = create(
  persist(
    (set, get) => ({
      fishes: 0,
      addAFish: () => set({ fishes: get().fishes + 1 }),
    }),
    {
      name: "food-storage", // Name of the item in chrome.storage.session
      storage: createJSONStorage(getChromeSessionStorage),
    }
  )
);
const useFishSyncStore = create(
  persist(
    (set, get) => ({
      fishes: 0,
      addAFish: () => set({ fishes: get().fishes + 1 }),
    }),
    {
      name: "food-storage", // Name of the item in chrome.storage.sync
      storage: createJSONStorage(getChromeSyncStorage),
    }
  )
);
```

The direct `ChromeLocalStorage`, `ChromeSessionStorage`, and `ChromeSyncStorage`
objects are still exported for existing code. The getter functions are preferred
because Zustand's `createJSONStorage` can catch unavailable Chrome storage during
initialization.
