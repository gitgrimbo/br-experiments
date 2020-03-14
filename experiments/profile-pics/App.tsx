import * as React from "react";
import SVGInject from "@iconfu/svg-inject";

import createSVG from "./create-svg";
import { loadProfiles, Profile } from "./load-profiles";

function scaleSVG(svg, newWidth) {
  const bbox = svg.getBoundingClientRect();
  //console.log(bbox);
  const ratio = bbox.width / bbox.height;
  //console.log(ratio);
  const newHeight = newWidth / ratio;
  //console.log(w, h);
  svg.setAttribute("width", newWidth + "px");
  svg.setAttribute("height", newHeight + "px");
  //console.log(svg.width, svg.height);
}

function fixSVG(svg, width = 240): void {
  // not sure why we have to replace the svg with 'itself' to make the clip-paths work
  // (when using SVGInject), but we do :-/
  const div = document.createElement("div");
  div.innerHTML += svg.outerHTML;
  const svg2 = div.querySelector("svg");

  svg.replaceWith(svg2);
  scaleSVG(svg2, width);
}

function setStateProp(currentState, name, value): any {
  return {
    ...currentState,
    [name]: value,
  };
}

function svgProfileIdForIdx(idx): string {
  return `profile_svg_${idx}`;
}

function svgProfileIdxForId(id): number {
  const parts = id.split("_");
  return parseInt(parts[parts.length - 1]);
}

interface AppProps { }

interface SVGStateItem {
  profile: Profile;
  id: string;
  ref: HTMLElement;
  loaded: boolean;
  fixed: boolean;
  imageBaseName: string;
}

const App: React.FC<AppProps> = (props: AppProps) => {
  function profilesToState(profiles: Profile[]): SVGStateItem[] {
    const imgBaseName = (profilePicName) => profilePicName.replace(/\.[^.]+/, "")
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

  const [svgState, setSVGState] = React.useState();

  // Separate state to keep track of last loaded SVG.
  // State is separate to avoid overwriting svgState with stale values from the load callback.
  const [svgLoadedId, setSVGLoadedId] = React.useState();

  // Set the global SVG load handler as the first effect.
  React.useEffect(() => {
    window.onProfileSVGLoad = (svgElement) => {
      console.log("svg loaded", svgElement.id);
      setSVGLoadedId(svgElement.id);
    };
    console.log(window.onProfileSVGLoad);
  }, []);

  React.useEffect(() => {
    loadProfiles()
      .then((profiles) => setSVGState(profilesToState(profiles)));
  }, []);

  React.useEffect(() => {
    if (!svgState) {
      return;
    }

    let changed = false;
    console.log("effect", svgState);

    let svgLoadedIdx = null;
    if (svgLoadedId) {
      svgLoadedIdx = svgProfileIdxForId(svgLoadedId);
    }

    const newState = svgState.map((state, profileIdx) => {
      console.log("state", profileIdx, state);
      const { id, ref, loaded, fixed } = state;

      let state2 = state;

      const isNewlyLoadedProfile = !loaded && (svgLoadedIdx !== null && svgLoadedIdx === profileIdx);
      if (isNewlyLoadedProfile) {
        state2 = setStateProp(state2, "loaded", true);
        changed = true;
      }

      if (!ref) {
        const newRef = document.getElementById(id);
        state2 = setStateProp(state2, "ref", newRef);
        // Why aren't the SVG load listeners working?
        state2 = setStateProp(state2, "loaded", true);
        changed = true;
      }

      if (ref && loaded && !fixed) {
        fixSVG(ref);
        state2 = setStateProp(state2, "fixed", true);
        changed = true;
      }

      return state2;
    });

    if (changed) {
      console.log("changed");
      setSVGState(newState);
    }
  }, [svgState, svgLoadedId]);

  const display = (el, display) => el.style.display = display ? "block" : "none";

  const onChangeCheckbox = (e) => {
    const { checked } = e.target;
    document.querySelectorAll(".profile, .face").forEach((el: SVGElement) => {
      switch (el.className.baseVal) {
        case "profile": {
          display(el, !checked);
          break;
        }
        case "face": {
          display(el, checked);
          break;
        }
      }
    });
  };

  const onLoadImage = async (e) => {
    const { target } = e;
    await SVGInject(target, {
      afterLoad(svg, svgString) {
        console.log("afterLoad", svg);
        //console.log(svgString);
      },

      async afterInject(img, svg) {
        console.log("afterInject", img, svg);
        fixSVG(svg);
      },

      onFail(img, status) {
        console.log("onFail", img, status);
      },
    });
  };

  return (
    <>
      <div className="tools">
        <label>Show only faces: <input type="checkbox" onChange={onChangeCheckbox} /></label>
      </div>
      <div key={svgLoadedId}>
        {
          svgState && svgState.map((item, profileIdx) => {
            const { profile, imageBaseName } = item;
            const { playerName, width, height } = profile;
            return (
              <div key={playerName} style={{ display: "inline-block" }}>
                <ignore-img src={imageBaseName + ".svg"} onLoad={onLoadImage} />
                <div dangerouslySetInnerHTML={{
                  __html: createSVG({
                    id: svgProfileIdForIdx(profileIdx),
                    svgName: imageBaseName,
                    width: parseInt(width, 10),
                    height: parseInt(height, 10),
                    //bitmapPath:,
                  })
                }}></div>
                <div style={{ textAlign: "center" }}>{playerName} / {imageBaseName}</div>
              </div>
            );
          })
        }
      </div>
    </>
  );
};

export default App;
