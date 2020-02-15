//@ts-check

/*

Google Cloud Function that take in an (SVG) image and outputs a PNG image.

The following form fields (multipart data) should be sent in the request:

- image.name (e.g. "starting-lineup.svg")
- image.type (e.g. "svg", but not currently used. image type is derived from image.name extension)
- image.data (e.g. the XML of the SVG)

*/

const fs = require("fs");
const os = require("os");
const path = require("path");
const http = require("http");
const Busboy = require("busboy");

const { isOriginAllowed } = require("./allowed-origins");
const screenshot = require("./screenshot");
const saveFile = require("./save-file");

class FieldsAndFiles {
  constructor(tmpdir) {
    this.tmpdir = tmpdir;
    // This object will accumulate all the fields, keyed by their name.
    this.fields = {};
    // This object will accumulate all the uploaded files, keyed by their name.
    this.files = {};
    // array of Promises
    this.fileWrites = [];
  }

  /**
   * Remember the field.
   * @param {string} fieldname 
   * @param {any} val 
   */
  addField(fieldname, val) {
    this.fields[fieldname] = val;
  }

  /**
   * Save the file to disk.
   * @param {string} fieldname 
   * @param {NodeJS.ReadableStream} file 
   * @param {string} filename 
   */
  addFile(fieldname, file, filename) {
    // Note: os.tmpdir() points to an in-memory file system on GCF
    // Thus, any files in it must fit in the instance's memory.
    const filepath = path.join(this.tmpdir, filename);
    this.files[fieldname] = filepath;

    const promise = saveFile(file, filepath);
    this.fileWrites.push(promise);
  }

  /**
   * there can be an image in the form fields.
   * if one is present, then record it in "files"
   * @returns {boolean}
   */
  checkForImageInTheFormFields() {
    const imageName = this.fields["image.name"];
    const imageType = this.fields["image.type"];
    const imageData = this.fields["image.data"];

    const isImage = (imageName && imageType && imageData);
    if (!isImage) {
      return false;
    }

    const filepath = path.join(this.tmpdir, imageName);
    console.log("writing image data", filepath);
    this.files[imageName] = filepath;
    const promise = new Promise((resolve, reject) => {
      fs.writeFile(filepath, imageData, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
    this.fileWrites.push(promise);

    return true;
  }

  async waitForWrites() {
    return await Promise.all(this.fileWrites);
  }

  deleteFiles() {
    for (const name in this.files) {
      const file = this.files[name];
      try {
        fs.unlinkSync(file);
      } catch (err) {
        // ignore
      }
    }
  }
}

/**
 *
 *
 * @param {http.IncomingMessage} req
 * @param {({fields,uploads}) => {}} fileHandler
 * @returns
 */
function getUploads(req, fileHandler) {
  return new Promise((resolve, reject) => {
    const busboy = new Busboy({ headers: req.headers });

    // Note: os.tmpdir() points to an in-memory file system on GCF
    // Thus, any files in it must fit in the instance's memory.
    const fieldsAndFiles = new FieldsAndFiles(os.tmpdir());

    // This code will process each non-file field in the form.
    busboy.on("field", (fieldname, val) => {
      console.log("busboy.on.field", fieldname);
      fieldsAndFiles.addField(fieldname, val);
    });

    // This code will process each file uploaded.
    busboy.on("file", (fieldname, file, filename) => {
      console.log("busboy.on.file", fieldname, filename);
      fieldsAndFiles.addFile(fieldname, file, filename);
    });

    // Triggered once all uploaded files are processed by Busboy.
    // We still need to wait for the disk writes (saves) to complete.
    busboy.on("finish", async () => {
      console.log("busboy.on.finish");

      try {
        fieldsAndFiles.checkForImageInTheFormFields();

        await fieldsAndFiles.waitForWrites();

        // give the caller an opportunity to use the files before we delete them
        await fileHandler({
          fields: fieldsAndFiles.fields,
          uploads: fieldsAndFiles.files,
        });

        resolve();
      } catch (err) {
        reject(err);
      } finally {
        fieldsAndFiles.deleteFiles();
      }

      // we don't end the response here because the fileHandler should do so.
    });

    // https://cloud.google.com/functions/docs/writing/http#handling_multipart_form_uploads
    // req.pipe(busboy) will not work
    // so use
    busboy.end(req.rawBody);
  });
};

exports.screenshot = async (req, res) => {
  console.log("screenshot");

  // Need to enable CORS to send errors
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "OPTIONS, GET, POST");

  const origin = req.headers.origin;
  if (origin && !isOriginAllowed(origin)) {
    res.status(500).send("Unauthorised use");
    return;
  }

  const fileHandler = async ({ fields, uploads }) => {
    console.log("fileHandler", "fields", Object.keys(fields), "uploads", Object.keys(uploads));

    for (const name in uploads) {
      const upload = uploads[name];

      console.log("name", name, "upload", upload);

      const imageBuffer = await screenshot(upload);
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

