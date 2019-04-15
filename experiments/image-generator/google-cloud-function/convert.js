/*

Google Cloud Function that take in an (SVG) image and outputs a PNG image.

The following form fields (multipart data) should be sent in the request:

- image.name (e.g. "starting-lineup.svg")
- image.type (e.g. "svg", but not currently used. image type is derived from image.name extension)
- image.data (e.g. the XML of the SVG)

*/

const fs = require("fs");
const gm = require("gm").subClass({ imageMagick: true });
const os = require("os");
const path = require("path");

const getUploads = require("./getUploads");

async function convertImagePost(req, res) {
  const sendFile = async (srcfile, destfile) => {
    await new Promise((resolve, reject) => {
      gm(srcfile).write(destfile, (err) => err ? reject(err) : resolve());
    });
    const readStream = fs.createReadStream(destfile);
    readStream.pipe(res);
  };

  const fileHandler = async ({ fields, uploads }) => {
    console.log("fileHandler", "fields", Object.keys(fields), "uploads", Object.keys(uploads));
    const tmpdir = os.tmpdir();

    for (const name in uploads) {
      const upload = uploads[name];
      const outpath = path.resolve(tmpdir, `temp.${name}.png`);

      console.log(name, outpath);
      await sendFile(upload, outpath);

      // just handle first file
      return;
    }
  };

  try {
    await getUploads(req, fileHandler);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message || "convertImage.error");
  }
}

module.exports = async (req, res) => {
  console.log("convertImage");

  // Need to enable CORS to send errors
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "OPTIONS, GET, POST");

  const origin = req.headers.origin;
  if (["https://local.sheffieldbladerunners.co.uk", "https://gitgrimbo.github.io"].indexOf(origin) < 0) {
    res.status(500).send("Unauthorised use");
    return;
  }

  if (req.method === "POST") {
    convertImagePost(req, res);
  } else {
    // Return a "method not allowed" error
    res.status(405).end();
  }
};
