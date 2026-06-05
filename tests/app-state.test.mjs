import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  createDefaultState,
  exportFlow,
  formatEmail,
  parseStoredState,
  resetFlow,
  selectDay,
  updateEmail,
} from "../public/app.js";

test("createDefaultState builds one email for each of seven onboarding days", () => {
  const state = createDefaultState();

  assert.equal(state.campaignName, "Cordia 7-day welcome flow");
  assert.equal(state.selectedDay, 1);
  assert.equal(state.emails.length, 7);
  assert.deepEqual(
    state.emails.map((email) => email.day),
    [1, 2, 3, 4, 5, 6, 7],
  );
  assert.match(state.emails[0].subject, /Welcome to Cordia/);
});

test("parseStoredState merges valid campaign values with defaults", () => {
  const defaultState = createDefaultState();
  const storedEmails = defaultState.emails.map((email) =>
    email.day === 4 ? { ...email, subject: "Custom day 4", tone: "celebratory" } : email,
  );
  const stored = JSON.stringify({
    campaignName: "Activation week",
    selectedDay: 4,
    theme: "dark",
    emails: storedEmails,
  });

  const parsed = parseStoredState(stored, defaultState);

  assert.equal(parsed.campaignName, "Activation week");
  assert.equal(parsed.selectedDay, 4);
  assert.equal(parsed.theme, "dark");
  assert.equal(parsed.emails[3].subject, "Custom day 4");
});

test("parseStoredState rejects malformed stored flow data", () => {
  const defaultState = createDefaultState();
  const stored = JSON.stringify({
    campaignName: "",
    selectedDay: 9,
    theme: "sparkle",
    emails: [{ day: 1, subject: "Only one email" }],
  });

  assert.deepEqual(parseStoredState(stored, defaultState), defaultState);
  assert.equal(parseStoredState("{", defaultState), defaultState);
});

test("flow reducers select, update, and reset without mutating original state", () => {
  const state = createDefaultState();
  const selected = selectDay(state, 6);
  const updated = updateEmail(selected, 6, {
    subject: "Automate the first handoff",
    cta: "Connect handoff",
  });
  const reset = resetFlow(updated);

  assert.equal(state.selectedDay, 1);
  assert.equal(selected.selectedDay, 6);
  assert.equal(updated.emails[5].subject, "Automate the first handoff");
  assert.notEqual(state.emails[5].subject, updated.emails[5].subject);
  assert.equal(reset.selectedDay, 1);
  assert.equal(reset.campaignName, state.campaignName);
});

test("formatEmail and exportFlow produce portable campaign content", () => {
  const state = createDefaultState();
  const formatted = formatEmail(state.emails[0]);
  const exported = JSON.parse(exportFlow(state));

  assert.match(formatted, /Day 1/);
  assert.match(formatted, /CTA:/);
  assert.equal(exported.schedule, "7 days, 1 email per day");
  assert.equal(exported.emails.length, 7);
});

test("served files do not reference disallowed providers or tooling", async () => {
  const servedFiles = [
    "public/app.js",
    "public/humans.txt",
    "public/index.html",
    "public/llm.txt",
  ];

  for (const file of servedFiles) {
    const content = await readFile(file, "utf8");
    assert.doesNotMatch(content, /\bgit\b|cloudflare/i, file);
  }
});
