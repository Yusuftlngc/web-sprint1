import { randomUUID } from "node:crypto";
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

export function createEvent(req, res) {
  const { title, category, date, capacity, time, location, description } = req.body ?? {};

  if (![title, category, date].every((value) => typeof value === "string" && value.trim())) {
    return res.status(400).json({
      error: { message: "title, category and date are required" },
    });
  }

  const parsedCapacity = ["number", "string"].includes(typeof capacity) ? Number(capacity) : 0;
  const event = {
    id: `event-${randomUUID()}`,
    title: title.trim(),
    category: category.trim(),
    date: date.trim(),
    capacity: Number.isFinite(parsedCapacity) ? parsedCapacity : 0,
    time: typeof time === "string" ? time : "",
    location: typeof location === "string" ? location : "",
    description: typeof description === "string" ? description : "",
  };

  events.push(event);
  res.location(`/events/${event.id}`).status(201).json(event);
}
