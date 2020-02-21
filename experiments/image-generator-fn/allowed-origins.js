function isOriginAllowed(origin) {
  const allowedOrigins = [
    "local.sheffieldbladerunners.co.uk",
    "gitgrimbo.github.io",
    "local.paulgri.me",
  ];
  // return true if the origin matches any scheme
  return Boolean(allowedOrigins.find((allowedOrigin) => {
    const it = origin.endsWith("://" + allowedOrigin);
    console.log(origin, allowedOrigin, it);
    return it;
  }));
}

module.exports = {
  isOriginAllowed,
};
