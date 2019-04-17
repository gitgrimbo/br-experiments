const convertImageEndpointLocal = "http://localhost:8010/bladerunners/us-central1/convertImage";
const convertImageEndpointProd = "https://us-central1-bladerunners.cloudfunctions.net/convertImage";
const screenshotEndpointLocal = "http://localhost:8010/bladerunners/us-central1/screenshot";
const screenshotEndpointProd = "https://us-central1-bladerunners.cloudfunctions.net/screenshot";

export default async function createPNG(svgSource) {
  const convertImageEndpoint = screenshotEndpointProd;

  try {
    const formData = new FormData();
    formData.append("image.name", "image.svg");
    formData.append("image.type", "svg");
    formData.append("image.data", svgSource);

    const resp = await fetch(convertImageEndpoint, {
      method: "POST",
      body: formData,
    });

    if (!resp.ok) {
      const text = await resp.text();
      const err = new Error();
      err.createPNG = {
        status: resp.status,
        text,
      };
      throw err;
    }

    const blob = await resp.blob();
    return URL.createObjectURL(blob);
  } catch (err) {
    err.createPNG = {
      ...err.createPNG,
      endpoint: convertImageEndpoint,
    };
    throw err;
  }
}
