const fs = require("fs");
const path = require("path");
const libxml = require("libxmljs");
const { promisify } = require("util");

const execFile = promisify(require("child_process").execFile);
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

const inkscapePath = "C:/apps/Inkscape/inkscape.exe";

const [svgPath] = process.argv.slice(2);
console.log(svgPath);

const players = [
  {
    name: "Nestor Martinez",
    number: "88",
    position: "Shortstop",
    playerUrl: "nestor.png",
  },
  {
    name: "Jack Lockwood",
    number: "1",
    position: "Pitcher",
    playerUrl: "jack-l.png",
  },
  {
    name: "AK Kelly",
    number: "4",
    position: "3rd Base",
    playerUrl: "ak.png",
  },
];

async function svgToPng(svgPath, pngPath) {
  const { stdout, stderr } = await execFile(inkscapePath, [
    `--export-png=${pngPath}`,
    svgPath,
  ]);
  console.log("stdout", stdout);
  console.log("stderr", stderr);
}

function updateSvg(doc, player) {
  function setText(xpath, value) {
    const n = doc.get(xpath);
    console.log(`Changing "${n.text()}" to "${value}"`)
    n.text(value);
  }

  function setAttr(xpath, attrName, value) {
    const n = doc.get(xpath);
    const attr = n.attr(attrName);
    console.log(`Changing "${attr}" to "${value}"`)
    // have to set the attr value on the attr itself
    attr.value(player.playerUrl);
  }

  setText(`//*[@id="player-name"]`, player.name);
  setText(`//*[@id="player-number"]`, player.number);
  setText(`//*[@id="player-position"]`, player.position);
  setAttr(`//*[@id="player-image"]`, "href", player.playerUrl);
}

async function main({
  deleteTempSvgs = true,
} = {}) {
  const promises = players.map(async (player, i) => {
    console.log(player);

    // read and modify the SVG
    const svgStr = fs.readFileSync(svgPath, "utf8");
    const doc = libxml.parseXmlString(svgStr);
    updateSvg(doc, player);

    const xml = doc.toString();
    const tempSvgPath = `temp.${i}.svg`;

    try {
      await writeFile(tempSvgPath, xml);
      // create the PNG
      const pngPath = (player.name + "." + player.number + ".png").replace(/ /g, "_");
      await svgToPng(tempSvgPath, pngPath);
    } finally {
      if (deleteTempSvgs) {
        await unlink(tempSvgPath);
      }
    }
  });

  return Promise.all(promises);
}

(async () => {
  try {
    await main();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();

