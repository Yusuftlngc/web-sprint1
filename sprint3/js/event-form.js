import { events } from "./data.js";

const form = document.querySelector("#etkinlik-formu");
const mesajKutusu = document.querySelector("#form-mesaj");

function hataGoster(alanAdi, mesaj) {
    const alan = form.elements[alanAdi];
    const hata = document.querySelector(`#${alanAdi}-hata`);

    if (alan) {
        alan.setAttribute("aria-invalid", "true");
    }

    if (hata) {
        hata.textContent = mesaj;
        hata.style.color = "red";
    }
}

function hataTemizle(alanAdi) {
    const alan = form.elements[alanAdi];
    const hata = document.querySelector(`#${alanAdi}-hata`);

    if (alan) {
        alan.removeAttribute("aria-invalid");
    }

    if (hata) {
        hata.textContent = "";
    }
}

function tumHatalariTemizle() {
    const alanlar = [
        "ad",
        "kategori",
        "tarih",
        "saat",
        "yer",
        "kontenjan"
    ];

    alanlar.forEach(hataTemizle);

    mesajKutusu.innerHTML = "";
}

function formVerisiniAl() {
    const formData = new FormData(form);

    return {
        id: "event-7",
        title: formData.get("ad").trim(),
        category: formData.get("kategori"),
        date: formData.get("tarih"),
        time: formData.get("saat"),
        location: formData.get("yer").trim(),
        description: formData.get("aciklama").trim(),
        capacity: Number(formData.get("kontenjan"))
    };
}

function dogrula(data) {
    const hatalar = {};

    if (data.title.length < 3) {
        hatalar.ad = "Etkinlik adı en az 3 karakter olmalıdır.";
    }

    if (!data.category) {
        hatalar.kategori = "Kategori seçmelisiniz.";
    }

    if (!data.date) {
        hatalar.tarih = "Tarih seçmelisiniz.";
    }

    if (!data.time) {
        hatalar.saat = "Saat seçmelisiniz.";
    }

    if (!data.location) {
        hatalar.yer = "Yer bilgisi boş bırakılamaz.";
    }

    if (
        !data.capacity ||
        data.capacity < 1 ||
        data.capacity > 1000
    ) {
        hatalar.kontenjan =
            "Kontenjan 1 ile 1000 arasında olmalıdır.";
    }

    return hatalar;
}

form.addEventListener("submit", (event) => {
    event.preventDefault();

    tumHatalariTemizle();

    const data = formVerisiniAl();

    const hatalar = dogrula(data);

    Object.entries(hatalar).forEach(([alanAdi, mesaj]) => {
        hataGoster(alanAdi, mesaj);
    });

    if (Object.keys(hatalar).length > 0) {
        return;
    }

    mesajKutusu.innerHTML = `
        <div class="basari-kutusu">
            Etkinlik oluşturuldu (bu sprintte kaydedilmez).

            <pre>${JSON.stringify(data, null, 2)}</pre>
        </div>
    `;

    console.log(data);
});

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (form.dataset.mode === "guncelle") {
    const secilenEtkinlik = events.find(
        (event) => event.id === id
    );

    if (!secilenEtkinlik) {
        form.outerHTML = `
            <div class="hata-kutusu">
                <p>
                    Güncellenecek etkinlik bulunamadı.
                    Geçerli bir etkinlik seçiniz.
                </p>

                <a href="etkinlikler.html">
                    Etkinliklere dön
                </a>
            </div>
        `;
    } else {
        form.elements.ad.value = secilenEtkinlik.title;
        form.elements.kategori.value = secilenEtkinlik.category;

        const [gun, ay, yil] =
            secilenEtkinlik.date.split("-");

        form.elements.tarih.value =
            `${yil}-${ay}-${gun}`;

        form.elements.saat.value =
            secilenEtkinlik.time;

        form.elements.yer.value =
            secilenEtkinlik.location;

        form.elements.aciklama.value =
            secilenEtkinlik.description;

        form.elements.kontenjan.value =
            secilenEtkinlik.capacity;

        const buton =
            form.querySelector("button[type='submit']");

        if (buton) {
            buton.textContent = "Güncelle";
        }
    }
}