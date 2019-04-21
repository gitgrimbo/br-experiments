import React from "react";

function getAuthInstance() {
  if (typeof gapi !== "undefined" && typeof gapi.auth2 !== "undefined") {
    return gapi.auth2.getAuthInstance();
  }
  return null;
}

export function GoogleSignInButton({
  onError,
}) {
  const [signedIn, setSignedIn] = React.useState(false);
  React.useEffect(() => {
    const authInstance = getAuthInstance();
    const isSignedIn = authInstance && authInstance.isSignedIn.get();
    authInstance && authInstance.isSignedIn.listen((e) => {
      const isSignedIn = authInstance && authInstance.isSignedIn.get();
      console.log("GoogleSignInButton.authInstance.isSignedIn.listen", isSignedIn);
      setSignedIn(isSignedIn);
    });
    console.log("GoogleSignInButton.isSignedIn", isSignedIn);
    setSignedIn(isSignedIn);
  });
  const onClick = async (e) => {
    const authInstance = getAuthInstance();
    if (authInstance) {
      try {
        await Promise.resolve(authInstance.signIn());
      } catch (err) {
        onError && onError(err);
      }
    }
  };
  const label = signedIn ? "Sign Out" : "Sign In";
  return (
    <button onClick={onClick}>{label}</button>
  );
}
