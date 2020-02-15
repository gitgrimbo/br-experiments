//@ts-check

const os = require("os");
const chromium = require("chrome-aws-lambda");

const requestCache = new Map();

/**
 * @param {chromium.puppeteer.Page} page
 * @param {string[]} [patterns]
 * @param {(buffer: Buffer) => Buffer} [transform]
 * @returns
 */
async function intercept(page, patterns, transform) {
  patterns = patterns || ["*"];

  const target = await page.target();
  if (!target) {
    return;
  }

  const client = await target.createCDPSession();

  await client.send("Network.enable");

  await client.send("Network.setRequestInterception", {
    patterns: patterns.map(pattern => ({
      urlPattern: pattern,
      //resourceType: "Script",
      interceptionStage: "HeadersReceived",
    })),
  });

  client.on("Network.requestIntercepted", async ({ interceptionId, request, responseHeaders, resourceType }) => {
    console.log(`Intercepted ${request.url} {interception id: ${interceptionId}}`);

    const response = await client.send("Network.getResponseBodyForInterception", { interceptionId });

    let newBody;
    let contentType;

    if (responseHeaders) {
      const contentTypeHeader = Object.keys(responseHeaders).find(k => k.toLowerCase() === "content-type");
      contentType = responseHeaders[contentTypeHeader];
    }

    if (requestCache.has(response.body)) {
      newBody = requestCache.get(response.body);
    } else {
      const bodyData = response.base64Encoded ? Buffer.from(response.body, "base64") : response.body;
      newBody = bodyData;
      try {
        if (resourceType.toLowerCase() === "script") {
          if (transform) {
            newBody = transform(bodyData);
          }
        }
      } catch (e) {
        console.log(`Failed to process ${request.url} {interception id: ${interceptionId}}: ${e}`);
      }

      requestCache.set(response.body, newBody);
    }

    const newHeaders = [
      "Date: " + (new Date()).toUTCString(),
      "Connection: closed",
      "Content-Length: " + newBody.length,
      "Content-Type: " + contentType
    ];

    console.log(`Continuing interception ${interceptionId}`)
    client.send("Network.continueInterceptedRequest", {
      interceptionId,
      //rawResponse: Buffer.from("HTTP/1.1 200 OK" + "\r\n" + newHeaders.join("\r\n") + "\r\n\r\n" + newBody).toString("base64"),
    });
  });

  console.log("end of intercept");
}

async function getBrowserPage() {
  // Launch headless Chrome. Turn off sandbox so Chrome can run under root.

  const opts = {
    args: chromium.args.concat(["--no-sandbox"]),
    //defaultViewport: chromium.defaultViewport,
  };

  // TODO fix for local and prod
  if (os.platform() !== "win32") {
    const executablePath = await chromium.executablePath;
    opts.executablePath = executablePath;
  }

  const browser = await chromium.puppeteer.launch(opts);

  browser.on("targetcreated", async (target) => {
    console.log("targetcreated");
    const page = await target.page();
    console.log("page exists", page && page.url());
    if (page) {
      intercept(page);
    }
  });

  // Create a new tab
  const page = await browser.newPage();

  return page;
}

/**
 * @param {string} svgFilepath
 * @returns {Promise<Buffer>}
 */
async function screenshot(svgFilepath) {
  console.log("screenshot", "svgFilepath", svgFilepath);

  const page = await getBrowserPage();

  const url = `file:///${svgFilepath}`;
  console.log("url", url);

  await page.goto(url);

  const elementToScreenshot = await page.$("svg");
  if (!elementToScreenshot) {
    throw new Error("Could not find SVG element in browser document");
  }

  return elementToScreenshot.screenshot({
    type: "png",
    encoding: "binary",
  });
}

module.exports = screenshot;
