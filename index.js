const express = require('express');
const app = express();

app.get('/ics', (req, res) => {

  const eventId = req.query.id;

  if (!eventId) {
    return res.status(400).send('Missing event id');
  }

  const start = "20260610T160000Z";
  const end = "20260610T170000Z";

  const ics =
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Calendar Service//EN
BEGIN:VEVENT
UID:${eventId}@calendar
DTSTAMP:${new Date().toISOString().replace(/[-:]/g,'').split('.')[0]}Z
DTSTART:${start}
DTEND:${end}
SUMMARY:Test Event ${eventId}
LOCATION:CBU
END:VEVENT
END:VCALENDAR`;

  res.setHeader('Content-Type', 'text/calendar');
  res.setHeader('Content-Disposition', 'attachment; filename="event.ics"');
  res.send(ics);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

app.get('/google', (req, res) => {

  const id = req.query.id;

  const title = encodeURIComponent("Campus Visit");
  const details = encodeURIComponent("Admissions Tour");
  const location = encodeURIComponent("California Baptist University");

  // Example fixed dates (we’ll connect Salesforce later)
  const start = "20260610T160000Z";
  const end = "20260610T170000Z";

  const url =
`https://calendar.google.com/calendar/render?action=TEMPLATE
&text=${title}
&dates=${start}/${end}
&details=${details}
&location=${location}`;

  res.redirect(url);
});

app.get('/outlook', (req, res) => {

  const id = req.query.id;

  const title = encodeURIComponent("Campus Visit");
  const location = encodeURIComponent("California Baptist University");

  const start = "20260610T160000Z";
  const end = "20260610T170000Z";

  const url =
`https://outlook.live.com/calendar/0/deeplink/compose
?subject=${title}
&startdt=2026-06-10T16:00:00Z
&enddt=2026-06-10T17:00:00Z
&location=${location}`;

  res.redirect(url);
});