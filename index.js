app.get('/ics', (req, res) => {

  const eventId = req.query.id;

  if (!eventId) {
    return res.status(400).send('Missing event id');
  }

  const event = {
    id: eventId,
    title: "Admissions Visit " + eventId,
    description: "Campus Tour at CBU",
    location: "California Baptist University",
    start: "20260610T160000Z",
    end: "20260610T180000Z"
  };

  const ics =
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//CBU//Calendar Service//EN
BEGIN:VEVENT
UID:${event.id}@cbu.edu
DTSTAMP:${new Date().toISOString().replace(/[-:]/g,'').split('.')[0]}Z
DTSTART:${event.start}
DTEND:${event.end}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`;

  res.setHeader('Content-Type', 'text/calendar');
  res.setHeader('Content-Disposition', 'attachment; filename="event.ics"');
  res.send(ics);
});