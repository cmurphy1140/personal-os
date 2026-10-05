/* The manifest rules from scripts/verify-destinations.mjs, mirrored here so
   they run offline with the rest of the suite (the script also HEAD-fetches
   every https href, which stays in `npm run validate:destinations`). */
import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { destinationKinds, destinations, findDestination } from "@/data/destinations";

describe("destination manifest", () => {
  test("slugs are lowercase kebab-case and unique", () => {
    const seen = new Set<string>();
    for (const destination of destinations) {
      assert.match(destination.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      assert.ok(!seen.has(destination.slug), `${destination.slug}: duplicate slug`);
      seen.add(destination.slug);
    }
  });

  test("every kind is a known kind", () => {
    for (const destination of destinations) {
      assert.ok((destinationKinds as readonly string[]).includes(destination.kind), destination.slug);
    }
  });

  test("hrefs are internal routes or https, never another scheme", () => {
    for (const destination of destinations) {
      assert.ok(
        destination.href.startsWith("/") || /^https:\/\//.test(destination.href),
        `${destination.slug}: ${destination.href}`,
      );
      assert.doesNotMatch(destination.href, /^(file:|javascript:|data:)/i, destination.slug);
    }
  });

  test("a verified destination has an href", () => {
    for (const destination of destinations) {
      if (destination.verified) assert.ok(destination.href, destination.slug);
    }
  });

  test("a case study lives at /work/<slug>", () => {
    for (const destination of destinations) {
      if (destination.kind === "case-study") assert.equal(destination.href, `/work/${destination.slug}`);
    }
  });

  test("primary case studies carry a phase, so the state filter can place them", () => {
    for (const destination of destinations) {
      if (destination.kind === "case-study" && destination.primary) {
        assert.ok("phase" in destination && destination.phase, `${destination.slug}: no phase`);
      }
    }
  });

  test("findDestination returns the entry or undefined, never a near match", () => {
    assert.equal(findDestination("vero")?.slug, "vero");
    assert.equal(findDestination("Vero"), undefined);
    assert.equal(findDestination("vero/"), undefined);
  });
});
