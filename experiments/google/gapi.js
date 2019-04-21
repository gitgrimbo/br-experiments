function googToPromise(goog) {
  return new Promise((resolve, reject) => goog.then(resolve, reject));
}

async function gapiLoadClientAuth2() {
  return new Promise((resolve, reject) => {
    gapi.load("client:auth2", {
      callback: resolve,
      onerror: reject,
      timeout: reject,
      ontimeout: reject,
    });
  });
}

async function initGoogleClient({
  apiKey,
  clientId,
  discoveryDocs,
  scope,
  onSignInChanged,
}) {
  console.log("initClient");
  return new Promise(async (resolve, reject) => {
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
      resolve();
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
}

export {
  googToPromise,
  initGoogleClient,
};
