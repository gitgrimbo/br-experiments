export function setStateOnChange(state, setState, name) {
  return (e) => {
    e.preventDefault();
    setState({
      ...state,
      [name]: e.target.value,
    });
  };
}
