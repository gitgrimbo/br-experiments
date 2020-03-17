import * as React from "react";

const SVG: React.FC<any> = (originalProps) => {
  const { children, ...props } = originalProps;
  const namespaces = {
    "xmlns": "http://www.w3.org/2000/svg",
    "xmlns:dc": "http://purl.org/dc/elements/1.1/",
    "xmlns:cc": "http://creativecommons.org/ns#",
    "xmlns:rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    "xmlns:svg": "http://www.w3.org/2000/svg",
    //"xmlns:xlink": "http://www.w3.org/1999/xlink",
    //React prefers the following for xlink
    "xmlnsXlink": "http://www.w3.org/1999/xlink",
    "xmlns:sodipodi": "http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd",
    "xmlns:inkscape": "http://www.inkscape.org/namespaces/inkscape",
  };
  return (
    <svg
      {...namespaces}
      {...props}
    >{children}</svg>
  );
}

export interface SVGPlayerBoxPlayer {
  name: string;
  position: string;
  number: string;
  faceImagePath: string;
}

interface SVGPlayerBoxProps {
  player: SVGPlayerBoxPlayer;
}

const SVGPlayerBox: React.FC<SVGPlayerBoxProps & React.SVGAttributes<SVGSVGElement>> = (originalProps) => {
  const { player, ...props } = originalProps;
  const { name, position, number } = player;
  const [first, ...other] = (name || "").split(/\s/);
  return (
    <SVG
      {...props}
      viewBox="0 0 100 100"
    >
      <style>{`
.box {
  fill: #013298;
  stroke: white;
  stroke-width: 1px;
}
.player-name, .player-position, .player-number {
  fill: white;
  font-size: 11.4px;
  font-weight: bold;
  text-anchor: middle;
}
.player-position {
  font-size: 12px;
}
.player-number {
  font-size: 12px;
}
.border {
  display: none;
  fill: none;
  stroke: black;
  stroke-width: 1px;
}
        `}</style>
      <g
      >
        <rect
          x="36" y="0"
          width="64" height="70"
          className="border"
        />
        <image
          xlinkHref={player.faceImagePath}
          x="36" y="0"
          width="64" height="70"
          preserveAspectRatio="xMidYMid meet"
        />
      </g>
      <g
        data-desc="group for player number and position"
        transform="translate(18, 25)"
      >
        <ellipse
          className="box"
          rx="16" ry="16"
        />
        {position && <text className="player-number" y="5">{"#" + number}</text>}
        <g
          transform="translate(3, 23)"
        >
          <ellipse
            className="box"
            rx="13" ry="13"
          />
          {position && <text className="player-position" y="4">{position}</text>}
        </g>
      </g>
      <g
        data-desc="group for player name"
        transform="translate(0, 72)"
      >
        <rect
          className="box"
          x="1" y="0"
          width="98" height="27"
          rx="5" ry="5"
        />
        <g
          transform="translate(50, 11)"
        >
          {first && <text className="player-name">{first}</text>}
          {other && <text className="player-name" y="12">{other.join(" ")}</text>}
        </g>
      </g>
      <rect
        x="0" y="0"
        width="100%" height="100%"
        className="border"
      />
    </SVG>
  );
}

export interface SVGDiamondPlayer {
  name: string;
  faceImagePath: string;
}

export interface SVGDiamondProps {
  players: SVGDiamondPlayer[];
}

function SVGDiamond(originalProps: SVGDiamondProps & React.HTMLAttributes<SVGElement>): React.ReactElement | null {
  const { players, ...props } = originalProps;

  // eslint-disable-next-line react/prop-types
  const { id } = props;

  const cssId = id ? "#" + id : "";

  const playersWithPosition = players && [
    ["C", "550, 740"],
    ["P", "800, 510"],
    ["1B", "1300, 330"],
    ["2B", "940, 250"],
    ["3B", "50, 370"],
    ["SS", "420, 280"],
    ["LF", "150, 90"],
    ["CF", "680, 40"],
    ["RF", "1200, 70"],
  ].map(([position, translation], positionIdx) => ({
    position,
    translation,
    player: players[positionIdx],
  }));

  const width = 1589;
  const height = 1003;
  return (
    <SVG
      {...props}
      viewBox={`0 0 ${width} ${height}`}
      version="1.1"
      data-type="diamond"
    >
      <defs>
        <style>{`
${cssId} text, ${cssId} tspan {
  font-family: Arial;
}
${cssId} .player-name {
  text-anchor: middle;
}
`}
        </style>
      </defs>
      <g>
        <image
          xlinkHref="diamond.jpg"
          width="100%"
          height="100%"
          preserveAspectRatio="none"
        />
        <image
          xlinkHref="../img/ty/Bladerunners-original-badge.svg"
          x="30" y="750"
          height="220"
        />
        <image
          xlinkHref="../img/ty/Bladerunners-original-logo.svg"
          x="1090" y="760"
          height="230"
        />
        {playersWithPosition && playersWithPosition.map(({ player, position, translation }, playerIdx) => {
          return (
            <g
              key={playerIdx}
              transform={`translate(${translation})`}
            >
              <SVGPlayerBox
                player={{
                  ...player,
                  position,
                  number: String(Math.trunc(Math.random() * 100)),
                }}
                width="250" height="250"
              />
            </g>
          );
        })}
      </g>
    </SVG>
  );
}

export default SVGDiamond;
