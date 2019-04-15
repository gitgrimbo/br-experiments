import {
  googToPromise,
  initGoogleClient,
} from "./gapi";

function initGoogleCalendar({
  apiKey,
  clientId,
  discoveryDocs = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
  scope = "https://www.googleapis.com/auth/calendar.events",
  onSignInChanged,
}) {
  return initGoogleClient({
    apiKey,
    clientId,
    discoveryDocs,
    scope,
    onSignInChanged,
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

export default {
  initGoogleCalendar,
  listEvents,
  insertEvent,
  deleteEvent,
};
