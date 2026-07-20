import test from "node:test";
import assert from "node:assert/strict";
import { translations, translate, RTL_LANGUAGES, SUPPORTED_LANGUAGES } from "../translations.js";

test("every supported language defines the same keys as English", () => {
  const englishKeys = Object.keys(translations.en).sort();
  for (const language of SUPPORTED_LANGUAGES) {
    assert.deepEqual(Object.keys(translations[language]).sort(), englishKeys, `Language "${language}" is missing keys`);
  }
});

test("translate falls back to English for an unknown language", () => {
  assert.equal(translate("klingon", "dashboard"), translations.en.dashboard);
});

test("translate falls back to the raw key when the key is unknown everywhere", () => {
  assert.equal(translate("en", "notARealKey"), "notARealKey");
});

test("Arabic is marked right-to-left and English is not", () => {
  assert.ok(RTL_LANGUAGES.has("ar"));
  assert.ok(!RTL_LANGUAGES.has("en"));
});
