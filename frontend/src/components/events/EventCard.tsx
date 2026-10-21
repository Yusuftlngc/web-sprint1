import type { CampusEvent } from "../../types/campus-event";
import { formatDate } from "../../utils/format-date";

interface EventCardProps {
  event: CampusEvent;
  onShowDetail: (id: string) => void;
}

function EventCard({
  event,
  onShowDetail
}: EventCardProps) {
  return (
    <article className="kart">

      <h3>
        {event.title}
      </h3>

      <p>
        <b>Kategori:</b> {event.category}
      </p>

      <p>
        <b>Tarih:</b> {formatDate(event.date)}
      </p>

      <p>
        <b>Saat:</b> {event.time}
      </p>

      <p>
        <b>Yer:</b> {event.location}
      </p>

      <p>
        <b>Kontenjan:</b> {event.capacity} kişi
      </p>

      <p>
        {event.description}
      </p>

      <button
        type="button"
        onClick={() => onShowDetail(event.id)}
      >
        Detayları gör
      </button>

    </article>
  );
}

export default EventCard;