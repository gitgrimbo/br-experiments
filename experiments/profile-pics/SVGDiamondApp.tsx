import * as React from "react";

import SVGDiamond, { SVGDiamondPlayer } from "./SVGDiamond";
import { Profile, loadProfiles } from "./local-profiles";
import { loadSpreadsheet } from "../google/sheets";

function sortPlayersByNameLength(players: SVGDiamondPlayer[]) {
  players.sort((p1, p2) => p1.name.length - p2.name.length);
  players.reverse();
}

interface SVGStateItem {
  profile: Profile;
  imageBaseName: string;
}

function stateItemToSVGDiamondPlayer(stateItem: SVGStateItem): SVGDiamondPlayer {
  const { profile } = stateItem;

  let faceImagePath = null;

  if (profile.faceUrl) {
    faceImagePath = profile.faceUrl;
  } else {
    faceImagePath = `faces/${stateItem.imageBaseName}.png`
  }

  return {
    name: stateItem.profile.playerName,
    number: stateItem.profile.number,
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

const makeLocalLineupSource = (setProfiles, setStatus) => ({
  name: "Local info",
  async load(): Promise<void> {
    try {
      setStatus("Loading local profiles...");
      const profiles = await loadProfiles();
      setStatus("Loaded local profiles.");

      const stripExtension = (s: string): string => s.replace(/\.[^.]+/, "");
      const imgBaseName = (profilePicName: string): string => stripExtension(profilePicName);
      const state = profiles
        .filter(({ playerName }) => !!playerName)
        .map((profile) => ({
          profile,
          imageBaseName: imgBaseName(profile.profilePicName),
        } as SVGStateItem));
      state.reverse();

      setProfiles(state);
    } catch (err) {
      setStatus(String(err));
    }
  },
});

const makeGoogleSheetLineupSource = (setProfiles, setStatus, googleSheetConfig: AppPropsGoogleSheetConfig) => ({
  name: "Google Sheet",
  async load(): Promise<void> {
    try {
      if (!googleSheetConfig) {
        throw new Error();
      }
      const sheet = await loadSpreadsheet(
        googleSheetConfig.apiKey,
        googleSheetConfig.clientId,
        googleSheetConfig.spreadsheetId,
        (progress) => {
          setStatus(progress);
        },
      );
      const { sheets } = sheet;
      const rosterSheet = sheets.find(({ properties }) => properties.title === "Full Roster");
      const profiles = rosterSheet.values
        // first row is headers
        .slice(1)
        .map(([number, name, retired, allocated, teamShirt, squad, face, faceh100]) => {
          return {
            profile: {
              profilePicName: "",
              playerName: name,
              number,
              faceUrl: face,
              faceH100Url: faceh100,
            } as Profile,
            imageBaseName: "",
          };
        })
        .filter(({ profile: { playerName } }) => !!playerName);
      console.log(profiles);
      setProfiles(profiles);
    } catch (err) {
      setStatus(String(err));
    }
  },
});

export interface AppPropsGoogleSheetConfig {
  spreadsheetId: string;
  clientId: string;
  apiKey: string;
}

export interface AppProps {
  googleSheetConfig: AppPropsGoogleSheetConfig;
}

function App(props: AppProps): React.ReactElement | null {
  const [lineupSource, setLineupSource] = React.useState(null);
  const [profiles, setProfiles] = React.useState<SVGStateItem[]>();
  const [status, setStatus] = React.useState("");

  const players: SVGDiamondPlayer[] | undefined = profiles && profiles.map(stateItemToSVGDiamondPlayer);
  let lineups = null;

  if (players) {
    sortPlayersByNameLength(players);
    lineups = subArrays(players, 9);
  }

  const lineupSources = [
    makeLocalLineupSource(setProfiles, setStatus),
    makeGoogleSheetLineupSource(setProfiles, setStatus, props.googleSheetConfig),
  ];

  const onChangeLineupSource = (e) => {
    e.preventDefault();
    const idx = e.target.selectedIndex - 1;
    if (idx >= 0) {
      // ignore blank item
      setLineupSource(lineupSources[idx]);
    }
  };

  React.useEffect(() => {
    if (lineupSource) {
      lineupSource.load();
    }
  }, [lineupSource]);

  return (
    <>
      <h1>Lineup Diamond</h1>
      <div style={{ margin: "1em 0" }}>
        <label>Load lineups from:&nbsp;
          <select onChange={onChangeLineupSource}>{
            [{ name: "" }, ...lineupSources].map(
              ({ name }, idx) =>
                <option key={idx} value={idx}>{name}</option>
            )
          }</select>
        </label>
        <pre>{status}</pre>
      </div>
      {lineups && lineups.map((lineup, i) => <SVGDiamond key={i} players={lineup} />) || null}
    </>
  );
}

export default App;
