import React from "react";
import ReactDOM from "react-dom";

const F = React.Fragment;

const brBlue = "#013298";

function PlayerCard(props) {
  return (
    <svg className="player-card" x="0" y="0" width="100%" height="100%" viewBox="0 0 640 500" preserveAspectRatio="xMinYMin slice">
      <rect x="0" y="0" width="100%" height="100%" fill="lightgrey"></rect>
      <Left {...props}></Left>
      <Right {...props}></Right>
    </svg>
  );
}

function Left(props) {
  const w = 320;
  return (
    <svg x="0" y="0" width="50%" height="100%" viewBox={`0 0 ${w} 500`} preserveAspectRatio="none">
      <rect x="0" y="0" width="100%" height="100%" fill="white"></rect>
      <LeftTop x={0} y={0} width={w} height={88} {...props} />
      <LeftMiddle x={0} y={90} width={w} height={w} {...props} />
      <LeftBottom x={0} y={412} width={w} height={88} {...props} />
    </svg>
  );
}

function LeftTop(props) {
  return <PlayerName  {...props} />;
}

function PlayerName({ x, y, width, height, ...rest }) {
  return (
    <RoundedRect x={x} y={y} rx={30} ry={30} width={width} height={height} stroke="black" strokeWidth={5} fill={brBlue}>
      <text className="player-name" x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill="white">{rest.player.name}</text>
    </RoundedRect>
  );
}

function LeftMiddle({ x, y, width, height, ...rest }) {
  return (
    <RoundedRect x={x} y={y} rx={30} ry={30} width={width} height={height} stroke="black" strokeWidth={5} fill={brBlue}>
      <image width="100%" height="100%" xlinkHref="../img/profile-pic.334x334.png"></image>
    </RoundedRect>
  );
}

function LeftBottom({ x, y, width, height, ...rest }) {
  return (
    <RoundedRect x={x} y={y} rx={30} ry={30} width={width} height={height} stroke="black" strokeWidth={5} fill={brBlue}>
      <text className="position-name" x="33.3%" y="50%" textAnchor="middle" dominantBaseline="middle" fill="white">{rest.position.longName}</text>
      <PositionIcon x="66.6%" y="0" width="33.3%" height="100%" />
    </RoundedRect>
  );
}

function PositionIcon({ x, y, width, height, ...rest }) {
  const circleId = rndId();
  const clipPathId = rndId();
  return (
    <svg x={x} y={y} width={width} height={height} preserveAspectRatio="none" viewBox="0 0 100 100" {...rest}>
      <circle id={circleId} cx="50%" cy="50%" r="50" fill="white"></circle>
      <clipPath id={clipPathId}>
        <use xlinkHref={`#${circleId}`}></use>
      </clipPath>
      <image clipPath={`url(#${clipPathId})`} x={5} y={5} width="90" height="90" xlinkHref="./diamond.svg" preserveAspectRatio="none"></image>
      <circle cx="50%" cy="50%" r="48" fill="none" stroke="white" strokeWidth={5}></circle>
    </svg>
  );
}

function Right({ stats }) {
  return (
    <svg x="50%" y="0" width="50%" height="100%" viewBox="0 0 320 500" preserveAspectRatio="none">
      <rect x="0" y="0" width="100%" height="100%" fill="lightgreen"></rect>
      <Stats x="0" y="400" width="100%" height="100" stats={stats} />
    </svg>
  );
}

function Stats({ x, y, width, height, stats }) {
  return (
    <foreignObject x={x} y={y} width={width} height={height}>
      <table xmlns="http://www.w3.org/1999/xhtml" className="stats" style={{ height: height - 6 }}>
        <tbody>
          <tr style={{ background: brBlue, color: "white" }}><td colSpan="99">{stats.year} PERFORMANCE STATISTICS</td></tr>
          <tr>{stats.columns.filter((col, i) => i % 2 === 0).map((col, i) => <td key={i}>{col}</td>)}</tr>
          <tr>{stats.columns.filter((col, i) => i % 2 === 1).map((col, i) => <td key={i}>{col}</td>)}</tr>
        </tbody>
      </table>
    </foreignObject>
  );
}

function RoundedRect({ x, y, width, height, rx, ry, stroke, strokeWidth, children, ...rest }) {
  const clipPathId = rndId();
  const rectId = rndId();
  return (
    <svg x={x} y={y} width={width} height={height} preserveAspectRatio="none" {...rest}>
      <rect
        id={rectId}
        x={strokeWidth / 2}
        y={strokeWidth / 2}
        width={width - strokeWidth}
        height={height - strokeWidth}
        rx={rx}
        ry={ry}
        stroke={stroke}
        strokeWidth={strokeWidth}
        {...rest}
      >
      </rect>
      <clipPath id={clipPathId}>
        <rect
          x={strokeWidth}
          y={strokeWidth}
          width={width - strokeWidth * 2}
          height={height - strokeWidth * 2}
          rx={rx}
          ry={ry}
        >
        </rect>
      </clipPath>
      {
        // clip children to the inside of the rect's border
      }
      <g clipPath={`url(#${clipPathId})`}>
        {
          typeof children === "function"
            ? children({
              rectId,
              clipPathId,
            })
            : children
        }
      </g>
    </svg>
  );
}

function rndId(len = 8) {
  const rndStr = () => String(Math.random()).split(".")[1];
  let rnd = rndStr();
  while (rnd.length < len) {
    rnd += rndStr();
  }
  return "id" + rnd.substring(0, len);
}

function init(container) {

  function addCard(props, width = "33%") {
    var div = document.createElement("div");
    div.style.width = width;
    ReactDOM.render(React.createElement(PlayerCard, props), div);
    container.appendChild(div);
    var br = document.createElement("br");
    br.style.clear = "both";
    container.appendChild(br);
    var div = document.createElement("div");
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
        "R", 19,
        "H", 16,
        "2B", 13,
        "3B", 10,
        "HR", 10,
        "RBI", 17,
        "BB", 19,
        "SB", 13,
        "SO", 13,
        "AVG", 0.375,
        "OBP", 0.630,
      ],
    },
    position: {
      name: "1B",
      longName: "1st Base",
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
  props2.position.name = "C";
  props2.position.longName = "Catcher";
  props2.position.logo = "";
  addCard(props2, "50%");

  var props3 = JSON.parse(JSON.stringify(props1));
  props3.player.name = "Paul Grime";
  props3.player.number = "11";
  props3.position.name = "CF";
  props3.position.longName = "Center Field";
  props3.position.logo = "";
  addCard(props3, "75%");
}

export default init;
