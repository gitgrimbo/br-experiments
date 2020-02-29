import React from "react";
import ReactDOM from "react-dom";

const players = [
  {
    name: "Nestor Martinez",
    number: "88",
    position: "Shortstop",
    playerUrl: "nestor.png",
  },
  {
    name: "Jack Lockwood",
    number: "1",
    position: "Pitcher",
    playerUrl: "jack-l.png",
  },
  {
    name: "AK Kelly",
    number: "4",
    position: "3rd Base",
    playerUrl: "ak.png",
  },
];

function updateSvg(svg, player) {
  function setText(selector, value) {
    const n = svg.querySelector(selector);
    console.log(n, n.firstChild);
    console.log(`Changing "${n.firstChild.nodeValue}" to "${value}"`)
    n.firstChild.nodeValue = value;
  }

  function setAttr(selector, attrName, value) {
    const n = svg.querySelector(selector);
    console.log(n, n.nodeName);
    const attr = n.getAttribute(attrName);
    console.log(attrName, attr);
    console.log(`Changing "${attr}" to "${value}"`)
    // have to set the attr value on the attr itself
    n.setAttribute(attrName, player.playerUrl);
  }

  setText(`#player-name`, player.name);
  setText(`#player-number`, player.number);
  setText(`#player-position`, player.position);
  setAttr(`#player-image`, "href", player.playerUrl);
}

function App({
  svgPath,
}) {
  const svgContainerRef = React.useRef(null);
  const fetchSvg = async () => {
    const resp = await fetch(svgPath);
    let text = await resp.text();
    text = text.replace(/width="\d+"/, `width="100%"`);
    text = text.replace(/height="\d+"/, `height="100%"`);
    svgContainerRef.current.innerHTML = text;
  };
  React.useEffect(() => void fetchSvg(), []);

  const onClickPlayer = (e) => {
    const i = e.target.dataset["playerIdx"];
    console.log(svgContainerRef.current.firstElementChild);
    updateSvg(svgContainerRef.current.firstElementChild, players[i]);
  };

  return (
    <React.Fragment>
      <ul>{players.map((player, i) => <li key={i}><a href="#" data-player-idx={i} onClick={onClickPlayer}>{player.name}</a></li>)}</ul>
      <svg width="400" height="600" ref={svgContainerRef}></svg>
    </React.Fragment>
  );
}

function init(container) {
  ReactDOM.render(<App svgPath={"./sample2.svg"} />, container);
}

export default init;
