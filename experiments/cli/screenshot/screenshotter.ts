import * as  puppeteer from "puppeteer";

function wait(ms): Promise<void> {
  console.log("wait", ms);
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Makes a file path from a pattern by replacing the following:
 * - id, with the element id.
 * - idx0, with 0-based index.
 * - idx1, with 1-based index.
 */
async function makeFilePath(filePathPattern: string, element: puppeteer.ElementHandle<Element>, idx: number): Promise<string> {
  const id = String(await element.getProperty("id")) || "";
  filePathPattern = filePathPattern.replace(/\[id\]/, id);
  filePathPattern = filePathPattern.replace(/\[idx0\]/, String(idx));
  filePathPattern = filePathPattern.replace(/\[idx1\]/, String(idx + 1));
  return filePathPattern;
}

interface ScreenshotOpts {
  url: string;
  elementSelector?: string;
  destFile?: string;
  wait?: number;
  width?: number;
  height?: number;
  ignoreHTTPSErrors?: boolean;
}

async function screenshot(browser: puppeteer.Browser, opts: ScreenshotOpts): Promise<void> {
  const {
    url,
    elementSelector,
    destFile,
    wait: waitms,
    width = 1024,
    height = 768,
  } = opts;

  const page = await browser.newPage();
  await page.setViewport({
    width,
    height,
    deviceScaleFactor: 1,
  });
  await page.goto(url, {
    waitUntil: "networkidle0",
  });
  if (waitms) {
    await wait(waitms);
  }
  if (elementSelector) {
    const handles = await page.$$(elementSelector);
    // NOTE - this screenshotting is sequential.
    // Puppeteer doesn't seem to like doing element screenshots concurrently.
    // So we do them sequentially.
    let idx = 0;
    for (const handle of handles) {
      let path = `screenshot.element${idx + 1}.png`;
      if (destFile) {
        path = await makeFilePath(destFile, handle, idx);
      }
      console.log(`Saving ${path}`);
      await handle.screenshot({ path });
      idx++;
    }
  } else {
    const path = destFile || "screenshot.page.png";
    await page.screenshot({ path });
  }
}

async function main(opts: ScreenshotOpts): Promise<void> {
  console.log("Running with opts", opts);
  const { ignoreHTTPSErrors } = opts;
  const browser = await puppeteer.launch({
    ignoreHTTPSErrors,
  });
  try {
    await screenshot(browser, opts);
  } finally {
    await browser.close();
  }
}

function parseArgs(args: string[]): ScreenshotOpts {
  const numOpt = (name, argValue) => {
    const n = parseInt(argValue, 10);
    if (isNaN(n)) {
      throw new Error(`${name} is not a number`);
    }
    return n;
  };
  console.log(`
Usage:
  npx ts-node experiments/cli/screenshot/screenshotter.ts

Parameters (* optional) [default value]:
  elementSelector     CSS selector of element(s) to screenshot. Leave blank to screenshot full page.
  *width              Width of the browser [1024].
  *height             Height of the browser [768].
  *wait               Wait time in millis after the page loads, and before taking the screenshot(s).
  *destFile           An output filename pattern.
                        [id] replaced by element id (if multiple elements selected by elementSelector)
                        [idx0] replaced by 0-based index of element (if multiple elements selected by elementSelector)
                        [idx1] replaced by 1-based index of element (if multiple elements selected by elementSelector)
  *ignoreHTTPSErrors  Set to true to ignore any SSL errors from the website [false].

E.g.:

  npx ts-node experiments/cli/screenshot/screenshotter.ts elementSelector=svg[data-type=diamond] wait=1000 destFile=sample.diamond[idx1].png
`);

  const argOpts = args.reduce((opts, arg) => {
    const exec = /([^=]+)=(.*)/.exec(arg);
    const [_, name, value] = exec;
    opts[name] = value;
    return opts;
  }, {});
  const defaultOpts = {
    url: "https://localhost/experiments/profile-pics/diamond.html",
    width: "1024" as any,
    height: "768" as any,
    ignoreHTTPSErrors: "false" as any,
    wait: "0" as any,
  };
  const opts = {
    ...defaultOpts,
    ...argOpts,
  };
  if (!opts.url) throw new Error("url parameter is mandatory");
  if (opts.width) opts.width = numOpt("width", opts.width);
  if (opts.height) opts.height = numOpt("height", opts.height);
  if (opts.wait) opts.wait = numOpt("wait", opts.wait);
  if (opts.ignoreHTTPSErrors) opts.ignoreHTTPSErrors = ("true" === opts.ignoreHTTPSErrors);
  return opts;
}

const args = process.argv.slice(2);
console.log(args);
const opts = parseArgs(args);

main(opts).catch((err) => console.error(err));
