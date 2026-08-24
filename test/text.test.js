import test from "node:test";
import assert from "node:assert/strict";
import { escapeHtml } from "../src/domain/text.js";

test("owner-entered evidence is safe to insert into HTML markup", () => {
  assert.equal(escapeHtml(`<img src=x onerror="alert('x')"> & label`), "&lt;img src=x onerror=&quot;alert(&#39;x&#39;)&quot;&gt; &amp; label");
});
