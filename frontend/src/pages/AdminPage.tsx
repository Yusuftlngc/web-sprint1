import { Link } from "react-router-dom";
import { useEvents } from "../context/EventsContext";
import { formatDate } from "../utils/format-date";

function AdminPage() {
  const { events, deleteEvent } = useEvents();

  function handleDelete(id: string, title: string) {
    if (window.confirm(`"${title}" silinsin mi?`)) deleteEvent(id);
  }

  return (
    <>
      <h2 className="bolum-baslik">Etkinlik Yönetimi</h2>
      <p><Link className="buton" to="/admin/new">+ Yeni etkinlik</Link></p>
      {events.length === 0 ? <p className="sonuc">Henüz etkinlik yok.</p> : (
        <table className="tablo">
          <caption className="ekran-okuyucu">Etkinlikler ve yönetim işlemleri</caption>
          <thead><tr>
            <th scope="col">Etkinlik</th><th scope="col">Tarih</th>
            <th scope="col">Kategori</th><th scope="col">İşlemler</th>
          </tr></thead>
          <tbody>{events.map((event) => (
            <tr key={event.id}>
              <td data-baslik="Etkinlik">{event.title}</td>
              <td data-baslik="Tarih">{formatDate(event.date)}</td>
              <td data-baslik="Kategori">{event.category}</td>
              <td data-baslik="İşlemler" className="islemler">
                <Link className="buton" to={`/admin/${event.id}/edit`} aria-label={`${event.title} etkinliğini düzenle`}>Düzenle</Link>
                <button className="buton buton-sil" type="button" aria-label={`${event.title} etkinliğini sil`}
                  onClick={() => handleDelete(event.id, event.title)}>Sil</button>
              </td>
            </tr>
          ))}</tbody>
        </table>
      )}
    </>
  );
}

export default AdminPage;
