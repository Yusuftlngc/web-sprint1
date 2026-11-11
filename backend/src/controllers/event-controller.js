import { events } from "../data/events.js";

export function getEvents(req, res) {
  const { category } = req.query;
  const results = category
    ? events.filter((event) => event.category === category)
    : events;

  res.json(results);
}

export function getEventById(req, res) {
  const event = events.find(({ id }) => id === req.params.id);

  if (!event) {
    return res.status(404).json({ error: { message: "Event not found" } });
  }

  res.json(event);
}
