const express = require('express');
const app = express();

/**
 * -----------------------------
 * Helpers (date formatting)
 * -----------------------------
 */

// Converts Salesforce/ISO date into Google Calendar format: YYYYMMDDTHHmmssZ
function toGoogleDate(date) {
  if (!date) return null;
  return new Date(date)
    .toISOString()
    .replace(/[-:]/g, '')
    .split('.')[0] + 'Z';
}

/**
 * -----------------------------
 * MOCK EVENT FETCHER
 * -----------------------------
 * Replace this with real Salesforce query later
 */
async function getEvent(eventId) {
  // TEMP: replace with real Salesforce API / SOQL call
  return {
    id: eventId,
    name: "Campus Visit",
    description: "Admissions Tour",
    location: "California Baptist University",
    start: "2026-06-10T16:00:00Z",
    end: "2026-06-10T17:00:00Z"
  };
}

/**
 * -----------------------------
 * HOME ROUTE (health check)
 * -----------------------------
 */
app.get('/', (req, res) => {
  res.send(`
    <h2>Calendar Service Running</h2>
    <ul>
      <li>/event/:id/google</li>
      <li>/event/:id/ics</li>
      <li>/event/:id/outlook</li>
    </ul>
  `);
});

/**
 * -----------------------------
 * GOOGLE CALENDAR
 * -----------------------------
 */
app.get('/event/:id/google', async (req, res) => {
  const eventId = req.params.id;

  if (!eventId) {
    return res.status(400).send("Missing Event ID");
  }

  const event = await getEvent(eventId);

  const start = toGoogleDate(event.start);
  const end = toGoogleDate(event.end);

  if (!start || !end) {
    return res.status(400).send("Missing Event Dates");
  }

  const url =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    "&text=" + encodeURIComponent(event.name) +
    "&dates=" + start + "/" + end +
    "&details=" + encodeURIComponent(event.description || "") +
    "&location=" + encodeURIComponent(event.location || "");

  res.redirect(url);
});

/**
 * -----------------------------
 * ICS (Apple + Outlook)
 * -----------------------------
 */
app.get('/event/:id/ics', async (req, res) => {
  const eventId = req.params.id;

  if (!eventId) {
    return res.status(400).send("Missing Event ID");
  }

  const event = await getEvent(eventId);

  const start = toGoogleDate(event.start);
  const end = toGoogleDate(event.end);

  const ics =
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Calendar Service//EN
BEGIN:VEVENT
UID:${event.id}@calendar
DTSTAMP:${new Date().toISOString().replace(/[-:]/g,'').split('.')[0]}Z
DTSTART:${start}
DTEND:${end}
SUMMARY:${event.name}
DESCRIPTION:${event.description || ""}
LOCATION:${event.location || ""}
END:VEVENT
END:VCALENDAR`;

  res.setHeader('Content-Type', 'text/calendar');
  res.setHeader('Content-Disposition', 'attachment; filename="event.ics"');
  res.send(ics);
});

/**
 * -----------------------------
 * OUTLOOK (uses ICS download)
 * -----------------------------
 */
app.get('/event/:id/outlook', async (req, res) => {
  // Outlook handles ICS better than deep links in most cases
  return res.redirect(`/event/${req.params.id}/ics`);
});

/**
 * -----------------------------
 * START SERVER
 * -----------------------------
 */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Calendar service running on port " + PORT);
});