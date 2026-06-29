const assert = require("node:assert/strict");
const test = require("node:test");
const { createJSONStorage } = require("zustand/middleware");

function createArea(initial = {}) {
  const values = { ...initial };
  return {
    get(name, callback) {
      callback(Object.prototype.hasOwnProperty.call(values, name) ? { [name]: values[name] } : {});
    },
    set(nextValues, callback) {
      Object.assign(values, nextValues);
      callback();
    },
    remove(name, callback) {
      delete values[name];
      callback();
    },
    values,
  };
}

function installChromeMock({ local = {}, sync = {}, session = {} } = {}) {
  const storage = {
    local: createArea(local),
    sync: createArea(sync),
  };

  if (session !== false) {
    storage.session = createArea(session);
  }

  global.chrome = {
    runtime: { lastError: null },
    storage,
  };
}

test.beforeEach(() => {
  delete require.cache[require.resolve("../dist/index.cjs")];
  installChromeMock();
});

test.afterEach(() => {
  delete global.chrome;
});

test("module can be imported before chrome exists", async () => {
  delete global.chrome;
  delete require.cache[require.resolve("../dist/index.cjs")];

  assert.doesNotThrow(() => require("../dist/index.cjs"));
});

test("zustand createJSONStorage receives undefined when chrome storage is unavailable", async () => {
  delete global.chrome;
  const { getChromeLocalStorage } = require("../dist/index.cjs");

  assert.equal(createJSONStorage(getChromeLocalStorage), undefined);
});

test("getItem returns null for missing keys", async () => {
  const { ChromeLocalStorage } = require("../dist/index.cjs");

  assert.equal(await ChromeLocalStorage.getItem("missing"), null);
});

test("getItem returns stored string values", async () => {
  installChromeMock({ sync: { food: "{\"state\":{\"fishes\":1}}" } });
  delete require.cache[require.resolve("../dist/index.cjs")];
  const { ChromeSyncStorage } = require("../dist/index.cjs");

  assert.equal(await ChromeSyncStorage.getItem("food"), "{\"state\":{\"fishes\":1}}");
});

test("getItem returns null for non-string values", async () => {
  installChromeMock({ session: { food: { state: { fishes: 1 } } } });
  delete require.cache[require.resolve("../dist/index.cjs")];
  const { ChromeSessionStorage } = require("../dist/index.cjs");

  assert.equal(await ChromeSessionStorage.getItem("food"), null);
});

test("setItem and removeItem proxy to the selected chrome storage area", async () => {
  const { ChromeLocalStorage } = require("../dist/index.cjs");

  await ChromeLocalStorage.setItem("food", "{\"state\":{\"fishes\":2}}");
  assert.equal(global.chrome.storage.local.values.food, "{\"state\":{\"fishes\":2}}");

  await ChromeLocalStorage.removeItem("food");
  assert.equal(global.chrome.storage.local.values.food, undefined);
});

test("available storage areas still work when another area is unsupported", async () => {
  installChromeMock({ local: { food: "{\"state\":{\"fishes\":1}}" }, session: false });
  delete require.cache[require.resolve("../dist/index.cjs")];
  const { ChromeLocalStorage, ChromeSessionStorage } = require("../dist/index.cjs");

  assert.equal(await ChromeLocalStorage.getItem("food"), "{\"state\":{\"fishes\":1}}");
  await assert.rejects(() => ChromeSessionStorage.getItem("food"), /chrome\.storage\.session is unavailable/);
});

test("createChromeStorage supports custom chrome-compatible storage areas", async () => {
  const customArea = createArea({ food: "{\"state\":{\"fishes\":3}}" });
  const { createChromeStorage } = require("../dist/index.cjs");
  const storage = createChromeStorage(customArea);

  assert.equal(await storage.getItem("food"), "{\"state\":{\"fishes\":3}}");

  await storage.setItem("food", "{\"state\":{\"fishes\":4}}");
  assert.equal(customArea.values.food, "{\"state\":{\"fishes\":4}}");
});

test("chrome runtime errors reject storage operations", async () => {
  global.chrome.storage.local.get = (_name, callback) => {
    global.chrome.runtime.lastError = { message: "quota exceeded" };
    callback({});
  };
  const { ChromeLocalStorage } = require("../dist/index.cjs");

  await assert.rejects(() => ChromeLocalStorage.getItem("food"), /quota exceeded/);
});
