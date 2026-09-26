import assert from "node:assert/strict";
import { chromium } from "playwright-core";

const baseUrl = process.env.PERSONAL_OS_URL ?? "http://127.0.0.1:4174";
const browser = await chromium.launch({ headless: true });

async function checkViewport(name, viewport) {
  const page = await browser.newPage({ viewport });
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
  const work = page.getByRole("region", { name: "Selected work" });
  await work.getByText("MILE 01", { exact: false }).first().waitFor();
  const catch5 = work.getByRole("article").filter({ hasText: "Catch 5" });
  await catch5.getByText("In development", { exact: true }).waitFor();
  assert.equal(await catch5.getByRole("link").count(), 0, `${name}: unverified Catch 5 is linked`);

  /* The terminal is closed until asked for, and a tap on a card runs the same
     router as a typed command. */
  assert.equal(await page.getByLabel("Portfolio command").isVisible(), false, `${name}: terminal open on load`);
  await work.getByRole("link", { name: /Trip Proposal Change Control/ }).click();
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

  for (const route of ["/work/vero", "/work/itinerary-control", "/resume", "/timeline"]) {
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
} finally {
  await browser.close();
}
