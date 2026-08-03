# Defter — Gelir Gider Takip Uygulaması

React + Vite + Tailwind CSS + Framer Motion + Zustand + Firebase ile geliştirilmiş,
tamamen client-tabanlı kişisel gelir/gider takip uygulaması.

## Özellikler

- **Firebase Authentication** ile e-posta/şifre kayıt-giriş, oturum kalıcılığı ve
  yönlendirme koruması (`ProtectedRoute`)
- **Kullanıcı bazlı veri**: Her kullanıcının verisi Firestore'da kendi `uid`'si
  altında tutulur, kimse başkasının verisini göremez (`firestore.rules` dahil)
- **Sayfalar (Ledger Tabs)**: Excel'deki sekmeler gibi, "Azra", "Ev Giderleri" gibi
  istediğin kadar sayfa açabilir, her birinin altına ayrı ayrı gelir/gider
  kaydedebilirsin
- **Genel Bakış**: Tüm sayfaların toplam gelir/gider/net bakiyesi, kategori bazlı
  gelir ve gider dağılım grafikleri (pasta grafik)
- **Gerçek zamanlı senkronizasyon**: Firestore `onSnapshot` ile tüm değişiklikler
  anlık yansır
- Zustand store'ları (`authStore`, `sheetStore`) arayüz ile Firebase arasındaki
  tüm iletişimi yönetir

## Kurulum

```bash
npm install
```

### Firebase projesini bağlama

1. [Firebase Console](https://console.firebase.google.com)'da yeni bir proje oluştur
2. **Authentication > Sign-in method** kısmından **E-posta/Şifre** sağlayıcısını aç
3. **Firestore Database** oluştur (production modunda başlat)
4. Proje kök dizininde `.env.example` dosyasını `.env` olarak kopyala ve
   Firebase Console > Proje Ayarları > Genel > "Web uygulaması ekle" kısmından
   aldığın bilgilerle doldur:

```bash
cp .env.example .env
```

5. Firestore güvenlik kurallarını yayınla — proje kökündeki `firestore.rules`
   dosyasının içeriğini Firebase Console > Firestore Database > Kurallar
   sekmesine yapıştırıp yayınla. Bu kurallar her kullanıcının yalnızca kendi
   verisine erişebilmesini sağlar.

### Geliştirme sunucusu

```bash
npm run dev
```

### Prodüksiyon build

```bash
npm run build
npm run preview
```