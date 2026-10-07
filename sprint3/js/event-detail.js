import { events } from "./data.js";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const event = events.find((item) => item.id === id);

const baslik = document.querySelector("#detay-baslik");
const bilgiler = document.querySelector("#detay-bilgileri");
const afis = document.querySelector("#detay-afis");

function tarihYaz(event) {
    const [gun, ay, yil] = event.date.split("-");

    const tarih = new Date(
        Number(yil),
        Number(ay) - 1,
        Number(gun)
    );

    return tarih.toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

if (!event) {
    baslik.textContent = "Etkinlik bulunamadı";
    afis.style.display = "none";

    bilgiler.innerHTML = `
        <div class="hata-kutusu">
            Geçersiz veya eksik etkinlik id'si.
        </div>

        <p>
            <a href="etkinlikler.html">
                ← Listeye dön
            </a>
        </p>
    `;
} else {
    baslik.textContent = event.title;
afis.style.display = "block";
    document.title = event.title;

    bilgiler.innerHTML = `
        <h2>Etkinlik Künyesi</h2>

        <dl>
            <dt>Tarih</dt>
            <dd>${tarihYaz(event)}, ${event.time}</dd>

            <dt>Yer</dt>
            <dd>${event.location}</dd>

            <dt>Kategori</dt>
            <dd>${event.category}</dd>

            <dt>Kontenjan</dt>
            <dd>${event.capacity} kişi</dd>
        </dl>

        <h2>Açıklama</h2>

        <p>${event.description}</p>

        <p>
            <a href="etkinlikler.html">
                ← Listeye dön
            </a>
        </p>

        <p>
            <a href="etkinlik-guncelle.html?id=${event.id}">
                Bu etkinliği güncelle
            </a>
        </p>
    `;
}