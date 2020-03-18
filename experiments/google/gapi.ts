import { waitFor } from "../common/wait";

function googToPromise<T>(goog): Promise<T> {
  return new Promise((resolve, reject) => goog.then(resolve, reject));
}

async function gapiLoad(libraries): Promise<void> {
  const gapiTimeout = 5 * 1000;
  await waitFor(gapiTimeout, 100, () => typeof gapi !== "undefined");
  return new Promise((resolve, reject) => {
    gapi.load(libraries, {
      callback: resolve,
      onerror: reject,
      timeout: 5 * 1000,
      ontimeout: reject,
    });
  });
}

async function gapiLoadClientAuth2(): Promise<void> {
  return gapiLoad("client:auth2");
}

async function initGoogleClient({
  apiKey,
  clientId,
  discoveryDocs,
  scope,
  onSignInChanged,
}): Promise<void> {
  console.log("initClient");
  try {
    console.log("calling gapi.load");
    await gapiLoadClientAuth2();
    const initOpts = {
      apiKey,
      clientId,
      discoveryDocs,
      scope,
    };
    console.log("calling gapi.client.init with opts", { ...initOpts });
    await gapi.client.init(initOpts);
    console.log("calling gapi.client.init ok");
    // Listen for sign-in state changes.
    if (typeof onSignInChanged === "function") {
      console.log("gapi", gapi);
      console.log("gapi.auth2", gapi.auth2);
      console.log("gapi.auth2.getAuthInstance()", gapi.auth2.getAuthInstance());
      gapi.auth2.getAuthInstance().isSignedIn.listen(onSignInChanged);
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export {
  gapiLoad,
  googToPromise,
  initGoogleClient,
};
