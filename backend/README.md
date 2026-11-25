
# Kampüs Etkinlikleri API — Sprint 9

Node.js, Express, MongoDB Atlas ve Mongoose ile geliştirilen
REST API projesidir.

Etkinlikler MongoDB veritabanında kalıcı olarak saklanır.
Sprint 9 ile tam CRUD, arama, kategori filtreleme ve yaklaşan
etkinlikleri listeleme özellikleri eklenmiştir.

## Kurulum ve çalıştırma

```powershell
cd backend
npm install
Copy-Item .env.example .env
```

.env dosyasındaki MONGODB_URI alanına kendi MongoDB bağlantı
adresinizi yazın.

```powershell
npm run seed
npm run dev
```

Varsayılan API adresi: http://localhost:3000

Seed işlemi veritabanını temizleyerek 6 başlangıç etkinliği ekler.
Bu etkinliklerin 2 tanesi geçmiş tarihlidir.

## REST sözleşmesi

| Yöntem | Endpoint | Başarılı yanıt | Hata | Durum |
| --- | --- | --- | --- | --- |
| GET | /health | 200 | - | Çalışıyor |
| GET | /events | 200 | - | Çalışıyor |
| GET | /events?search=atölye | 200 | - | Çalışıyor |
| GET | /events?category=Atölye | 200 | - | Çalışıyor |
| GET | /events?search=atölye&category=Atölye | 200 | - | Çalışıyor |
| GET | /events/upcoming | 200 | - | Çalışıyor |
| GET | /events/:id | 200 | 404 | Çalışıyor |
| POST | /events | 201 | 400 | Çalışıyor |
| PATCH | /events/:id | 200 | 400, 404 | Çalışıyor |
| DELETE | /events/:id | 204 | 404 | Çalışıyor |

## Veri doğrulama

- title, category ve date zorunludur.
- Başlıktaki gereksiz boşluklar trim ile temizlenir.
- Kapasite negatif olamaz.
- Kategoriler: Seminer, Atölye, Söyleşi, Yarışma.
- API tarih biçimi GG-AA-YYYY şeklindedir.
- Tarihler MongoDB'de Date türünde saklanır.
- createdAt ve updatedAt otomatik oluşturulur.
- PATCH yalnızca gönderilen alanları günceller.
- _id, createdAt, updatedAt ve __v değiştirilemez.
- DELETE başarılı olduğunda 204 ve boş yanıt döner.

## Örnek POST isteği

```json
{
  "title": "Git Geçmişi ve Kod İnceleme Atölyesi",
  "category": "Atölye",
  "date": "10-12-2026",
  "capacity": 28,
  "time": "14:00",
  "location": "Yazılım Laboratuvarı B-204",
  "description": "Katılımcılar eşli kod incelemesi yapacak."
}
```

## Örnek PATCH isteği

```json
{
  "capacity": 55
}
```

## Hata yanıtı

```json
{
  "error": {
    "message": "Event not found"
  }
}
```

## Postman ve Newman testleri

Postman koleksiyonu: requests/kampus-api.json

Test sonuçları: requests/run-results.json

Collection Runner sonuçları:

- Toplam istek: 18
- Toplam test: 45
- Başarılı test: 45
- Başarısız test: 0
- Hata: 0

Newman kurulumu:

```bash
npm i -g newman
```

Backend çalışırken öğretmenin test koleksiyonunu çalıştırma:

```bash
newman run https://webdersi.vercel.app/test.json
```

JSON test raporu oluşturma:

```bash
newman run https://webdersi.vercel.app/test.json -r cli,json --reporter-json-export requests/run-results.json
```

## Güvenlik

.env ve node_modules GitHub'a yüklenmez.
MongoDB bağlantı bilgileri ortam değişkenlerinden okunur.

## Sprint 9

- MongoDB kalıcı veri saklama
- PATCH ile etkinlik güncelleme
- DELETE ile etkinlik silme
- Başlığa göre arama
- Kategori filtreleme
- Yaklaşan etkinlikleri listeleme
- Postman ve Newman otomatik testleri

Frontend dosyaları bu sprintte değiştirilmemiştir.
