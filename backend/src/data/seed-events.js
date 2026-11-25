
import { events } from "./events.js";

const dates = [
  "15-10-2026",
  "05-11-2026",
  "01-12-2026",
  "05-12-2026",
  "10-12-2026",
  "17-12-2026",
];

export const seedEvents = events.map((event, index) => ({
  title: event.title,
  category: event.category,
  capacity: Number(event.capacity) || 0,
  date: dates[index],
  time: event.time ?? "",
  location: event.location ?? "",
  description: event.description ?? "",
}));
