import assert from "node:assert/strict";
import { describe, test } from "node:test";
import {
  asOfValue,
  endValue,
  formatRange,
  startValue,
  timeline,
  TIMELINE_AS_OF,
  type TimelineEntry,
} from "@/data/timeline";

const span: TimelineEntry = { id: "a", lane: "work", title: "t", org: "o", start: "2022-05", end: "2022-08" };
const yearOnly: TimelineEntry = { id: "b", lane: "projects", title: "t", org: "o", start: "2021", end: "2022" };
const ongoing: TimelineEntry = { id: "c", lane: "work", title: "t", org: "o", start: "2026-04" };
const milestone: TimelineEntry = { id: "d", lane: "education", title: "t", org: "o", start: "2023-05", milestone: true };

describe("startValue / endValue", () => {
  test("a month starts at its first day, in fractional years", () => {
    assert.equal(startValue("2022-05"), 2022 + 4 / 12);
    assert.equal(startValue("2022-01"), 2022);
  });

  test("a bare year starts in January and ends in December", () => {
    assert.equal(startValue("2021"), 2021);
    assert.equal(endValue(yearOnly), 2023);
  });

  test("a month ends at its last day", () => {
    assert.equal(endValue(span), 2022 + 8 / 12);
  });

  test("a milestone has no width and an ongoing entry runs to the as-of date", () => {
    assert.equal(endValue(milestone), startValue(milestone.start));
    assert.equal(endValue(ongoing), asOfValue());
    assert.equal(endValue({ ...ongoing, end: TIMELINE_AS_OF }), asOfValue());
  });

  test("every real entry ends no earlier than it starts and within the record", () => {
    for (const entry of timeline) {
      assert.ok(endValue(entry) >= startValue(entry.start), entry.id);
      assert.ok(endValue(entry) <= asOfValue(), entry.id);
    }
  });
});

describe("formatRange", () => {
  test("keeps the resume's own precision", () => {
    assert.equal(formatRange(span), "May 2022 – Aug 2022");
    assert.equal(formatRange(yearOnly), "2021 – 2022");
  });

  test("an ongoing entry says present and a milestone is a single date", () => {
    assert.equal(formatRange(ongoing), "Apr 2026 – present");
    assert.equal(formatRange(milestone), "May 2023");
  });
});
