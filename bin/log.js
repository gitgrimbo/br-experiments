const { promises: fsp } = require("fs");
const { promisify } = require("util");
const execFile = promisify(require("child_process").execFile);

async function gitLog() {
  const result = await execFile("git", ["log"]);
  return result.stdout
    .split(/\n/)
    .filter((line) => line.indexOf("commit ") < 0)
    .filter((line) => line.indexOf("gitgrimbo") < 0);
}

async function main() {
  const log = await gitLog();
  const logStr = log.join("\n");
  const [indexHtmlPath] = process.argv.slice(2);
  const indexHtml = await fsp.readFile(indexHtmlPath, "utf8");
  const newHtml = indexHtml + `\n<pre>${logStr}</pre>`;
  await fsp.writeFile(indexHtmlPath, newHtml);
}

main().catch((err) => console.error(err));
