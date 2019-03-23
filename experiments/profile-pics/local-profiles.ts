export interface Profile {
  profilePicName: string;
  playerName: string;
  number: string;
  faceUrl?: string;
  faceH100Url?: string;
  // for profile pics experiment. not used by diamond experiment.
  width?: string;
  height?: string;
}

export async function loadProfiles(url = "photos/info.txt"): Promise<Profile[]> {
  const response = await fetch(url);
  const text = await response.text();
  const lines = text.split(/[\n\r]/);
  const randomNumber = () => String(Math.trunc(Math.random() * 100));
  const profiles = lines
    .filter((line) => !!line)
    .map((line) => line.split(","))
    .map(([profilePicName, playerName, width, height]) => ({
      profilePicName,
      playerName,
      // numbers are not stored in info.txt (yet?)
      number: randomNumber(),
      width,
      height,
    } as Profile))
  return profiles;
}
