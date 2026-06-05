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