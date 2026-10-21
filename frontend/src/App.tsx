import { useEffect, useState } from "react";
import "./App.css";

import { events } from "./data/events";

import type { PageName } from "./types/page";

import {
  filterEvents
} from "./utils/filter-events";

import Header from "./components/layout/Header";
import Navigation from "./components/layout/Navigation";
import Footer from "./components/layout/Footer";

import EventList from "./components/events/EventList";
import EventFilter from "./components/events/EventFilter";
import EventDetail from "./components/events/EventDetail";

import EventForm from "./components/forms/EventForm";


function App() {

  const [page, setPage] =
    useState<PageName>("home");

  const [selectedId, setSelectedId] =
    useState<string | null>(null);

  const [searchText, setSearchText] =
    useState("");

  const [category, setCategory] =
    useState("Tümü");


  const categories = [
    "Tümü",
    ...new Set(
      events.map((event) => event.category)
    )
  ];


  const filtered = filterEvents(
    events,
    searchText,
    category
  );


  const upcoming = [...events]
    .sort((a, b) =>
      a.date.localeCompare(b.date)
    )
    .slice(0, 2);


  const selected = selectedId
    ? events.find(
        (event) => event.id === selectedId
      )
    : undefined;


  function go(
    nextPage: PageName,
    id?: string
  ) {

    setPage(nextPage);

    if (id) {
      setSelectedId(id);
    }

  }


  let title = "Kampüs Etkinlikleri";

  let text =
    "Fakültedeki seminer, atölye ve söyleşileri tek yerden takip edin.";


  if (page === "events") {
    title = "Tüm Etkinlikler";
    text = "Etkinlikleri arayın ve kategoriye göre filtreleyin.";
  }


  if (page === "detail" && selected) {
    title = selected.title;
    text = undefined as unknown as string;
  }


  if (page === "add") {
    title = "Etkinlik Ekle";
    text =
      "Bu sprintte form sadece görünüm; kayıt yapılmaz.";
  }


  if (page === "update") {
    title = "Etkinlik Güncelle";
    text =
      "Bu sprintte form sadece görünüm; kayıt yapılmaz.";
  }


  useEffect(() => {

    document.title =
      page === "detail" && selected
        ? `Kampüs Etkinlikleri - ${selected.title}`
        : title;

  }, [page, selected, title]);


  return (
    <>

      <Header
        title={title}
        text={text}
      />

      <Navigation
        current={page}
        onNavigate={(nextPage) =>
          go(nextPage)
        }
      />


      <main>

        {page === "home" && (
          <>
            <h2>
              Yaklaşan 2 Etkinlik
            </h2>

            <EventList
              events={upcoming}
              onShowDetail={(id) =>
                go("detail", id)
              }
            />

            <button
              type="button"
              onClick={() =>
                go("events")
              }
            >
              Tüm etkinlikleri gör
            </button>
          </>
        )}


        {page === "events" && (
          <>
            <EventFilter
              searchText={searchText}
              category={category}
              categories={categories}
              onSearchChange={setSearchText}
              onCategoryChange={setCategory}
            />

            <p className="sonuc">
              {filtered.length} etkinlik listeleniyor.
            </p>

            <EventList
              events={filtered}
              onShowDetail={(id) =>
                go("detail", id)
              }
              emptyText="Aramanıza uygun etkinlik bulunamadı."
            />
          </>
        )}


        {page === "detail" && selected && (
          <EventDetail
            event={selected}
            onBack={() =>
              go("events")
            }
            onEdit={(id) =>
              go("update", id)
            }
          />
        )}


        {page === "add" && (
          <EventForm
            title="Etkinlik Ekle"
            onSubmit={() =>
              window.scrollTo(0, 0)
            }
          />
        )}


        {page === "update" && selected && (
          <EventForm
            title="Etkinlik Güncelle"
            onSubmit={() =>
              window.scrollTo(0, 0)
            }
          />
        )}

      </main>


      <Footer />

    </>
  );
}

export default App;