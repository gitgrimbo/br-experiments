/*

Use:

node cli\export-faces.js photos\info.txt

Where arg[0] is a CSV file of:

IMG_NAME,PLAYER_NAME,IMG_WIDTH,IMG_HEIGHT

e.g.

IMG_5060.jpg,Sean Harrison,3883,4118

The ".jpg" part will be stripped (call this IMG_BASE_NAME),
and an SVG will be created that points to
- an SVG of paths called IMG_BASE_NAME.paths.svg.
- a JPG called IMG_BASE_NAME.jpg.

*/

const fsp = require("fs").promises;
const makeDir = require("make-dir");
const { exportFace, resize } = require("./export-face");

async function loadProfiles(profilesFile) {
  const text = await fsp.readFile(profilesFile, "utf8");
  const profiles = text
    .split(/[\n\r]/)
    .map((line) => line.split(","))
    .map(([svgName, playerName, width, height]) => ({
      svgName,
      playerName,
      width,
      height,
    }))
    .filter(({ playerName }) => !!playerName);
  return profiles;
}

async function exportFaces(profilesFile) {
  await makeDir("faces");

  const profiles = await loadProfiles(profilesFile);
  for (const profile of profiles) {
    const { svgName } = profile;
    const imgBaseName = svgName.replace(/\.[^.]+/, "");
    console.log(`Exporting ${imgBaseName}`);
    await exportFace({
      imgBaseName: imgBaseName,
      outFile: `faces/${imgBaseName}.png`,
    });
    const height = 100;
    await resize({
      inFile: `faces/${imgBaseName}.png`,
      height,
      outFile: `faces/${imgBaseName}.h${height}.png`,
    });
  }
}

async function main() {
  const [profilesFile] = process.argv.slice(2);
  await exportFaces(profilesFile);
}

main()
  .catch((err) => console.error(err));
