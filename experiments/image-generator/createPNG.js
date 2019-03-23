import { encode as Base64Encode } from "./base64";

const convertImageEndpointLocal = "http://localhost:9902/";
const convertImageEndpointProd = "https://us-central1-bladerunners.cloudfunctions.net/convertImage/";
//const screenshotEndpointLocal = "http://localhost:9901/";
const screenshotEndpointLocal = "http://localhost:3000/prod/screenshot/";
//const screenshotEndpointProd = "https://us-central1-bladerunners.cloudfunctions.net/screenshot/";
const screenshotEndpointProd = "https://k16z8cm9r9.execute-api.eu-west-2.amazonaws.com/prod/screenshot/";

export default async function createPNG(svgSource) {
  const convertImageEndpoint = screenshotEndpointProd;

  try {
    const s = Base64Encode(svgSource);
    const data = {
      "image.name": "image.svg",
      "image.type": "svg",
      "image.data": s,
    };

    const resp = await fetch(convertImageEndpoint, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
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

    const base64image = await resp.text();
    return "data:image/png;base64," + base64image;
  } catch (err) {
    console.error(err);
    err.createPNG = {
      ...err.createPNG,
      endpoint: convertImageEndpoint,
    };
    throw err;
  }
}
