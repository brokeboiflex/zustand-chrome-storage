const assert = require("node:assert/strict");
const test = require("node:test");

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
  global.chrome = {
    runtime: { lastError: null },
    storage: {
      local: createArea(local),
      sync: createArea(sync),
      session: createArea(session),
    },
  };
}

test.beforeEach(() => {
  delete require.cache[require.resolve("../dist/index.cjs")];
  installChromeMock();
});

test.afterEach(() => {
  delete global.chrome;
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

test("chrome runtime errors reject storage operations", async () => {
  global.chrome.storage.local.get = (_name, callback) => {
    global.chrome.runtime.lastError = new Error("quota exceeded");
    callback({});
  };
  const { ChromeLocalStorage } = require("../dist/index.cjs");

  await assert.rejects(() => ChromeLocalStorage.getItem("food"), /quota exceeded/);
});
