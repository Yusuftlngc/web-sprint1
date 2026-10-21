import type { CampusEvent } from "../types/campus-event";

export function filterEvents(
  events: CampusEvent[],
  searchText: string,
  category: string
): CampusEvent[] {

  const search = searchText
    .trim()
    .toLocaleLowerCase("tr-TR");

  return events.filter((event) => {

    const textMatch =
      event.title
        .toLocaleLowerCase("tr-TR")
        .includes(search) ||

      event.description
        .toLocaleLowerCase("tr-TR")
        .includes(search);


    const categoryMatch =
      category === "Tümü" ||
      event.category === category;


    return textMatch && categoryMatch;

  });

}