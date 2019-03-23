const request = require("superagent");

const CALENDAR_ID = "v7tbd2prfbjaqjpq7ujlughm3s@group.calendar.google.com";
const API_KEY = "AIzaSyBGAE3BClVApBZVA-cXxImJgI2wWO_DStc";
let url = `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${API_KEY}`;

async function getEvents() {
  return new Promise((resolve, reject) => {
    request
      .get(url)
      .set("referer", "https://www.sheffieldbladerunners.co.uk/")
      //.set("referer", "https://gitgrimbo.github.io/br-experiments/")
      .end((err, resp) => {
        if (err) {
          return reject(err);
        }
        resolve(JSON.parse(resp.text));
      });
  });
}

async function main() {
  const { items, ...rest } = await getEvents();
  console.log(rest);
  items.forEach((item) => console.log(item));
}

main().catch((err) => console.error(err));
