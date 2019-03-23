export default function minMax(...args) {
  let min = args[0];
  let max = args[0];
  args.forEach((arg) => {
    if (arg < min) {
      min = arg;
    } else if (arg > max) {
      max = arg;
    }
  });
  return [min, max];
}
