const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Oda kapasitesi hesaplama fonksiyonu
const odaKapasitesi = (odaNo) => {
    if (!odaNo) return 0;
    if (odaNo === "G-1") return 5;
    if (odaNo === "Z-3") return 3;
    const sonRakam = odaNo.slice(-1);
    const tablo = { '1': 2, '2': 5, '3': 4, '4': 2, '5': 1, '6': 2, '7': 2 };
    return tablo[sonRakam] || 0;
};

// Başlangıç verisi
let ogrenciler = [{ id: "1", isim: "Mehmet Kerem Hakan", odaNo: "105", tel: "23040301045" }];

// 1. ANASAYFA
app.get('/', (req, res) => res.render('index', { ogrenciler, odaKapasitesi }));

// 2. YENİ KAYIT
app.get('/yeni-kayit', (req, res) => res.render('yeni-kayit'));
app.post('/yeni-kayit', (req, res) => {
    const { isim, odaNo, tel } = req.body;
    if (!odaNo) return res.send("<script>alert('Oda Seçiniz!'); window.history.back();</script>");
    ogrenciler.push({ id: Date.now().toString(), isim, odaNo, tel });
    res.redirect('/');
});

// 3. DÜZENLEME PANELİ
app.get('/duzenle/:id?', (req, res) => {
    const id = req.params.id;
    const veri = id ? ogrenciler.find(o => o.id === id) : ogrenciler[0];
    res.render('duzenle', { ogrenciler: ogrenciler, ogrenci: veri });
});
    // Eğer ID yoksa listedeki ilk öğrenciyi seç, liste boşsa null gönder
    const seciliOgrenci = id ? ogrenciler.find(o => o.id === id) : (ogrenciler.length > 0 ? ogrenciler[0] : null);
    
    // Tasarımdaki listenin ve formun çalışması için ikisini de gönderiyoruz
    res.render('duzenle', { ogrenciler, seciliOgrenci });
});

// GÜNCELLEME İŞLEMİ (POST)
app.post('/duzenle/:id', (req, res) => {
    const { isim, odaNo, tel } = req.body;
    const index = ogrenciler.findIndex(o => o.id === req.params.id);
    if (index !== -1) {
        ogrenciler[index] = { ...ogrenciler[index], isim, odaNo, tel };
    }
    res.redirect('/');
});

// 4. HAKKIMIZDA
app.get('/hakkimizda', (req, res) => res.render('hakkimizda'));

// 5. İLETİŞİM
app.get('/iletisim', (req, res) => res.render('iletisim'));

// 6. SİLME
app.get('/sil/:id', (req, res) => {
    ogrenciler = ogrenciler.filter(o => o.id !== req.params.id);
    res.redirect('/');
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));

