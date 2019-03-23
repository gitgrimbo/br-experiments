const fsp = require("fs").promises;
const clipboardy = require("clipboardy");
const svgpath = require("svgpath");
console.log(svgpath);

async function main(file) {
  const svgStr = await fsp.readFile(file, "utf8");
  console.log(svgStr);
  const exec = /\sd="([^"]+)"/gm.exec(svgStr);
  console.log(exec[1]);
  if (exec) {
    const [_, path] = exec;
    const newPath = svgpath(path)
      .rotate(90)
      .toString();
    console.log(newPath);
    await clipboardy.write(newPath);
  }
}

const args = process.argv.slice(2);
main(args[0]);
