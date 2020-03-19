import { waitFor } from "../common/wait";

function googToPromise<T>(goog): Promise<T> {
  return new Promise((resolve, reject) => goog.then(resolve, reject));
}

async function gapiLoad(libraries): Promise<void> {
  const gapiPresentTimeout = 5 * 1000;
  const gapiLoadLibrariesTimeout = 5 * 1000;
  const usualGAPIScriptUrl = "https://apis.google.com/js/api.js";

  try {
    await waitFor(gapiPresentTimeout, 100, () => typeof gapi !== "undefined");
  } catch (err) {
    let msg = `Timed out after ${gapiPresentTimeout}ms waiting for "gapi" global to be present.`;
    const script = document.querySelector(`script[src='${usualGAPIScriptUrl}']`);
    if (!script) {
      msg += `\nUsual gapi script not found (<script src="${usualGAPIScriptUrl}">). Is the script present in the page?`;
    }
    throw new Error(msg);
  }

  return new Promise((resolve, reject) => {
    gapi.load(libraries, {
      callback: resolve,
      onerror: reject,
      timeout: gapiLoadLibrariesTimeout,
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
}: {
  apiKey?: string;
  clientId?: string;
  discoveryDocs?: string[];
  scope?: string;
  onSignInChanged?: string;
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
