import type { CampusEvent } from "../types/campus-event";

export function findEventById(
  events: CampusEvent[],
  id: string
): CampusEvent | undefined {
  return events.find((event) => event.id === id);
}
