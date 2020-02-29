import React from "react";
import ReactDOM from "react-dom";

function PlayerCard(props) {
  const [winSize, setWinSize] = React.useState({ w: 0, h: 0 });
  console.log(winSize);
  React.useEffect(() => {
    const listener = (e) => setWinSize({
      w: window.innerWidth,
      h: window.innerHeight,
    });
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, [winSize.w, winSize.h]);
  return <PlayerCardTable {...props} />;
}

function PlayerCardDiv(props) {
  return (
    <div>
      <style>
        {`
        .player-card {
          xxxborder: solid black 1px;
          xxxbackground: linear-gradient(#ffffff, #808080);
          position: relative;
          font-family: Impact, Charcoal, sans-serif;
        }
        .player-card div.percent50 {
          float: left;
          width: 50%;
          box-sizing: border-box;
        }
        .player-card div.percent33 {
          float: left;
          width: 33%;
          box-sizing: border-box;
        }
        .player-card div.left {
          padding: 1vw;
          xxxborder: solid 1px red;
        }
        .player-card div.right {
          padding: 0.5vw;
          xxxborder: solid 1px blue;
        }
      `}
      </style>
      <div className="player-card">
        <div className="left percent50">
          <PlayerCardLeft {...props}></PlayerCardLeft>
        </div>
        <div className="right percent50">
          <PlayerCardRight {...props}></PlayerCardRight>
        </div>
        <br style={{ clear: "both" }} />
      </div>
    </div>
  );
}

function PlayerCardTable(props) {
  const ref = React.useRef(null);
  const [baseFontSize, setBaseFontSize] = React.useState(0);
  const [clientWidth, setClientWidth] = React.useState();
  console.log(clientWidth);
  React.useEffect(() => {
    const cw = ref.current.clientWidth;
    setClientWidth(cw === 0 ? !clientWidth : cw);
    const baseFontSize = (cw / 20) + "px";
    setBaseFontSize(baseFontSize);
  });
  return (
    <div>
      <style>
        {`
        .player-card {
          xxxborder: solid black 1px;
          xxxbackground: linear-gradient(#ffffff, #808080);
          position: relative;
          font-family: Impact, Charcoal, sans-serif;
        }
        .player-card div.percent50 {
          float: left;
          width: 50%;
          box-sizing: border-box;
        }
        .player-card div.percent33 {
          float: left;
          width: 33%;
          box-sizing: border-box;
        }
        .player-card div.left {
          padding: 1%;
          xxxborder: solid 1px red;
        }
        .player-card div.right {
          padding: 1%;
          xxxborder: solid 1px blue;
        }
      `}
      </style>
      <div ref={ref} className="player-card" style={{ fontSize: baseFontSize }}>
        <table width="100%">
          <tbody>
            <tr>
              <td width="50%" valign="top"><PlayerCardLeft {...props} /></td>
              <td width="50%" valign="top"><PlayerCardRight {...props} /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
function PlayerCardLeft({ player, position, team, stats }) {
  return (
    <div>
      <style>
        {`
        .player-card .player-name {
          border: solid 1px black;
          border-radius: 1%;
          color: white;
          background: #013298;
          font-size: 100%;
          padding-top: 1%;
          padding-bottom: 1%;
          font-variant: small-caps;
          text-align: center;
        }
        .player-card .player-image-outer {
          border: solid 1px black;
          border-radius: 1%;
          background: #013298;
          padding: 1vw;
          margin-top: 1%;
          margin-bottom: 1%;
        }
        .player-card .player-image-inner {
          border: solid 1px white;
          border-radius: 1%;
          box-sizing: border-box;
        }
        .player-card .player-image-inner img {
          display: block; /* so the parent of the image is the same size as the image */
          border-radius: 1%;
        }
        .player-card .left-bottom {
          border: solid 1px black;
          border-radius: 1%;
          font-size: 80%;
          color: white;
          background: #013298;
          padding: 1%;
          padding-top: 2%;
          padding-bottom: 2%;
          font-variant: small-caps;
          text-align: center;
        }
        .player-card .team-logo-container {
          position: absolute;
          width: 10%;
          height: 10%;
          left: 0;
          top: 0;
        }
      `}
      </style>
      <div className="player-name">
        {player.name}
      </div>
      <div className="team-logo-container">
        <img src="../img/Bladerunners%20Baseball%20logo%20round.png" width="100%" />
      </div>
      <div className="player-image-outer">
        <div className="player-image-inner">
          <img src={player.imgUrl} width="100%" />
        </div>
      </div>
      <div className="left-bottom">
        <div className="percent33">
          {team.name}
        </div>
        <div className="percent33">&nbsp;</div>
        <div className="percent33">
          {position.name}
        </div>
        <br style={{ clear: "both" }} />
      </div>
    </div>
  );
}

function Flag({ code, style }) {
  return <img
    src={`http://files.stevenskelton.ca/flag-icon/flag-icon/svg/country-4x3/${code}.svg`}
    style={style}
  />;
}

function StatsTable({ title, columns }) {
  const odds = (arr) => arr.filter((_, i) => i % 2 === 1);
  const evens = (arr) => arr.filter((_, i) => i % 2 === 0);
  return (
    <table className="stats">
      <tbody>
        <tr>
          <td colSpan={99}>{title}</td>
        </tr>
        <tr>{evens(columns).map((col, i) => <td key={"stat-type-" + i}>{col}</td>)}</tr>
        <tr>{odds(columns).map((col, i) => <td key={"stat-value-" + i}>{col}</td>)}</tr>
      </tbody>
    </table>
  );
}

function PlayerCardRight({ player, stats }) {
  const flagCode = (player.flag || "").toLowerCase();
  return (
    <div className="player-card-right">
      <style>
        {`
        .player-card-right {
          font-size: 100%;
        }
        .player-number {
          font-size: 100%;
        }
        .bio {
          font-family: Tahoma;
          font-size: 60%;
        }
        table.stats {
          border-collapse: collapse;
          width: 100%;
          text-align: center;
          font-size: 50%;
        }
        table.stats td {
          border: solid gray 1px;
        }
      `}
      </style>
      <table></table>
      <div className="player-number">
        {player.number} <Flag code={flagCode} style={{ width: "2vw" }} />
      </div>
      <div className="bio">
        Markus Lynn "Mookie" Betts (born October 7, 1992) is an American professional baseball outfielder for the Boston Red Sox of Major League Baseball (MLB).[2] In 2018 he became the first player in Major League history to win the Most Valuable Player, Silver Slugger, Gold Glove, batting title, and World Series in the same season.[3]
      </div>
      <div className="stats">
        <StatsTable title={`${stats.year} PERFORMANCE STATISTICS`} columns={stats.columns} />
      </div>
    </div>
  );
}

function init(container) {

  function addCard(props, width = "33%") {
    var div = document.createElement("div");
    div.style.width = width;
    ReactDOM.render(React.createElement(PlayerCard, props), div);
    container.appendChild(div);
  }

  var props1 = {
    player: {
      name: "Rich Green",
      imgUrl: "../img/profile-pic.334x334.png",
      number: "00",
      height: "",
      weight: "",
      dateOfBirth: "",
      placeOfBirth: "",
      flag: "GB",
      bio: "",
    },
    stats: {
      year: "2018",
      columns: [
        "AB", 16,
        "R", 9,
        "H", 6,
        "2B", 3,
        "3B", 0,
        "HR", 0,
        "RBI", 7,
        "BB", 9,
        "SB", 3,
        "SO", 3,
        "AVG", 0.375,
        "OBP", 0.630,
      ],
    },
    position: {
      name: "1B",
      logo: "",
    },
    team: {
      name: "Bladerunners",
      logo: "",
    }
  };

  addCard(props1);

  var props2 = JSON.parse(JSON.stringify(props1));
  props2.player.name = "Miguel Juarez";
  props2.player.number = "3";
  props2.player.flag = "MX";
  props2.position.name = "Catcher";
  props2.position.logo = "";
  addCard(props2, "50%");

  var props3 = JSON.parse(JSON.stringify(props1));
  props3.player.name = "Paul Grime";
  props3.player.number = "11";
  props3.position.name = "Center Field";
  props3.position.logo = "";
  addCard(props3, "75%");
}

export default init;
