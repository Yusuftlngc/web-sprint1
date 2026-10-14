import type { CampusEvent } from "../types/campus-event";


export function filterEvents(
  events: CampusEvent[],
  searchText: string,
  category: string
) {

  return events.filter((event) => {

    const searchMatch =
      event.title
        .toLowerCase()
        .includes(searchText.toLowerCase());


    const categoryMatch =
      category === "Tümü" ||
      event.category === category;


    return searchMatch && categoryMatch;

  });

}