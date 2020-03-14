import { promises as fsp } from "fs";

export async function loadGoogleSheet(file) {
  const text = await fsp.readFile(file, "utf8");
  const lines = text.split(/[\n\r]/);
  const data = lines
    .filter((line) => !!line)
    .map((line) => line.split(/\t/))
    .map(([number, name, retired, allocated, team, shirt, squad, face, faceh100]) => ({
      number,
      name,
      retired,
      allocated,
      team,
      shirt,
      squad,
      face,
      faceh100,
    }))
  return data;
}
