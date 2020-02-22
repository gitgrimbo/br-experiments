import {
  arrayMoveValue,
  arraySetValue,
  setValue,
} from "./reducer-utils";

const reducer = (state, action) => {
  const set = setValue(state);
  switch (action.type) {
    case "applyReducer": {
      const { prop, reducer } = action;
      const oldValue = state[prop];
      const newValue = reducer(oldValue);
      return (oldValue === newValue)
        ? state
        : {
          ...state,
          [prop]: newValue,
        };
    }
    case "setGeneric": return set(action.valueName, action.value);
    case "setSVGSource": return set("svgSource", action.value);
    case "setCreatePNGError": return set("createPNGError", action.value);
    case "setPNGURL": return set("pngURL", action.value);
    case "setShouldScaleSVG": return set("shouldScaleSVG", action.value);
    case "setSVGSize": return set("svgSize", action.value);
    case "setData": {
      const state2 = set("data", action.value);
      return {
        ...state2,
        dataTimestamp: Date.now(),
      };
    }
    case "setSVGEmbeddedData": {
      const state2 = set("data", action.value);
      console.log(state2);
      return {
        ...state2,
        dataTimestamp: Date.now(),
      };
    };
    case "setEmbeddedSampleData": return set("embeddedSampleData", action.value);
    case "setDataValue": {
      console.log("setDataValue", action);
      const { dataIdx, name, value } = action.value;
      const old = state.data[dataIdx][name];
      console.log("setDataValue", old, value);
      return (old !== value)
        ? set("data", arraySetValue(state.data, dataIdx, name, value))
        : state;
    }
    case "moveData": {
      const { oldIndex, newIndex } = action.value;
      return set("data", arrayMoveValue(state.data, oldIndex, newIndex));
    }
    case "setImageLoaderFieldset": {
      console.log("setImageLoaderFieldset", action.value);
      return set("imageLoaderFieldset", action.value);
    };
    default:
      return state;
  }
};

export default reducer;
