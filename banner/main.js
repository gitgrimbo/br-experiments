class Banner extends React.Component {
  mainRef = React.createRef()

  getRootElement() {
    return this.mainRef.current;
  }

  render() {
    const { useLogoForBaseball = false } = this.props;
    return (
      <div ref={this.mainRef} className="desktop-banner">
        SHEFFIELD
        {" "}
        <span style={{ whiteSpace: "nowrap" }}><img className="bladerunners_logo" src="logo2.jpg" style={{ margin: 0, verticalAlign: "sub" }} />LADERUNNERS</span>
        {" "}
        {
          useLogoForBaseball
            ? <span style={{ whiteSpace: "nowrap" }}><img className="bladerunners_logo" src="logo2.jpg" style={{ margin: 0, verticalAlign: "sub" }} />ASEBALL CLUB</span>
            : "BASEBALL CLUB"
        }
      </div>
    );
  }
}

function BannerApp() {
  const [useLogoForBaseball, setUseLogo] = React.useState(false);
  const onChange = (e) => setUseLogo(e.target.checked);
  const sourceContainer = React.createRef();
  const banner = React.createRef();
  React.useEffect(() => {
    sourceContainer.current.innerHTML = "";
    appendOuterHTMLOf(banner.current.getRootElement(), { appendTo: sourceContainer.current, format: true })
  });
  return (
    <div>
      <label>Use logo for 'Baseball' B?<input type="checkbox" checked={useLogoForBaseball} onChange={onChange} /></label>
      <h2>Full Width</h2>
      <div style={{ width: "100%" }}><Banner ref={banner} useLogoForBaseball={useLogoForBaseball}></Banner></div>
      <h2>50% Width</h2>
      <div style={{ width: "50%" }}><Banner ref={banner} useLogoForBaseball={useLogoForBaseball}></Banner></div>
      <h2>Source</h2>
      <pre ref={sourceContainer}></pre>
    </div>
  );
}
