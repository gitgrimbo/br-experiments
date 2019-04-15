import React from "react";

import schedule from "./schedule";

function sortByDate(items) {
  return items.sort((a, b) => (!a.date || !b.date) ? 0 : new Date(a.date).getTime() - new Date(b.date).getTime());
}

const team1strs = [
  `WEEK 1 : APRIL 7th  – @ Halton ‘Robots of Doom’ (12pm start)`,
  `WEEK 2 : APRIL 14th  – @ Manchester Bee’s (12pm start)`,
  `(LEAGUE BYE WEEK - EASTER 21st APRIL)`,
  `WEEK 3 : APRIL 28th  – @ Manchester A’s (12pm start)`,
  `(LEAGUE BYE WEEK 5th MAY)`,
  `WEEK 4 : MAY 12th @ Sheffield Bladerunners II (1pm start)`,
  `WEEK 5 : MAY 19th @ Newcastle Nighthawks (1pm start) `,
  `(LEAGUE BYE WEEK 26th MAY)`,
  `WEEK 6 : (BYE WEEK 2nd JUNE)`,
  `WEEK 7 : JUNE 9th  – @ Manchester Bee’s (12pm start)`,
  `WEEK 8 : (BYE WEEK JUNE 16th  FATHER’S DAY) -poss. Friendly at HULL`,
  `WEEK 9 : (BYE WEEK JUNE 23rd) – Friendly @ Wolverhampton Wolves`,
  `(LEAGUE BYE WEEK June 30th MLB LONDON)`,
  `WEEK 10 : JULY 7th – Vs Sheffield Bladerunners II (1pm start)`,
  `WEEK 11 : JULY 14th – Vs Newcastle Nighthawks (1pm start)`,
  `WEEK 12 : JULY 21st  - @ Newcastle Nighthawks ( 1pm start ) `,
  `WEEK 13 : JULY 28th  - Vs Liverpool Twojans (1pm start) `,
  `WEEK 14 : AUGUST 4th  - @ Harrogate Tigers (12pm start)`,
  `WEEK 15 : AUGUST 11th – Vs Newcastle Nighthawks (1pm start)`,
  `WEEK 16 : AUGUST 18th– Vs Sheffield Bladerunners II (1pm start)`,
  `(LEAGUE BYE WEEK AUGUST  25th )`,
  `WEEK 17 : SEPTEMBER 1st  Vs Manchester Bee’s (12pm start)`,
];

const team2strs = [
  `WEEK 1 : APRIL 7th  – @ Manchester Bee’s (12pm start)`,
  `WEEK 2 : APRIL 14th  – @ Newcastle Nighthawks (12pm start)`,
  `(LEAGUE BYE WEEK - EASTER 21st APRIL)`,
  `WEEK 3 : APRIL 28th  – Vs Manchester Bee’s (1pm start)`,
  `(LEAGUE BYE WEEK 5th MAY)`,
  `WEEK 4 : MAY 12th Vs Sheffield Bladerunners II (1pm start)`,
  `WEEK 5 : MAY 19th @ Hull Scorpions (12 pm start) `,
  `(LEAGUE BYE WEEK 26th MAY)`,
  `WEEK 6 : JUNE 2nd   Vs  Newcastle Nighthawks (1pm start)`,
  `WEEK 7 : JUNE 9th  – Vs Manchester A’s (1pm start)`,
  `WEEK 8 : (BYE WEEK JUNE 16th  FATHER’S DAY) -poss. Friendly at HULL`,
  `WEEK 9 : (BYE WEEK JUNE 23rd) – Friendly @ Wolverhampton Wolves`,
  `(LEAGUE BYE WEEK June 30th MLB LONDON)`,
  `WEEK 10 : JULY 7th – @ Sheffield Bladerunners II (1pm start)`,
  `WEEK 11 : JULY 14th – Vs Harrogate Tigers (1pm start)`,
  `WEEK 12 : JULY 21st  - @ Liverpool Twojans ( 12pm start ) `,
  `WEEK 13 : JULY 28th  - Vs Manchester Bee’s (1pm start) `,
  `WEEK 14 : (BYE WEEK  AUGUST 4th)`,
  `WEEK 15 : AUGUST 11th – @ Manchester Bee’s (12pm start)`,
  `WEEK 16 : AUGUST 18th– @ Sheffield Bladerunners II (1pm start)`,
  `(LEAGUE BYE WEEK AUGUST  25th )`,
  `WEEK 17 : SEPTEMBER 1st  @ Newcastle Nighthawks (12pm start)`,
];

const localLogoRoot = "../img/logos/";
const weeblyLogoRoot = "/files/theme/logos/";

const teamInfos = {
  "Halton ‘Robots of Doom’": [
    "../img/logos/logo.halton-robots-of-doom.64x64.resized.png",
    "https://twitter.com/Robots_Of_Doom",
  ],
  "Harrogate Tigers": [
    "../img/logos/logo.harrogate-tigers.64x64.resized.jpg",
    "https://twitter.com/HarrogateTigers",
  ],
  "Hull Scorpions": [
    "../img/logos/logo.hull-scorpions.64x64.resized.png",
    "https://twitter.com/hullscorpions",
  ],
  "Liverpool Twojans": [
    "../img/logos/logo.liverpool-trojans2.64x64.resized.png",
    "https://twitter.com/LiverpoolTrojan",
  ],
  "Long Eaton Storm": [
    "../img/logos/logo.long-eaton-storm.64x64.resized.png",
    "https://twitter.com/longeatonstorm",
  ],
  "Manchester A’s": [
    "../img/logos/logo.manchester.64x64.resized.png",
    "https://twitter.com/MANCBASEBALL",
  ],
  "Manchester Bee’s": [
    "../img/logos/logo.manchester.64x64.resized.png",
    "https://twitter.com/MANCBASEBALL",
  ],
  "Newcastle Nighthawks": [
    "../img/logos/logo.newcastle-nighthawks.64x64.resized.jpg",
    "https://twitter.com/NCLNighthawks",
  ],
  "Sheffield Bladerunners I": [
    "../img/logos/logo.bladerunners.64x64.resized.png",
    "https://twitter.com/BladerunnersBC",
  ],
  "Sheffield Bladerunners II": [
    "../img/logos/logo.bladerunners.64x64.resized.png",
    "https://twitter.com/BladerunnersBC",
  ],
  "Wolverhampton Wolves": [
    "../img/logos/logo.wolverhampton.64x64.resized.jpg",
    "https://www.facebook.com/wolvesballclub/",
  ],
  "Worcester Sorcerers": [
    "../img/logos/logo.worcester-sorcerers2.64x64.resized.png",
    "https://twitter.com/worcssorcerers",
  ],
};

function parse(lines, teamName) {
  const months = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ];
  const pad0 = (s, n) => {
    s = String(s);
    while (s.length < n) {
      s = "0" + s;
    }
    return s;
  };
  return lines
    .map((line) => {
      line = line.trim();
      const middle = /^\((.*)\)$/.exec(line);
      if (middle) {
        line = middle[1];
      }
      const exec1 = /^WEEK (\d+)\s*:\s*(\w+ \d+).+(Vs|@)\s*(.+?)\s*\((.*)\)/.exec(line);
      if (exec1) {
        const [_, week, dateStr, vs, oppositionTeamName, start] = exec1;
        const [monthStr, dayStr] = dateStr.split(/\s/);
        const month = months.indexOf(monthStr.substring(0, 3).toLowerCase()) + 1;
        const date = new Date(`2019-${pad0(month, 2)}-${pad0(dayStr, 2)}T12:00:00`).toISOString().substring(0, 10);
        return {
          teamName,
          week,
          date,
          vs: vs.toLowerCase(),
          oppositionTeamName: oppositionTeamName,
          start: start.replace(/start/gi, "").replace(/\s+/g, ""),
          line,
        };
      }
      const exec2 = /^WEEK (\d+)\s*:\s*/.exec(line);
      let week = undefined;
      let date = undefined;
      if (exec2) {
        week = exec2[1];
        line = line.substring(exec2[0].length);
      }
      return {
        teamName,
        week,
        date,
        bye: line,
        line,
      };
    });
}

/*
// only use this when creating the initial calendar
const calendar2 = sortByDate(
  parse(team1strs, "I").concat(parse(team2strs, "II"))
);
window.calendar2 = calendar2;
*/

// local ref to global schedule.
const calendar = window.calendar = schedule;

function Schedule({ teamInfos }) {
  return (
    <React.Fragment>
      <style>
        {`
          table.schedule {
            border-collapse: collapse;
            width: 100%;
            empty-cells: show;
          }
          table.schedule tr td, table.schedule tr th { 
            text-align: center;
            padding: 0.2em;
            border: 2px solid #dbe6fe;
          }
          table.schedule tr.bye { 
            color: white;
            background: grey;
          }
          table.schedule tr.bye td { 
            border-color: transparent;
          }
          @media (max-width: 360px) {
            table.schedule th span.homeOrAway, table.schedule th span.team { 
              display: none;
            }
          }
        `}
      </style>
      <table cellSpacing="0" cellPadding="0" border="0" className="schedule">
        <tbody>
          <tr>
            <th>Date</th>
            <th><span className="team">Team</span></th>
            <th><span className="homeOrAway">H/A</span></th>
            <th colSpan="2">Versus</th>
            <th>Start</th>
          </tr>
          {
            calendar
              .map((item, i) => {
                const dateStr = new Date(item.date)
                  .toUTCString()
                  .split(/\s/)
                  .slice(0, 3)
                  .join(" ")
                  .replace(/,/g, "");
                if (item.bye) {
                  return (
                    <tr key={i} className="bye">
                      <td>{dateStr}</td>
                      <td>{item.teamName}</td>
                      <td colSpan="99">{item.bye}</td>
                    </tr>
                  );
                }
                const [logoUrl, homePage] = teamInfos[item.oppositionTeamName];
                const logoImg = logoUrl ? <img src={logoUrl} width="64" border="0" /> : null;
                const logoCell = (logoImg && homePage) ? <a href={homePage}>{logoImg}</a> : logoImg;
                const oppositionCell = homePage ? <a href={homePage}>{item.oppositionTeamName}</a> : item.oppositionTeamName;
                return (
                  <tr key={i}>
                    <td>{dateStr}</td>
                    <td>{item.teamName}</td>
                    <td>{item.vs}</td>
                    <td>{logoCell}</td>
                    <td>{oppositionCell}{item.friendly && " (F)"}</td>
                    <td>{item.start}</td>
                  </tr>
                );
              })
          }
        </tbody>
      </table>
    </React.Fragment>
  );
}

function App({ onRendered }) {
  const teamInfosCopy = JSON.parse(JSON.stringify(teamInfos));
  const [weeblyMode, setWeeblyMode] = React.useState(false);
  if (weeblyMode) {
    Object.keys(teamInfosCopy).forEach((key) => {
      const info = teamInfosCopy[key];
      const logoUrl = info[0];
      info[0] = logoUrl.replace(localLogoRoot, weeblyLogoRoot);
    });
  }
  React.useEffect(() => {
    onRendered();
  });
  return (
    <React.Fragment>
      <fieldset>
        <legend>Options</legend>
        Use Weebly mode: <input type="checkbox" checked={weeblyMode} onChange={(e) => setWeeblyMode(e.target.checked)} />
        <br />
        (uses img URLs pointing to files in the Weebly theme, rather than local files)
        </fieldset>
      <br />
      <div data-bladerunners-schedule="true">
        <Schedule teamInfos={teamInfosCopy} />
      </div>
    </React.Fragment>
  );
}

export default App;
