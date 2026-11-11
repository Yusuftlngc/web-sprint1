# Kampüs Etkinlikleri API — Sprint 7

Node.js ve Express ile çalışan REST API. Başlangıç verisi altı kampüs etkinliği içerir. Yeni kayıtlar sunucu belleğinde tutulur. Sunucu yeniden başladığında başlangıç verileri yüklenir.

## Kurulum ve çalıştırma

Depo kökünde PowerShell ile çalıştırın.

```powershell
cd backend
npm install
Copy-Item .env.example .env
npm run dev
```

`npm run dev` dosya değişikliklerinde sunucuyu yeniden başlatır. İzleme olmadan başlatmak için `npm start` kullanın. `.env` içindeki `PORT` değerini değiştirebilirsiniz. Varsayılan adres `http://localhost:3000`.

## REST sözleşmesi

| Yöntem | Yol | Girdi | Başarılı yanıt | Hata |
| --- | --- | --- | --- | --- |
| GET | `/health` | — | `200`, `status: "ok"`, ISO 8601 biçiminde UTC `time` ve metin olarak `student` | — |
| GET | `/events` | İsteğe bağlı `?category=Atölye` | `200`, etkinlik dizisi. Filtre için tam eşleşme aranır. Eşleşme yoksa `[]` döner. | — |
| GET | `/events/:id` | Örnek kimlik `event-2` | `200`, etkinlik nesnesi | `404`, `{"error":{"message":"Event not found"}}` |
| POST | `/events` | `Content-Type: application/json` | `201`, sunucunun ürettiği `id` ile etkinlik nesnesi ve detay yolunu içeren `Location` başlığı | `400`, `error.message` içinde eksik alan veya geçersiz JSON hatası |

POST isteğinde `title`, `category` ve `date` boş olmayan metin olmalıdır. `capacity` varsayılan olarak `0`, `time`, `location` ve `description` ise boş metindir. Örnek biçimler tarih için `YYYY-MM-DD`, saat için `HH:mm` şeklindedir.

```json
{
  "title": "Git Geçmişi ve Kod İnceleme Atölyesi",
  "category": "Atölye",
  "date": "2026-12-10",
  "capacity": 28,
  "time": "14:00",
  "location": "Yazılım Laboratuvarı B-204",
  "description": "Katılımcılar küçük bir değişikliği commit edip eşli kod incelemesi yapacak."
}
```

## Testler

`npm test` geçici bir sunucuda HTTP testlerini çalıştırır.

Postman’da [Kampüs API koleksiyonunu](requests/kampus-api.json) içe aktarın ve yeni başlatılmış sunucuda sırayla çalıştırın. Farklı bir port kullanıyorsanız koleksiyonun `baseUrl` değişkenini güncelleyin.

| İstek | Beklenen sonuç |
| --- | --- |
| `GET /health` | 200, sunucu durumu, zaman ve öğrenci numarası |
| `GET /events` | 200, altı başlangıç kaydı |
| `GET /events/event-2` | 200, `event-2` |
| `GET /events/yok` | 404, etkinlik bulunamadı |
| `POST /events`, tam JSON gövdesi | 201, yeni kimlik |
| `POST /events`, yalnızca `title` | 400, eksik zorunlu alanlar |

Koleksiyonu yeniden çalıştırmadan önce sunucuyu yeniden başlatın. Başarılı POST isteği listeye bir kayıt ekler.
