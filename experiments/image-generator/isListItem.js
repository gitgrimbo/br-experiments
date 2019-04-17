export default function isListItem(id) {
  const exec = /(.*)\.(\d+)$/.exec(id);
  if (!exec) {
    return null;
  }
  return {
    name: exec[1],
    idx: Number(exec[2]),
  };
}
