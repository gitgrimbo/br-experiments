function Logo({ height }) {
  return <img
    className="bladerunners-logo"
    src="logo2.jpg"
    style={{ height }}
  />;
}

const Banner = React.forwardRef((props, ref) => {
  const {
    useLogoForBaseball = false,
    fontSize = "28pt",
  } = props;
  return (
    <div ref={ref} className="desktop-banner" style={{ fontSize }}>
      SHEFFIELD
        {" "}
      <span style={{ whiteSpace: "nowrap" }}><Logo height={fontSize} />LADERUNNERS</span>
      {" "}
      {
        useLogoForBaseball
          ? <span style={{ whiteSpace: "nowrap" }}><Logo height={fontSize} />ASEBALL CLUB</span>
          : "BASEBALL CLUB"
      }
    </div>
  );
});

function BannerApp({ cssElement }) {
  const [useLogoForBaseball, setUseLogo] = React.useState(false);
  const [fontSize, setFontSize] = React.useState(28);
  const fontSizeRange = [5, 50];
  const sourceContainerHtml = React.createRef();
  const sourceContainerCss = React.createRef();
  const banner = React.createRef();
  React.useEffect(() => {
    sourceContainerHtml.current.innerHTML = "";
    appendOuterHTMLOf(banner.current, { appendTo: sourceContainerHtml.current, format: true })

    sourceContainerCss.current.innerHTML = "";
    appendOuterHTMLOf(cssElement, { appendTo: sourceContainerCss.current, format: true })
  });
  return (
    <div>
      <fieldset>
        <legend>Options</legend>
        <label>Use logo for 'Baseball' B?
        <input type="checkbox"
            checked={useLogoForBaseball}
            onChange={(e) => setUseLogo(e.target.checked)}
          />
        </label>
        <label>Text size ({fontSize}pt):
          {" "}
          {fontSizeRange[0]}
          <input type="range"
            value={fontSize}
            min={fontSizeRange[0]}
            max={fontSizeRange[1]}
            onChange={(e) => setFontSize(e.target.value)} />
        </label>
        {fontSizeRange[1]}
      </fieldset>

      <h2>Full Width</h2>
      <div style={{ width: "100%" }}><Banner ref={banner} useLogoForBaseball={useLogoForBaseball} fontSize={fontSize + "pt"}></Banner></div>
      <h2>50% Width</h2>
      <div style={{ width: "50%" }}><Banner ref={banner} useLogoForBaseball={useLogoForBaseball} fontSize={fontSize + "pt"}></Banner></div>
      <h2>Source</h2>
      <pre ref={sourceContainerHtml}></pre>
      <pre ref={sourceContainerCss}></pre>
    </div>
  );
}
