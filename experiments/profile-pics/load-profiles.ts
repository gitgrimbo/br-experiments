export interface Profile {
  profilePicName: string;
  playerName: string;
  width: number;
  height: number;
}

export async function loadProfiles(): Promise<Profile[]> {
  const response = await fetch("photos/info.txt");
  const text = await response.text();
  const lines = text.split(/[\n\r]/);
  const profiles = lines
    .filter((line) => !!line)
    .map((line) => line.split(","))
    .map(([profilePicName, playerName, width, height]) => ({
      profilePicName,
      playerName,
      width: parseInt(width, 10),
      height: parseInt(height, 10),
    } as Profile))
  return profiles;
}
