import * as React from "react";

import SVGDiamond, { SVGDiamondPlayer } from "./SVGDiamond";
import { loadProfiles, Profile } from "./load-profiles";
import { localFacePaths } from "./face-paths";

const googlePhotosUrls = localFacePaths;

function svgProfileIdForIdx(idx): string {
  return `profile_svg_${idx}`;
}

interface SVGStateItem {
  profile: Profile;
  id: string;
  ref: HTMLElement;
  loaded: boolean;
  fixed: boolean;
  imageBaseName: string;
}

function profilesToState(profiles: Profile[]): SVGStateItem[] {
  const imgBaseName = (profilePicName: string): string => profilePicName.replace(/\.[^.]+/, "")
  const state = profiles
    .filter(({ playerName }) => !!playerName)
    .map((profile, profileIdx) => ({
      profile,
      id: svgProfileIdForIdx(profileIdx),
      ref: null,
      loaded: null,
      fixed: false,
      imageBaseName: imgBaseName(profile.profilePicName),
    } as SVGStateItem));
  state.reverse();
  return state;
}

function stateItemToSVGDiamondPlayer(stateItem: SVGStateItem): SVGDiamondPlayer {
  let faceImagePath = `faces/${stateItem.imageBaseName}.png`;

  const useGooglePhotoIfPresent = true;

  if (useGooglePhotoIfPresent) {
    const google = googlePhotosUrls[stateItem.imageBaseName];
    if (google) {
      faceImagePath = google["full"] || google["100"];
    }
  }

  return {
    name: stateItem.profile.playerName,
    faceImagePath,
  };
}

function subArrays<T>(arr: T[], size): T[][] {
  return arr.reduce((subArrays, player) => {
    if (!subArrays[subArrays.length - 1]) {
      subArrays.push([]);
    }
    const subArray = subArrays[subArrays.length - 1];
    subArray.push(player);
    if (subArray.length === size) {
      subArrays.push([]);
    }
    return subArrays;
  }, [])
    .filter((arr) => arr.length > 0);
}

const App: React.FC<{}> = () => {
  const [profiles, setProfiles] = React.useState();

  React.useEffect(() => {
    loadProfiles()
      .then((profiles) => setProfiles(profilesToState(profiles)));
  }, []);

  const players: SVGDiamondPlayer[] | undefined = profiles && profiles.map(stateItemToSVGDiamondPlayer);

  if (players) {
    players.sort((p1, p2) => p1.name.length - p2.name.length);
    players.reverse();
  }

  const lineups = players && subArrays(players, 9);

  return (
    <>
      {lineups && lineups.map((lineup, i) => <SVGDiamond key={i} players={lineup} />) || null}
    </>
  );
};

export default App;
