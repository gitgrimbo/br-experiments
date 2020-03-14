/*

Use:

node cli\export-face.js IMG_5070 out.png

Where
- args[0] is the image base name. There should be a bitmap file and a paths file with this base name, e.g.
    ./photos/IMG_5070.jpg
    ./IMG_5070.paths.svg
- args[1] is the output file.

*/

const { spawnSync } = require("child_process");
const fsp = require("fs").promises;
const { DOMParser, XMLSerializer } = require("xmldom");
const svgpath = require("svgpath");
const sharp = require("sharp");

const inkscapePath = "c:\\apps\\Inkscape\\bin\\inkscape.exe";

function inkscape(...args) {
  return spawnSync(inkscapePath, args);
}

function inkscapeExportId(srcFile, id, destFile) {
  const args = ["--export-id", id, "--export-filename", destFile, srcFile];
  console.log("export-id", ...args);
  const child = inkscape(...args);
  const out = String(child.stdout);
  return out;
}

function inkscapeExport(srcFile, destFile) {
  const args = ["--export-filename", destFile, srcFile];
  console.log("export", ...args);
  const child = inkscape(...args);
  const out = String(child.stdout);
  return out;
}

function showHideStyle(show) {
  const display = show ? "block" : "none";
  return `display: ${display}; fill:red; `;
}

// NOT USED
function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// NOT USED
async function pathBounds(pathFile, id) {
  const pathsSrc = await fsp.readFile(pathFile, "utf8");
  const $paths = cheerio.load(pathsSrc);
  const pathEl = $paths(`#${id}`);
  const path = pathEl.attr("d");
  let minx;
  let miny;
  let maxx;
  let maxy;
  const min = (min, n) => typeof min === "number" ? Math.min(min, n) : n;
  const max = (max, n) => typeof max === "number" ? Math.max(max, n) : n;
  svgpath(path)
    .iterate(function(segment, index, x, y) {
      if (index > 0) {
        minx = min(minx, x);
        maxx = max(maxx, x);
        miny = min(miny, y);
        maxy = max(maxy, y);
      }
    });
  return {
    minx,
    miny,
    maxx,
    maxy,
  };
}

function createSVG({
  svgPathsPath,
  bitmapPath,
}) {
  return `
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg
  xmlns="http://www.w3.org/2000/svg"
  xmlns:svg="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  version="1.1"
>
  <defs>
    <clipPath
      clipPathUnits="userSpaceOnUse"
      id="clip-path-profile"
    >
      <use
        xlink:href="${svgPathsPath}#profile"
        width="100%"
        height="100%" />
    </clipPath>
    <clipPath
      clipPathUnits="userSpaceOnUse"
      id="clip-path-face"
    >
      <use
        xlink:href="${svgPathsPath}#face"
        width="100%"
        height="100%" />
    </clipPath>
  </defs>
  <g
    clip-path="url(#clip-path-profile)"
    class="profile"
    id="profile"
  >
    <image xlink:href="${bitmapPath}" />
  </g>
  <g
    clip-path="url(#clip-path-face)"
    class="face"
    id="face"
  >
    <image xlink:href="${bitmapPath}" />
  </g>
</svg>
  `;
}

async function exportFace({
  imgBaseName,
  outFile,
}) {
  // remove profile and leave face
  const svgSrc = createSVG({
    bitmapPath: `./photos/${imgBaseName}.jpg`,
    svgPathsPath: `./${imgBaseName}.paths.svg`,
  });

  // crude way of hiding the profile using regex replace
  // const svgSrcReplaced = svgSrc.replace(new RegExp(`id="${profileId}"`), `id="${profileId}" style="display:none;"`);
  // console.log(svgSrc === svgSrcReplaced);
  // await fsp.writeFile("temp.svg", svgSrcReplaced, "utf8");

  // better way of hiding the profile using XML DOM
  const doc = new DOMParser().parseFromString(svgSrc);
  const profileEl = doc.getElementById("profile");
  profileEl.parentNode.removeChild(profileEl);
  const svgSrc2 = new XMLSerializer().serializeToString(doc).trim();
  await fsp.writeFile("temp.svg", svgSrc2, "utf8");

  inkscapeExportId("temp.svg", "face", outFile);
}

async function resize({
  width,
  height,
  inFile,
  outFile,
}) {
  const resizeOpts = {};
  if (width) {
    resizeOpts.width = width;
  } else if (height) {
    resizeOpts.height = height;
  }
  await sharp(inFile)
    .resize(resizeOpts)
    .toBuffer()
    .then(async (data) => {
      await fsp.writeFile(outFile, data);
    });
}

async function main() {
  // eg. profileId "profile_svg_4"
  const [imgBaseName, outFile] = process.argv.slice(2);
  await exportFace({
    imgBaseName,
    outFile,
  });
}

exports.resize = resize;
exports.exportFace = exportFace;

if (require.main === module) {
  main()
    .catch((err) => console.error(err));
}
