import { events } from "./data.js";

const list = document.querySelector("#etkinlik-listesi");
const arama = document.querySelector("#arama");
const kategori = document.querySelector("#kategori");
const sonucSatiri = document.querySelector("#sonuc");

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

function createCard(event) {
    return `
        <article class="kart">
            <h2>${event.title}</h2>

            <p>${event.category}</p>

            <p>
                Tarih:
                ${tarihYaz(event)}, ${event.time}
            </p>

            <p>
                Yer: ${event.location}
            </p>

            <p>
                Kontenjan: ${event.capacity} kişi
            </p>

            <p>
                ${event.description}
            </p>

            <a href="etkinlik-detay.html?id=${event.id}">
                Detayları gör
            </a>
        </article>
    `;
}

function render(dizi) {
    if (dizi.length === 0) {
        list.innerHTML = "";

        if (sonucSatiri) {
            sonucSatiri.textContent =
                "Aramanıza uygun etkinlik bulunamadı.";
        }

        return;
    }

    list.innerHTML = dizi
        .map(createCard)
        .join("");

    if (sonucSatiri) {
        sonucSatiri.textContent =
            `${dizi.length} etkinlik listeleniyor.`;
    }
}

if (kategori) {
    const kategoriler = [
        ...new Set(events.map(event => event.category))
    ];

    kategoriler.forEach((kat) => {
        const option = document.createElement("option");

        option.value = kat;
        option.textContent = kat;

        kategori.appendChild(option);
    });
}

function filtrele() {
    const aranan = arama
        ? arama.value.toLocaleLowerCase("tr-TR")
        : "";

    const secilenKategori = kategori
        ? kategori.value
        : "";

    const sonuc = events.filter((event) => {
        const baslik =
            event.title.toLocaleLowerCase("tr-TR");

        const kategoriMetni =
            event.category.toLocaleLowerCase("tr-TR");

        const aciklama =
            event.description.toLocaleLowerCase("tr-TR");

        const metinUyuyor =
            baslik.includes(aranan) ||
            kategoriMetni.includes(aranan) ||
            aciklama.includes(aranan);

        const kategoriUyuyor =
            secilenKategori === "" ||
            event.category === secilenKategori;

        return metinUyuyor && kategoriUyuyor;
    });

    render(sonuc);
}

if (arama) {
    arama.addEventListener("input", filtrele);
}

if (kategori) {
    kategori.addEventListener("change", filtrele);
}

if (list.dataset.limit) {
    const yaklasan = [...events]
        .sort((a, b) => {
            const [ga, aa, ya] = a.date.split("-");
            const [gb, ab, yb] = b.date.split("-");

            const tarihA = `${ya}-${aa}-${ga}`;
            const tarihB = `${yb}-${ab}-${gb}`;

            return tarihA.localeCompare(tarihB);
        })
        .slice(0, Number(list.dataset.limit));

    render(yaklasan);
} else {
    render(events);
}