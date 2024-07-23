# Usage

⚠️ This package is for use within chrome extensions only ⚠️

Just import the type of storage you need and use it like you would normally.
Refer to `chrome.storage` [documentation](https://developer.chrome.com/docs/extensions/reference/api/storage) for more info about specific storage.

```js
import {
  ChromeLocalStorage,
  ChromeSessionStorage,
  ChromeSyncStorage,
} from "zustand-chrome-storage";

const useFishLocalStore = create(
  persist(
    (set, get) => ({
      fishes: 0,
      addAFish: () => set({ fishes: get().fishes + 1 }),
    }),
    {
      name: "food-storage", // Name of the item in chrome.storage.local
      storage: createJSONStorage(() => ChromeLocalStorage),
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
      storage: createJSONStorage(() => ChromeSessionStorage),
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
      storage: createJSONStorage(() => ChromeSyncStorage),
    }
  )
);
```
