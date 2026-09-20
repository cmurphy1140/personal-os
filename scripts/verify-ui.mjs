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

  await page.getByRole("button", { name: "Itinerary Control" }).click();
  await page.getByRole("heading", { name: "Itinerary Change Control" }).waitFor();
  await page.getByLabel("Portfolio command").fill("sudo whoami");
  await page.getByLabel("Portfolio command").press("Enter");
  await page.getByText("command not found", { exact: false }).waitFor();
  await page.getByText("last exit 127", { exact: false }).waitFor();

  if (name === "mobile") {
    await page.getByLabel("Portfolio command").fill("open itinerary-control");
    await page.getByLabel("Portfolio command").press("Enter");
    await page.waitForURL(`${baseUrl}/work/itinerary-control`);

    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await page.route("https://github.com/cmurphy1140/Vero", (route) =>
      route.fulfill({ status: 200, contentType: "text/html", body: "verified Vero destination" }),
    );
    await page.getByLabel("Portfolio command").fill("open vero");
    await page.getByLabel("Portfolio command").press("Enter");
    await page.waitForURL("https://github.com/cmurphy1140/Vero");
    await page.unroute("https://github.com/cmurphy1140/Vero");
  }

  for (const route of ["/work/vero", "/work/itinerary-control", "/resume"]) {
    const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
    assert.equal(response?.status(), 200, `${route}: expected HTTP 200`);
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
