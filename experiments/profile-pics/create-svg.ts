// TODO

interface CreateSVGOps {
  id: string;
  svgName: string;
  svgPathsPath?: string;
  width: number;
  height: number;
  bitmapPath?: string;
}

function createSVG({
  id,
  svgName,
  svgPathsPath,
  width,
  height,
  bitmapPath,
}: CreateSVGOps): string {
  svgPathsPath = svgPathsPath || `${svgName}.paths.svg`;
  bitmapPath = bitmapPath || `photos/${svgName}.jpg`;

  return `
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg
  xmlns="http://www.w3.org/2000/svg"
  xmlns:svg="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  width="${width}"
  height="${height}"
  viewBox="0 0 ${width} ${height}"
  version="1.1"
  id="${id}"
>
  <defs>
    <clipPath
      clipPathUnits="userSpaceOnUse"
      id="${id}-clip-path-profile"
    >
      <use
        xlink:href="${svgPathsPath}#profile"
        width="100%"
        height="100%" />
    </clipPath>
    <clipPath
      clipPathUnits="userSpaceOnUse"
      id="${id}-clip-path-face"
    >
      <use
        xlink:href="${svgPathsPath}#face"
        width="100%"
        height="100%" />
    </clipPath>
  </defs>
  <g
    clip-path="url(#${id}-clip-path-profile)"
    class="profile"
    id="${id}-profile"
  >
    <image xlink:href="${bitmapPath}" />
  </g>
  <g
    clip-path="url(#${id}-clip-path-face)"
    class="face"
    id="${id}-face"
  >
    <image xlink:href="${bitmapPath}" />
  </g>
</svg>
  `;
}

export default createSVG;
