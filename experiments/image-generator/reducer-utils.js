import minMax from "../common/minMax";
import isListItem from "./isListItem";

export function arrayMoveValue(data, oldIndex, newIndex) {
  const replaceId = (item, newId) => {
    const { id, ...rest } = item;
    return {
      id: newId,
      ...rest,
    };
  };

  const oldItem = isListItem(data[oldIndex].id);
  const newItem = isListItem(data[newIndex].id);
  const groupName = oldItem.name;
  if (oldItem.name !== newItem.name) {
    throw new Error("Cannot drag items between different groups");
  }

  const [min, max] = minMax(oldIndex, newIndex);

  const reorder = (from, to, startIndex) => {
    return data.slice(from, to).map((old, i) => {
      const newIdx = startIndex + i;
      return replaceId(old, groupName + "." + newIdx);
    });
  };

  let middle = [];

  if (newIndex > oldIndex) {
    // dragged 'towards the end' of the list
    middle = [
      ...reorder(min + 1, max + 1, oldItem.idx),
      replaceId(data[min], groupName + "." + newItem.idx),
    ];
  } else {
    // dragged 'towards the front' of the list
    middle = [
      replaceId(data[max], groupName + "." + newItem.idx),
      ...reorder(min, max, newItem.idx + 1),
    ];
  }

  return [
    ...data.slice(0, min),
    ...middle,
    ...data.slice(max + 1),
  ];
}

export function arraySetValue(data, dataIdx, name, value) {
  const data2 = data.slice();
  data2[dataIdx] = {
    ...data2[dataIdx],
    [name]: value,
  };
  return data2;
}

export const setValue = (state) => (name, value) => {
  return {
    ...state,
    [name]: value,
  };
};
