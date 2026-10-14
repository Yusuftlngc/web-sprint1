import { useEffect, useState } from "react";
import "./App.css";

import { events } from "./data/events";
import { filterEvents } from "./utils/filter-events";


type Page =
  | "home"
  | "events"
  | "detail"
  | "form";


function App() {


  useEffect(() => {

    document.title = "Kampüs Etkinlikleri";

  }, []);



  const [page, setPage] = useState<Page>("home");


  const [searchText, setSearchText] = useState("");


  const [category, setCategory] = useState("Tümü");


  const [selectedId, setSelectedId] =
    useState<string | null>(null);


  const [formType, setFormType] =
    useState<"add" | "update">("add");



  const categories = [
    "Tümü",
    ...new Set(
      events.map((event) => event.category)
    )
  ];



  const filteredEvents = filterEvents(
    events,
    searchText,
    category
  );



  const selectedEvent = events.find(
    (event) => event.id === selectedId
  );




  function go(
    nextPage: Page,
    id?: string
  ) {

    setPage(nextPage);


    if (id) {
      setSelectedId(id);
    }

  }




  function EventCard({
    event
  }: {
    event: typeof events[number]
  }) {


    return (

      <article className="kart">


        <h3>
          {event.title}
        </h3>


        <p>
          <b>Kategori:</b> {event.category}
        </p>


        <p>
          <b>Tarih:</b> {event.date}
        </p>


        <p>
          <b>Saat:</b> {event.time}
        </p>


        <p>
          <b>Yer:</b> {event.location}
        </p>


        <p>
          {event.description}
        </p>



        <button
          onClick={() =>
            go("detail", event.id)
          }
        >
          Detayları gör
        </button>


      </article>

    );

  }





  function FormPage() {

    return (

      <form className="kart">


        <h2>

          {
            formType === "add"
              ? "Etkinlik Ekle"
              : "Etkinlik Güncelle"
          }

        </h2>



        <label>
          Etkinlik adı
        </label>

        <input />



        <label>
          Kategori
        </label>

        <select>

          <option>
            Seminer
          </option>

          <option>
            Atölye
          </option>

          <option>
            Söyleşi
          </option>

        </select>



        <label>
          Tarih
        </label>

        <input type="date" />



        <label>
          Saat
        </label>

        <input type="time" />



        <label>
          Yer
        </label>

        <input />



        <label>
          Açıklama
        </label>

        <textarea />



        <button type="button">
          Kaydet
        </button>


      </form>

    );

  }






  return (

    <>


      <header>


        <h1>
          Kampüs Etkinlikleri
        </h1>



        <nav>


          <a
            href="#"
            onClick={(e) => {

              e.preventDefault();

              go("home");

            }}
          >
            Ana Sayfa
          </a>



          <a
            href="#"
            onClick={(e) => {

              e.preventDefault();

              go("events");

            }}
          >
            Etkinlikler
          </a>



          <a
            href="#"
            onClick={(e) => {

              e.preventDefault();

              setFormType("add");

              go("form");

            }}
          >
            Ekle
          </a>



        </nav>


      </header>





      <main>


        {
          page === "home" && (

            <>

              <h2>
                Yaklaşan Etkinlikler
              </h2>


              <section className="etkinlik-listesi">

                {
                  events
                    .slice(0, 2)
                    .map((event) => (

                      <EventCard
                        key={event.id}
                        event={event}
                      />

                    ))
                }

              </section>


            </>

          )
        }







        {
          page === "events" && (

            <>

              <h2>
                Tüm Etkinlikler
              </h2>


              <input
                placeholder="Etkinlik ara"
                value={searchText}
                onChange={(e) =>
                  setSearchText(e.target.value)
                }
              />



              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
              >

                {
                  categories.map((cat) => (

                    <option key={cat}>
                      {cat}
                    </option>

                  ))
                }

              </select>




              <section className="etkinlik-listesi">

                {
                  filteredEvents.map((event) => (

                    <EventCard
                      key={event.id}
                      event={event}
                    />

                  ))
                }

              </section>


            </>

          )
        }







        {
          page === "detail" &&
          selectedEvent && (

            <article className="kart">


              <h2>
                {selectedEvent.title}
              </h2>


              <p>
                {selectedEvent.description}
              </p>


              <p>
                {selectedEvent.location}
              </p>



              <button
                onClick={() => {

                  setFormType("update");

                  go(
                    "form",
                    selectedEvent.id
                  );

                }}
              >
                Güncelle
              </button>



              <button
                onClick={() =>
                  go("home")
                }
              >
                Listeye dön
              </button>


            </article>

          )
        }







        {
          page === "form" &&
          <FormPage />
        }



      </main>




      <footer>
        Yusuf Tolunç - 2026
      </footer>



    </>

  );

}


export default App;