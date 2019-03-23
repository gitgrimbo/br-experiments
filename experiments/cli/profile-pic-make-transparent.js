/*

This was an attempt at automating cropping of profile pics.

Because of the background used (a light blue blanket) and the colours of the shirts (and sometimes faces),
the floodfill tool cannot accurately find the boundary between blanket and player.

Bit of a shame!

*/

const { spawnSync } = require("child_process");

function profilePicInfo(name, url, defaultFuzz, fillPoints) {
  return {
    name,
    url,
    defaultFuzz,
    fillPoints,
  };
}

const remoteProfilePics = [
  profilePicInfo(
    "11.Paul_Grime",
    "https://lh3.googleusercontent.com/xFEvRb5b0dLWdLIled90pRZqBTGkquZaQ3CdGG-G44rJ3cZIMtJMz65bhJc-dQHhnN23ODkfjXrbKScypaFaccN__kjHb6ldAwrNmjocuEg9yj77vAJ1_h-C1g48ma3Gt5bC4oX7JYnuc0HP3EpfwoGE3kV787Yzyrtc4FfFEsZCMGbXFrv5uEqZPmIJ-MrCAU7keMXm3zro9XE_zy_2Yk9rSrXWmWSl9XDA29lsVigxUg1hHB_O8E0kLDY4_fXBbLzj6oFKEXn7DXX6lKfdlW_LnD7q_d-QIBLCW5AsVZfpelIljtpa6yRu92v9kNqw0fE7963JeYNcu21iraFB_vHPFqfHp7KNSAva1C98otkJMHh5qDB5ID24s8WdipaRsQPYhhL8mVr5rDR-GVS4Lh7oxdsioqczD9scJpxBkAgZmluFTg9eEe4THwL3MOYxqlzkl_yAuOxbvOn1WqyJz-UW_EvuZ72dH_ASAzcQpSq660rpxwy8ZnjQqHVlsCWIjdHSn6Jqj2YcnTv7Do9JlSFoK8YuTmJEP46juhrjsbEb7mZVIdObqYnA9a3vY31CtTiYQl4eCM_RZb8uAJ7ybeNzBwIi1ujAqUxc7S2rCr0bRmANWwG6e01UZbinLTLzBtVZ_0LcYAGG0Xej4DLwJVQDXK3fu1Hrz3fRpn_bJpBDHH5DOv5yXct8m76tiyu9UE_Yb15FsZwMpNJeI7YTzRQO2G5yLNVZO2Q8z5mPgOFuKnvSog=w1560-h1040-no",
    "5%",
    [[650, 650], [342, 646], [858, 839]],
  ),
  profilePicInfo(
    "1_Stephanie_Osman",
    "https://lh3.googleusercontent.com/N7aeGgTPYw29UizTa7cK_MuDb_9ychRSfkXnGGnHHsSsBdJFy5vSN_EAroOvAWHvGsQlSEhidu0cq-9ZByb31gldxB4_NhuG-ITKynDoi3z5UxWAjc1o8wrWX3Ea40yOuoKmA9_FgAV7wpVrhK3uSW4vAUVfCTVwm5Ucn_VX8B1_pTfMpm8NjL2Nf3kHsxsWd8eZnahrLnDFrwh5tePTLpjpy8Fa5gv0uayDxEbN7k6wVV_xr4U7K7XnSraUZB8HNfuiJOeLm6MO5uwJ4ypGmAPZRtu0e-Cb7FlhaJkPpTCGLVF_tXnNCBJz6vF_ru9lWI8BYwtN6OQHHdbAyGPbo6QD9LmdvL1n09j4IMm4cRVwRv4LGQRa0d3bbpW21ehiX9RvxFIYIqIxjTyc9DMpXhtcOgq8npn3xxXc0W3iC_TNlqH8sunb76Eo9DYZdV_IOLAxm4jvSpoOstVTVkynHPH9w9lM4HPlm5t9iqWvmr86OE5tQ1_omO9WZovfwML6FBtPtcsRy-fyqllIhTCuORN6UhJ6UBxBIAI-7nl9l-6K3DHnUyhrynqY11FlAnOCW2LkmbgMKhCT2fVkwVRVFlxTKlharKmtc6ahiusTglqQ8ZErhUz742-3VjzChGMi94xoR_i3ads5Pwjg59UyEDj5ZucXKwpVJrtWD5-wkexKsbvsW-HsltrMu_bucqExKXHibjM4WYlKsSENKxf6qUewOroLIK-yOAepFZFaBL0x9qWiEQ=w1528-h1018-no",
    "8%",
    [],
  ),
];

const localJPG = "profile-pic.jpg";

function curl(url, output) {
  return spawnSync("curl", [url, "-o", output]);
}

function magick(...args) {
  return spawnSync("magick", args);
}

function getImageSize(file) {
  const child = magick("identify", "-verbose", file);
  const out = String(child.stdout);
  const match = out.match(/Geometry:.(\d+)x(\d+)\+(\d+)\+(\d+)/);
  if (match) {
    const [_, width, height] = match;
    return {
      width,
      height,
    };
  }
}

remoteProfilePics.slice(1, 2).forEach(({ name, defaultFuzz, url, fillPoints }, i) => {
  console.log(i, `Downloading ${url}`);
  curl(url, localJPG);

  console.log(i, `Getting image dimensions`);
  const { width, height } = getImageSize(localJPG);

  console.log(i, `Converting to PNG`);
  const localPNG = `${name}.png`;
  magick("convert", localJPG, localPNG);
  console.log(i, `Rotating`);
  magick("convert", localPNG, "-rotate", "-90", localPNG);

  console.log(i, `Standard fuzz`);
  const fuzz = defaultFuzz || "4%";
  magick("convert", localPNG, "-fill", "transparent", "-fuzz", fuzz, "-draw", "color 0,0 floodfill", localPNG);
  magick("convert", localPNG, "-fill", "transparent", "-fuzz", fuzz, "-draw", `color ${width / 2},0 floodfill`, localPNG);
  magick("convert", localPNG, "-fill", "transparent", "-fuzz", fuzz, "-draw", `color ${width - 1},0 floodfill`, localPNG);
  console.log(i, `Custom fuzz`);
  fillPoints.forEach(([x, y]) => {
    magick("convert", localPNG, "-fill", "transparent", "-fuzz", fuzz, "-draw", `color ${x},${y} floodfill`, localPNG);
  })
});
