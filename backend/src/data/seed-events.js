
import { events } from "./events.js";

export const seedEvents = events.map((event) => ({
  title: event.title,
  category: event.category,
  capacity: Number(event.capacity) || 0,
  date: event.date,
  time: event.time ?? "",
  location: event.location ?? "",
  description: event.description ?? "",
}));
