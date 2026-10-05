import assert from "node:assert/strict";
import { chromium } from "playwright-core";

const baseUrl = process.env.PERSONAL_OS_URL ?? "http://127.0.0.1:4174";
const browser = await chromium.launch({ headless: true });
const errors = [];


async function checkViewport(name, viewport) {
  const page = await browser.newPage({ viewport, colorScheme: "dark" });
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  const dimensions = await page.evaluate(() => ({
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  assert.equal(dimensions.innerWidth, viewport.width, `${name}: browser ignored viewport width`);
  assert.equal(dimensions.innerHeight, viewport.height, `${name}: browser ignored viewport height`);
  assert.equal(dimensions.scrollWidth, dimensions.innerWidth, `${name}: horizontal overflow`);
  await page.screenshot({ path: `/tmp/personal-os-${name}.png`, fullPage: true });

  /* Who Connor is comes first: one name heading, and a résumé button sized to
     its label rather than stretched across the column (D1, D2). */
  await page.getByRole("heading", { level: 1, name: "Connor Murphy" }).waitFor();
  assert.equal(await page.getByText("Personal OS", { exact: true }).count(), 0, `${name}: "Personal OS" still billed on the page`);
  const resumeButton = page.getByRole("link", { name: "Download résumé" });
  const resumeBox = await resumeButton.boundingBox();
  assert.ok(resumeBox && resumeBox.width < 260, `${name}: résumé button stretched to ${resumeBox?.width}px`);

  /* The road draws only the dated record, and links to the drawing to scale. */
  const road = page.getByRole("region", { name: "The road so far" });
  assert.equal(await road.getByRole("listitem").count(), 7, `${name}: road should show the 7 dated entries`);
  await road.getByText("B.S. Computer Science").waitFor();

  /* Mile-marker cards; Catch 5 is honest about its state and is not a link. */
  const work = page.getByRole("region", { name: "A few things I’m working through." });
  await work.getByRole("link", { name: "Evidence Room", exact: true }).waitFor();
  await page.getByRole("button", { name: "Building", exact: true }).click();
  assert.equal(await work.getByRole("article").count(), 3);
  await page.getByRole("searchbox", { name: "Search projects" }).fill("x".repeat(300));
  await page.getByText("No projects match that combination.").waitFor();
  await page.getByRole("button", { name: "Show all projects" }).click();
  assert.equal(await work.getByRole("article").count(), 7);
  await work.locator("summary").first().click();
  assert.ok(await work.locator("details").first().getAttribute("open") !== null);
  await page.getByRole("button", { name: "Explore how a claim changes" }).click();
  await page.getByRole("button", { name: "Play video", exact: true }).click();
  await page.getByRole("button", { name: "Pause video", exact: true }).waitFor();
  await page.getByRole("button", { name: "3. Revise the claim" }).click();
  await page.getByText("The cause is still uncertain.", { exact: true }).first().waitFor();
  await page.screenshot({ path: `/tmp/personal-os-${name}-motion.png`, fullPage: true });
  const catch5 = work.getByRole("article").filter({ hasText: "Catch 5" });
  await catch5.getByText("In development", { exact: true }).waitFor();
  assert.equal(await catch5.getByRole("link").count(), 0, `${name}: unverified Catch 5 is linked`);

  /* The terminal is closed until asked for, and a tap on a card runs the same
     router as a typed command. */
  assert.equal(await page.getByLabel("Portfolio command").isVisible(), false, `${name}: terminal open on load`);
  await work.getByRole("link", { name: "Proposal Control", exact: true }).click();
  await page.waitForURL(`${baseUrl}/work/itinerary-control`);
  await page.goto(baseUrl, { waitUntil: "networkidle" });

  if (name === "desktop") {
    await page.keyboard.press("Control+k");
  } else {
    await page.getByRole("button", { name: "Open the terminal", exact: true }).click();
  }
  await page.getByLabel("Portfolio command").waitFor();
  await page.getByLabel("Portfolio command").fill("sudo whoami");
  await page.getByLabel("Portfolio command").press("Enter");
  await page.getByText("command not found", { exact: false }).waitFor();
  await page.getByText("last exit 127", { exact: false }).waitFor();
  await page.getByLabel("Portfolio command").fill("open catch-5");
  await page.getByLabel("Portfolio command").press("Enter");
  await page.getByText("destination not verified yet", { exact: false }).waitFor();
  await page.keyboard.press("Escape");
  await page.getByLabel("Portfolio command").waitFor({ state: "hidden" });

  if (name === "mobile") {
    await page.getByRole("button", { name: "Open the terminal", exact: true }).click();
    await page.getByLabel("Portfolio command").fill("open itinerary-control");
    await page.getByLabel("Portfolio command").press("Enter");
    await page.waitForURL(`${baseUrl}/work/itinerary-control`);

    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Open the terminal", exact: true }).click();
    await page.getByLabel("Portfolio command").fill("open vero");
    await page.getByLabel("Portfolio command").press("Enter");
    await page.waitForURL(`${baseUrl}/work/vero`);
  }

  for (const route of ["/work/evidence-room", "/work/interview-gym-coach", "/work/vero", "/work/itinerary-control", "/resume", "/timeline"]) {
    const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
    assert.equal(response?.status(), 200, `${route}: expected HTTP 200`);
    const width = await page.evaluate(() => document.documentElement.scrollWidth);
    assert.equal(width, viewport.width, `${name} ${route}: horizontal overflow`);
  }
  const resumePdf = await page.request.get(`${baseUrl}/Connor_Murphy_Resume.pdf`);
  assert.equal(resumePdf.status(), 200, "/Connor_Murphy_Resume.pdf: expected HTTP 200");
  assert.match(resumePdf.headers()["content-type"] ?? "", /application\/pdf/);
  await page.close();
  console.log(`[OK] ${name} ${viewport.width}x${viewport.height}: no overflow; interaction and routes passed`);
}

try {
  await checkViewport("mobile", { width: 390, height: 844 });
  await checkViewport("desktop", { width: 1440, height: 1000 });
  const page = await browser.newPage({ viewport: {width: 390, height: 844}, reducedMotion: "reduce", colorScheme: "light" });
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto(baseUrl);
  await page.getByRole("button", { name: "Explore how a claim changes" }).click();
  await page.locator(".static-chapter").waitFor();
  await page.getByRole("button", { name: "3. Revise the claim" }).click();
  await page.locator(".static-chapter").getByText("The cause is still uncertain.").waitFor();
  assert.equal(await page.locator("video, audio").count(), 0);
  await page.screenshot({path: "/tmp/personal-os-mobile-reduced-light.png", fullPage: true});
  await page.close();
  assert.deepEqual(errors, [], "browser errors");
  console.log("[OK] reduced motion, light theme, zero browser errors");
} finally {
  await browser.close();
}
