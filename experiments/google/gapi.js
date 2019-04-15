function googToPromise(goog) {
  return new Promise((resolve, reject) => goog.then(resolve, reject));
}

async function initGoogleClient({
  apiKey,
  clientId,
  discoveryDocs,
  scope,
  onSignInChanged,
}) {
  console.log("initClient");
  return new Promise((resolve, reject) => {
    console.log("calling gapi.load");
    gapi.load("client:auth2", async () => {
      console.log("calling gapi.load ok");
      console.log("calling gapi.client.init");
      try {
        console.log("calling gapi.client.init");
        const initOpts = {
          apiKey,
          clientId,
          discoveryDocs,
          scope,
        };
        console.log("using init opts");
        console.log({ ...initOpts });
        await gapi.client.init(initOpts);
        console.log("calling gapi.client.init ok");
        // Listen for sign-in state changes.
        if (typeof onSignInChanged === "function") {
          console.log(gapi);
          console.log(gapi.auth2);
          console.log(gapi.auth2.getAuthInstance());
          gapi.auth2.getAuthInstance().isSignedIn.listen(onSignInChanged);
        }
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  });
}

export {
  googToPromise,
  initGoogleClient,
};
