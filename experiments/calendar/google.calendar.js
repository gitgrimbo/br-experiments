const Calendar = (function() {

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
          await gapi.client.init({
            apiKey,
            clientId,
            discoveryDocs,
            scope,
          });
          console.log("calling gapi.client.init ok");
          // Listen for sign-in state changes.
          gapi.auth2.getAuthInstance().isSignedIn.listen(onSignInChanged);
          resolve();
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  /**
   * Print the summary and start datetime/date of the next ten events in
   * the authorized user's calendar. If no events are found an
   * appropriate message is printed.
   */
  function listEvents(calendarId, timeMin, timeMax) {
    return googToPromise(
      gapi.client.calendar.events.list({
        calendarId,
        timeMin: timeMin || undefined,
        timeMax: timeMax || undefined,
        showDeleted: false,
        singleEvents: true,
        maxResults: 100,
        orderBy: "startTime",
      })
    );
  }

  function insertEvent(calendarId, resource) {
    const now = new Date().toISOString();
    resource = resource || {
      summary: now,
      start: {
        dateTime: now,
      },
      end: {
        dateTime: now,
      },
      location: "test",
    };
    console.log(calendarId, resource);
    return googToPromise(
      gapi.client.calendar.events.insert({
        calendarId,
        resource,
      })
    );
  }

  function deleteEvent(calendarId, eventId) {
    return googToPromise(
      gapi.client.calendar.events.delete({
        calendarId,
        eventId,
      })
    );
  }

  return {
    initGoogleClient,
    listEvents,
    insertEvent,
    deleteEvent,
  };

}());
