import { useState } from "react";
import EventFilter from "../components/events/EventFilter";
import EventList from "../components/events/EventList";
import { useEvents } from "../context/EventsContext";
import { filterEvents } from "../utils/filter-events";

function EventsPage() {
  const { events } = useEvents();
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("Tümü");
  const categories = ["Tümü", ...new Set(events.map((event) => event.category))];
  const filtered = filterEvents(events, searchText, category);

  return (
    <>
      <h2 className="bolum-baslik">Etkinlikler</h2>
      <EventFilter searchText={searchText} category={category} categories={categories}
        onSearchChange={setSearchText} onCategoryChange={setCategory} />
      <p className="sonuc" aria-live="polite">{filtered.length} etkinlik listeleniyor.</p>
      <EventList events={filtered} emptyText="Aramanıza uygun etkinlik bulunamadı." />
    </>
  );
}

export default EventsPage;
