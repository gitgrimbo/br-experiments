const del = require("del");
const fs = require("fs");
const tempy = require("tempy");

const screenshot = require("./screenshot");

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS, GET, POST",
};

async function screenshotHandler(bodyStr) {
  const body = JSON.parse(bodyStr);
  const base64svg = body["image.data"];
  const svgSource = Buffer.from(base64svg, "base64");

  const tmp = tempy.file({ name: "image.svg" });
  console.log("tmp", tmp);

  try {
    await fs.promises.writeFile(tmp, svgSource);
    const imageBuffer = await screenshot(tmp);
    console.log("imageBuffer", imageBuffer);
    const response = {
      statusCode: 200,
      headers: {
        ...CORS_HEADERS,
        "Content-Type": "image/png",
      },
      body: Buffer.from(imageBuffer).toString("base64"),
      isBase64Encoded: true,
      // body: imageBuffer,
      // isBase64Encoded: false,
    };
    return response;
  } finally {
    // tmp is outside working directory, so use force
    await del(tmp, { force: true });
  }
};


exports.screenshot = async (event, context) => {
  let err;

  if (event.body) {
    try {
      return await screenshotHandler(event.body);
    } catch (error) {
      err = error;
      console.error(error);
    }
  }

  return {
    statusCode: 500,
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "text/plain",
    },
    body: `Unexpected error: ${err && err.message}`,
  };
};
