import React from "react";

import schedule from "../schedule/schedule";
import Calendar from "../google/calendar";

function scheduleEventToCalendarResource(event) {
  const pad0 = (s, n) => {
    s = String(s);
    while (s.length < n) {
      s = "0" + s;
    }
    return s;
  };

  let summary = "";
  if (event.bye) {
    summary = (event.week && event.teamName)
      ? `Week ${event.week} - Bladerunners ${event.teamName}: BYE WEEK`
      : event.bye;
  } else {
    summary = `Week ${event.week} - Bladerunners ${event.teamName} ${event.vs} ${event.oppositionTeamName}`;
  }

  let startDateTime = event.date;
  let endDateTime = event.date;
  if (event.start) {
    if (event.start.endsWith("pm")) {
      let hour = parseInt(event.start.substring(0, event.start.length - 2).trim());
      if (hour < 12) {
        hour += 12;
      }
      startDateTime += "T" + pad0(hour, 2) + ":00:00";
      endDateTime += "T" + pad0(hour + 2, 2) + ":00:00";
    }
  }
  return {
    summary,
    start: {
      date: startDateTime.length === 10 ? startDateTime : undefined,
      dateTime: startDateTime.length > 10 ? startDateTime : undefined,
      timeZone: "Europe/London",
    },
    end: {
      date: endDateTime.length === 10 ? endDateTime : undefined,
      dateTime: endDateTime.length > 10 ? endDateTime : undefined,
      timeZone: "Europe/London",
    },
    location: event.vs && (event.vs === "@" ? event.oppositionTeamName : "Forge Valley"),
  };
}

async function insertAllScheduleEvents(calendarId, schedule) {
  for (const event of schedule) {
    console.log("inserting", event);
    const resource = scheduleEventToCalendarResource(event);
    const response = await Calendar.insertEvent(calendarId, resource);
    console.log("insert response", response);
  }
}

async function deleteAllEvents(calendarId, listener) {
  const calendar = await Calendar.listEvents(calendarId);
  if (calendar.result.items && calendar.result.items.length > 0) {
    let deletedEvents = 0;
    const totalEvents = calendar.result.items.length;
    for (const event of calendar.result.items) {
      console.log("deleting", event.id);
      const response = await Calendar.deleteEvent(calendarId, event.id);
      deletedEvents++;
      listener && listener({
        deletedEvents,
        totalEvents,
        response,
      });
    }
  }
  return calendar.result.items.length;
}

function ToggleVis({ heading, children }) {
  const [show, setShow] = React.useState(false);
  const onClick = (e) => {
    e.preventDefault();
    setShow(!show);
  };
  const style = {
    display: show ? "" : "none",
  };
  return (
    <React.Fragment>
      <div><a href="#" onClick={onClick} className="toggleVisHeading">{heading}</a></div>
      <div style={style}>{children}</div>
    </React.Fragment>
  );
}

function EventsTable({ events }) {
  return (
    <React.Fragment>
      <style>{`
        table.events-table {
          border-collapse: collapse;
        }
        table.events-table tr td, table.events-table tr th {
          border: 2px solid lightgrey;
        }
        `}</style>
      <table className="events-table">
        <tbody>
          {
            events.map((event) => {
              return (
                <tr key={event.id}>
                  <td>{event.start.dateTime || event.start.date}</td>
                  <td><a href={event.htmlLink}>{event.summary}</a></td>
                </tr>
              );
            })
          }
        </tbody>
      </table>
    </React.Fragment>
  );
}

function Error({ title, err }) {
  return (
    <React.Fragment>
      <div><b>{title}:</b></div>
      <pre>{
        (err && err.message)
          ? err.message
          : JSON.stringify(err, null, 2)
      }</pre>
    </React.Fragment>
  );
}

function TickCross({ value }) {
  return (value === true)
    ? "✅"
    : (value === false) ? "❌" : String(value);
}

function EventsApp({
  calendarId,
  apiKey,
  clientId,
  discoveryDocs,
  scope,
}) {
  console.log("EventsApp");

  const [calendar, setCalendar] = React.useState(null);
  const [calendarError, setCalendarError] = React.useState(null);
  const [insertEventsError, setInsertEventsError] = React.useState(null);
  const [deleteEventsError, setDeleteEventsError] = React.useState(null);
  const [user, setUser] = React.useState(null);
  const [signedInStatus, setSignedInStaus] = React.useState(null);
  const [gapiState, setGAPIState] = React.useState(null);

  const loadCalendar = async () => {
    try {
      const response = await Calendar.listEvents(calendarId);
      console.log("response", response);
      setCalendar(response);
      setCalendarError(null);
    } catch (err) {
      console.error(err);
      setCalendarError(err);
    }
  };

  function onSignInChanged() {
    console.log("onSignInChanged");
    const auth = gapi.auth2.getAuthInstance();
    const isSignedIn = auth.isSignedIn.get();
    setSignedInStaus(isSignedIn);
    if (isSignedIn) {
      loadCalendar();
    }
    const user = auth.currentUser.get();
    console.log("user", user, "isSignedIn", isSignedIn);
    setUser(isSignedIn ? user : null);
  };

  React.useEffect(() => {
    Calendar.initGoogleCalendar({
      apiKey,
      clientId,
      onSignInChanged,
    })
      .then(() => {
        console.log("initGoogleClient.then");
        setGAPIState(true);
        gapi.auth2.getAuthInstance().then(onSignInChanged);
      })
      .catch((err) => {
        console.error("initGoogleClient.catch", err);
        setGAPIState(err);
      });
  }, []);

  const onClickAuthBtn = async () => {
    console.log("onClickAuthBtn");
    try {
      const auth = gapi.auth2.getAuthInstance();
      const isSignedIn = auth.isSignedIn.get();
      const result = await (isSignedIn ? auth.signOut() : auth.signIn());
      console.log("onClickAuthBtn.result", result);
    } catch (err) {
      console.error(err);
    }
    onSignInChanged();
  };

  const onClickRefreshCalendarBtn = (e) => {
    loadCalendar();
  };

  const onClickDeleteEventsBtn = async (e) => {
    try {
      const updateDeleted = (s) => setDeleteEventsError(`deleted ${s} events`);
      await deleteAllEvents(calendarId,
        ({ deletedEvents, totalEvents }) => updateDeleted(`${deletedEvents}/${totalEvents}`));
      updateDeleted("all");
    } catch (err) {
      setDeleteEventsError(err);
      return;
    }
    onSignInChanged();
  };

  const onClickInsertEventsBtn = async (e) => {
    try {
      insertAllScheduleEvents(calendarId, schedule);
    } catch (err) {
      console.error("onClickInsertEventsBtn", err);
      setInsertEventsError(err);
      return;
    }
    onSignInChanged();
  };

  let gapiSignedIn = "?";
  let gapiUser = "?";
  if (typeof gapi !== "undefined") {
    gapiSignedIn = gapi.auth2 && gapi.auth2.getAuthInstance().isSignedIn.get();
    console.log("gapiSignedIn", gapiSignedIn);

    gapiUser = gapi.auth2 && gapi.auth2.getAuthInstance().currentUser.get();
    console.log("gapiUser", gapiUser);

    const basicProfile = gapiUser && gapiUser.getBasicProfile();
    gapiUser = basicProfile ? basicProfile.getEmail() : "?";
  }

  return (
    <React.Fragment>
      <ul>
        <li>calendarId: {calendarId}</li>
        <li>apiKey: {apiKey}</li>
        <li>
          GAPI state: <TickCross value={gapiState} /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            Signed in status: <TickCross value={signedInStatus} /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            GAPI signed in: <TickCross value={gapiSignedIn} />
        </li>
        <li><button onClick={onClickAuthBtn}>{signedInStatus ? "Sign out" : "Sign in"}</button> User: {user ? user.getBasicProfile().getEmail() : "no user"}</li>
        <li>GAPI User: {String(gapiUser)}</li>
      </ul>
      <h2>Google Calendar <button onClick={onClickRefreshCalendarBtn}>Refresh</button></h2>
      <p>This data is based on the calendar object from the Google calendar. If it does not appear automatically, click Refresh.</p>
      {calendarError && <Error title="Calendar error" err={calendarError} />}
      {calendar && <ToggleVis heading="Click for raw calendar response"><pre>{JSON.stringify(calendar, null, 2)}</pre></ToggleVis>}
      <h2>
        Google Calendar Events
          {" "}<button onClick={onClickDeleteEventsBtn}>Delete events (permission required)</button>
        {" "}<button onClick={onClickInsertEventsBtn}>Insert events (permission required)</button>
      </h2>
      {deleteEventsError && <Error title="Delete events error" err={deleteEventsError} />}
      {insertEventsError && <Error title="Insert events error" err={insertEventsError} />}
      <ToggleVis heading="Click for raw schedule - derived from Rich's original docx files"><pre>{JSON.stringify(schedule, null, 2)}</pre></ToggleVis>
      <ToggleVis heading="Click for raw events (from Google calendar)"><pre>{JSON.stringify(calendar && calendar.result.items, null, 2)}</pre></ToggleVis>
      <h4>Table of Events</h4>
      <p>This table is based on events from the Google calendar.</p>
      {calendar && calendar.result.items && <EventsTable events={calendar.result.items} />}
    </React.Fragment>
  );
}

export default EventsApp;
