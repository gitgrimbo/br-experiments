import { gapiLoad } from "./gapi";

function pick({
  clientId,
  apiKey,
  scope,
  onPickerLoaded,
  onBeforeSetVisible,
}) {
  scope = scope || [
    "https://www.googleapis.com/auth/photos",
    "https://www.googleapis.com/auth/drive.file",
  ].join(" ");

  return new Promise(async (resolve, reject) => {
    let pickerApiLoaded = false;
    let oauthToken;

    function pickerCallback(response) {
      console.log("pickerCallback", response);
      if (response.action === "loaded") {
        onPickerLoaded && onPickerLoaded(response);
      } else {
        resolve(response);
      }
    }

    // Create and render a Picker object for picking:
    // - user Photos.
    // - user Spreadsheets.
    function createPicker() {
      console.log("createPicker", pickerApiLoaded, oauthToken);
      if (pickerApiLoaded && oauthToken) {
        // get viewport size
        const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        let builder = new google.picker.PickerBuilder()
          .setOAuthToken(oauthToken)
          .setDeveloperKey(apiKey)
          .setCallback(pickerCallback)
          .setSize(vw * 0.9, vh * 0.9);
        if (onBeforeSetVisible) {
          builder = onBeforeSetVisible && onBeforeSetVisible(builder);
        } else {
          builder = builder
            .addView(google.picker.ViewId.PHOTOS)
            .addView(google.picker.ViewId.SPREADSHEETS)
            .addView(google.picker.ViewId.DOCS_IMAGES);
        }
        const picker = builder.build();
        picker.setVisible(true);
      }
    }

    async function loadAuth2API() {
      function getAuthInstance() {
        if (typeof gapi !== "undefined" && typeof gapi.auth2 !== "undefined") {
          return gapi.auth2.getAuthInstance();
        }
        return null;
      }

      const authInstance = getAuthInstance();
      const isSignedIn = authInstance && authInstance.isSignedIn.get();
      if (isSignedIn) {
        if (!oauthToken) {
          oauthToken = authInstance.currentUser.get().getAuthResponse().access_token;
        }
        return;
      }

      await gapiLoad("auth2");
      const googleAuth = await gapi.auth2.init({ client_id: clientId });
      console.log("loadAuth2API", googleAuth);
      const result = await googleAuth.signIn({ scope: scope });
      console.log("loadAuth2API", result);
      const authResponse = result.getAuthResponse();
      if (authResponse && !authResponse.error) {
        oauthToken = authResponse.access_token;
      }
    }

    async function loadPickerAPI() {
      await gapiLoad("picker");
      pickerApiLoaded = true;
    }

    if (typeof gapi !== "object" || gapi === null) {
      reject(new Error("gapi not loaded"));
      return;
    }

    try {
      const auth2Promise = loadAuth2API();
      const pickerPromise = loadPickerAPI();
      await Promise.all([auth2Promise, pickerPromise]);
      console.log("apis loaded");
      console.log("creating picker");
      createPicker();
    } catch (err) {
      console.error("Error selecting Google document");
      console.error(err);
      reject(err);
    }
  });
}


function extractPicasaUrl(doc) {
  // https://stackoverflow.com/a/47315488/319878
  if (!doc.thumbnails) {
    return null;
  }
  const [th] = doc.thumbnails;
  if (!th) {
    return null;
  }
  const parts = th.url.split("/");
  parts[parts.length - 2] = "s0";
  return parts.join("/");
}


function extractDocsPhotoUrl(doc) {
  // https://stackoverflow.com/a/11855448/319878
  return "https://drive.google.com/uc?export=view&id=" + doc.id;
}


function extractPublicImageUrl(doc) {
  if (doc.serviceId === "picasa") {
    return extractPicasaUrl(doc);
  }
  if (doc.serviceId === "docs" && doc.type === "photo") {
    if (!doc.isShared) {
      const name = doc.name ? `"${doc.name}"` : "Document";
      throw new Error(`${name} is not shared (publicly accessible)`);
    }
    return extractDocsPhotoUrl(doc);
  }
  return null;
}


export {
  pick,
  extractPublicImageUrl,
  extractPicasaUrl,
};


/*
----------------------------------------------
Shape of a [serviceId=docs, type=photo] object
----------------------------------------------

{
 "action": "picked",
 "viewToken": [
  "docs-images",
  null,
  {}
 ],
 "docs": [
  {
   "id": "1umLzQeGagYvLK-nhomAwijEzgyNgdCPL",
   "serviceId": "docs",
   "mimeType": "image/png",
   "name": "test.png",
   "description": "",
   "type": "photo",
   "lastEditedUtc": 1556956861493,
   "iconUrl": "https://drive-thirdparty.googleusercontent.com/16/type/image/png",
   "url": "https://drive.google.com/file/d/1umLzQeGagYvLK-nhomAwijEzgyNgdCPL/view?usp=drive_web",
   "embedUrl": "https://drive.google.com/file/d/1umLzQeGagYvLK-nhomAwijEzgyNgdCPL/preview?usp=drive_web",
   "sizeBytes": 70909,
   "rotation": 0,
   "rotationDegree": 0,
   "parentId": "1e83aLBh7XZ-h8c_4uPqU6UOQiumXpW8c",
   "isShared": true
  }
 ]
}

------------------------------------------------
Shape of a [serviceId=picasa, type=photo] object
------------------------------------------------

{
 "action": "picked",
 "viewToken": [
  "photos",
  null,
  {}
 ],
 "docs": [
  {
   "id": "6675206985076925266",
   "serviceId": "picasa",
   "mimeType": "application/vnd.google-apps.photo",
   "name": "logo.long-eaton-storm.png",
   "description": "",
   "type": "photo",
   "lastEditedUtc": 1553700206000,
   "iconUrl": "https://ssl.gstatic.com/docs/doclist/images/icon_10_generic_list.png",
   "url": "https://picasaweb.google.com/105769274988648118810/6675206790673295009#6675206985076925266",
   "thumbnails": [
    {
     "url": "https://lh3.googleusercontent.com/-tKPpJTkcvGM/XKMZYtu3Y1I/AAAAAAAAHzk/MSqeQ1AUcoIT8DYw21NVrkur4wygtIO1gCE0YBhgL/s32-c/logo.long-eaton-storm.png",
     "width": 32,
     "height": 32
    },
    {
     "url": "https://lh3.googleusercontent.com/-tKPpJTkcvGM/XKMZYtu3Y1I/AAAAAAAAHzk/MSqeQ1AUcoIT8DYw21NVrkur4wygtIO1gCE0YBhgL/s64-c/logo.long-eaton-storm.png",
     "width": 64,
     "height": 64
    },
    {
     "url": "https://lh3.googleusercontent.com/-tKPpJTkcvGM/XKMZYtu3Y1I/AAAAAAAAHzk/MSqeQ1AUcoIT8DYw21NVrkur4wygtIO1gCE0YBhgL/s72-c/logo.long-eaton-storm.png",
     "width": 72,
     "height": 72
    },
    {
     "url": "https://lh3.googleusercontent.com/-tKPpJTkcvGM/XKMZYtu3Y1I/AAAAAAAAHzk/MSqeQ1AUcoIT8DYw21NVrkur4wygtIO1gCE0YBhgL/s400/logo.long-eaton-storm.png",
     "width": 400,
     "height": 400
    }
   ],
   "sizeBytes": 29897,
   "rotation": 0,
   "parentId": "6675206790673295009",
   "version": 7993,
   "mediaKey": "AF1QipPilGTt42Iv6lSU2DEIDhr4dv0NItw_ymrFuBMZ"
  }
 ],
 "parents": [
  {
   "id": "6675206790673295009",
   "serviceId": "picasa",
   "mimeType": "application/vnd.google-apps.photoalbum",
   "name": "Bladerunners - Logos",
   "description": "",
   "type": "album",
   "lastEditedUtc": 1554192693000,
   "iconUrl": "https://ssl.gstatic.com/docs/doclist/images/icon_10_generic_list.png",
   "url": "https://picasaweb.google.com/105769274988648118810/6675206790673295009",
   "thumbnails": [
    {
     "url": "https://lh3.googleusercontent.com/-S8Aa0vljo8w/XKMZNZhbZqE/AAAAAAAAIXk/n2zbDXzVgxQf6PSb2l9ZPDzG0hZcSXX1ACE0YCg/s32-c/6675206790673295009",
     "width": 32,
     "height": 32
    },
    {
     "url": "https://lh3.googleusercontent.com/-S8Aa0vljo8w/XKMZNZhbZqE/AAAAAAAAIXk/n2zbDXzVgxQf6PSb2l9ZPDzG0hZcSXX1ACE0YCg/s64-c/6675206790673295009",
     "width": 64,
     "height": 64
    },
    {
     "url": "https://lh3.googleusercontent.com/-S8Aa0vljo8w/XKMZNZhbZqE/AAAAAAAAIXk/n2zbDXzVgxQf6PSb2l9ZPDzG0hZcSXX1ACE0YCg/s72-c/6675206790673295009",
     "width": 72,
     "height": 72
    },
    {
     "url": "https://lh3.googleusercontent.com/-S8Aa0vljo8w/XKMZNZhbZqE/AAAAAAAAIXk/n2zbDXzVgxQf6PSb2l9ZPDzG0hZcSXX1ACE0YCg/s400/6675206790673295009"
    }
   ],
   "audience": "limited",
   "numChildren": 39,
   "mediaKey": "AF1QipPG_NtlutYXGiDltZt1MF1xCanPHeD5DMr7myKs"
  }
 ]
}
*/
