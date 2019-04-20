const moveFile = require("move-file");
const args = process.argv.slice(2);
(async () => {
  try {
    await moveFile(args[0], args[1]);
  } catch (err) {
    console.error(err);
  }
})();
