//@ts-check

const fs = require("fs");
const meter = require("stream-meter");

/**
 * @param {NodeJS.ReadableStream} file
 * @param {string} filepath
 * @returns {Promise}
 */
function saveFile(file, filepath) {
  // make an un-capped meter
  const m = meter();

  const writeStream = fs.createWriteStream(filepath);
  file.pipe(m).pipe(writeStream);

  // File is being processed by Busboy; wait for it to be written to disk.
  return new Promise((resolve, reject) => {
    file.on("end", () => {
      writeStream.end();
    });
    writeStream.on("finish", () => {
      console.log("finish", "filepath", filepath, "bytes", m.bytes);
      resolve();
    });
    writeStream.on("error", () => {
      console.log("error", "filepath", filepath, "bytes", m.bytes);
      reject();
    });
  });
};

module.exports = saveFile;
