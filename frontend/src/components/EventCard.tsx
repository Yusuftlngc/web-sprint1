import type { CampusEvent } from "../types/campus-event";


type Props = {
    event: CampusEvent;
    onDetail: (id: string) => void;
};


function EventCard({ event, onDetail }: Props) {


    return (

        <article
            className="kart"
            onClick={() => onDetail(event.id)}
        >

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


        </article>

    );

}


export default EventCard;