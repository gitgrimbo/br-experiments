const Busboy = require("busboy");
const fs = require("fs");
const os = require("os");
const path = require("path");

module.exports = async function getUploads(req, fileHandler) {
  return new Promise((resolve, reject) => {
    const busboy = new Busboy({ headers: req.headers });
    const tmpdir = os.tmpdir();

    // This object will accumulate all the fields, keyed by their name
    const fields = {};

    // This object will accumulate all the uploaded files, keyed by their name.
    const uploads = {};

    const saveFile = (file, filepath) => {
      const writeStream = fs.createWriteStream(filepath);
      file.pipe(writeStream);

      // File was processed by Busboy; wait for it to be written to disk.
      return new Promise((resolve, reject) => {
        file.on("end", () => {
          writeStream.end();
        });
        writeStream.on("finish", resolve);
        writeStream.on("error", reject);
      });
    };

    // This code will process each non-file field in the form.
    busboy.on("field", (fieldname, val) => {
      fields[fieldname] = val;
    });

    let fileWrites = [];

    // This code will process each file uploaded.
    busboy.on("file", async (fieldname, file, filename) => {
      console.log("busboy.on.file", fieldname, file, filename);
      // Note: os.tmpdir() points to an in-memory file system on GCF
      // Thus, any files in it must fit in the instance's memory.
      const filepath = path.join(tmpdir, filename);
      uploads[fieldname] = filepath;

      const promise = saveFile(file, filepath);
      fileWrites.push(promise);
    });

    // Triggered once all uploaded files are processed by Busboy.
    // We still need to wait for the disk writes (saves) to complete.
    busboy.on("finish", async () => {
      console.log("busboy.on.finish");

      // if there is an image in the form fields, then record it in "uploads"
      try {
        const imageName = fields["image.name"];
        const imageType = fields["image.type"];
        const imageData = fields["image.data"];
        if (imageName && imageType && imageData) {
          const filepath = path.join(tmpdir, imageName);
          console.log("writing image data", filepath);
          uploads[imageName] = filepath;
          const promise = new Promise((resolve, reject) => {
            fs.writeFile(filepath, imageData, (err) => {
              if (err) return reject(err);
              resolve();
            });
          });
          fileWrites.push(promise);
        }

        await Promise.all(fileWrites);

        // give the caller an opportunity to use the files before we delete them
        await fileHandler({
          fields,
          uploads,
        });

        resolve();
      } catch (err) {
        reject(err);
      } finally {
        for (const name in uploads) {
          const file = uploads[name];
          fs.unlinkSync(file);
        }
      }
    });

    busboy.end(req.rawBody);
  });
};
