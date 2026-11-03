# Kampüs Etkinlikleri — Sprint 6 ve Vize

Yusuf Tolungüç — React, TypeScript ve React Router ile kampüs etkinlikleri uygulaması.

## Canlı yayın

Depoda kayıtlı önceki yayın adresi: https://web-sprint1-liart.vercel.app/

Sprint 6 sürümü henüz GitHub/Vercel'e gönderilmedi. Yayın sonrasında güncel adres doğrulanmalı; teslim yönergesindeki `isimsoyisim-frontend.vercel.app` biçimindeki alan adı Vercel'de ayarlanmalıdır.

## Kurulum ve çalıştırma

Node.js 24.15 veya üzeri bir 24.x sürümü önerilir (22.x için en az 22.22.2). Depo kökünden:

```sh
cd frontend
npm install
npm run dev
```

Derleme ve kod denetimi:

```sh
npm run build
npm run lint
npm test
npm run preview
```

## Sayfalar (10 route)

| Adres | Sayfa |
| --- | --- |
| `/` | Yaklaşan 2 etkinlik |
| `/events` | Arama ve kategori filtresi ile tüm etkinlikler |
| `/events/:id` | Etkinlik detayı |
| `/login` | Giriş formu (demo) |
| `/register` | Kayıt formu (demo) |
| `/forgot-password` | Şifre yenileme formu (demo) |
| `/admin` | Etkinlik yönetimi |
| `/admin/new` | Etkinlik ekleme |
| `/admin/:id/edit` | Etkinlik güncelleme |
| `*` | Sayfa bulunamadı |

## Davranışlar

- Etkinlikler `EventsContext` ve `useEvents` ile tüm ilgili sayfalarda paylaşılır.
- Yeni etkinlik eklenir; mevcut etkinlik düzenlenir; silme öncesi onay istenir.
- İşlemler Ana Sayfa, Etkinlikler, Detay ve Yönetim sayfalarına anında yansır.
- Veriler sadece bellekte tutulur. Sayfa yenilenince başlangıç verilerine dönülür.
- Etkinlik formu: ad en az 3 karakter, kategori seçili, tarih/saat/yer dolu, kontenjan 1–1000 arası tam sayı, açıklama en az 10 karakter.
- Giriş/kayıt/şifre yenileme formları yalnızca demo doğrulaması yapar. Hesap açılmaz, oturum başlatılmaz, e-posta gönderilmez.
- E-posta kuralı `@` içerme; şifre kuralı en az 6 karakterdir. Kayıtta ad soyad en az 3 karakter, iki şifre aynı olmalıdır.
- Yönetim tablosu 699 px ve altında kartlara dönüşür.
- Geçersiz etkinlik ve düzenleme adreslerinde bulunamadı sayfası açılır.

## Vercel ayarları

- Framework: Vite
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`
- `vercel.json`, alt sayfaları doğrudan açarken ve yenilerken uygulamaya yönlendirir.

## Teslim öncesi

Yerel kontrollerden sonra GitHub'a gönderim ve Vercel yayını için kullanıcı onayı alınmalıdır. Yönergedeki commit mesajı: `Complete sprint 6 and midterm frontend`; tag: `frontend`. Yayın sonrasında README dosyalarındaki canlı adres doğrulanıp güncellenmelidir.
