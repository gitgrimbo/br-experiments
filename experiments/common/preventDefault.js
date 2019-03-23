export default function preventDefault(callback) {
  return (...args) => {
    const [e] = args;
    e.preventDefault();
    callback(...args);
  };
}
