/*

Google Cloud Function that take in an (SVG) image and outputs a PNG image.

The following form fields (multipart data) should be sent in the request:

- image.name (e.g. "starting-lineup.svg")
- image.type (e.g. "svg", but not currently used. image type is derived from image.name extension)
- image.data (e.g. the XML of the SVG)

*/

const os = require("os");
const path = require("path");
const puppeteer = require("puppeteer");

const getUploads = require("./getUploads");

async function getBrowserPage() {
  // Launch headless Chrome. Turn off sandbox so Chrome can run under root.
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  return browser.newPage();
}

module.exports = async (req, res) => {
  console.log("screenshot");

  // Need to enable CORS to send errors
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "OPTIONS, GET, POST");

  const origin = req.headers.origin;
  if (["https://local.sheffieldbladerunners.co.uk", "https://gitgrimbo.github.io"].indexOf(origin) < 0) {
    res.status(500).send("Unauthorised use");
    return;
  }

  let page;

  const fileHandler = async ({ fields, uploads }) => {
    console.log("fileHandler", "fields", Object.keys(fields), "uploads", Object.keys(uploads));
    const tmpdir = os.tmpdir();

    for (const name in uploads) {
      const upload = uploads[name];
      const outpath = path.resolve(tmpdir, `temp.${name}.png`);

      console.log("name", name, "upload", upload, "outpath", outpath);

      if (!page) {
        page = await getBrowserPage();
      }

      const url = `file:///${upload}`;
      console.log("url", url);
      await page.goto(url);
      const svg = await page.$("svg");
      const imageBuffer = await svg.screenshot();
      res.set("Content-Type", "image/png");
      res.send(imageBuffer);

      // just handle first file
      return;
    }

    throw new Error("No image found");
  };

  try {
    await getUploads(req, fileHandler);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message || "screenshot.error");
  }
};
