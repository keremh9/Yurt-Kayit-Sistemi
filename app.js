const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const odaKapasitesi = (odaNo) => {
    if (!odaNo) return 0;
    if (odaNo === "G-1") return 5;
    if (odaNo === "Z-3") return 3;
    const sonRakam = odaNo.slice(-1);
    const tablo = { '1': 2, '2': 5, '3': 4, '4': 2, '5': 1, '6': 2, '7': 2 };
    return tablo[sonRakam] || 0;
};

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

// DÜZENLEME PANELİ (Seçim yapabilmek için tüm listeyi gönderiyoruz)
app.get('/duzenle', (req, res) => {
    res.render('duzenle', { ogrenciler: ogrenciler, seciliOgrenci: null });
});

// BELİRLİ BİR ÖĞRENCİ SEÇİLDİĞİNDE
app.get('/duzenle/:id', (req, res) => {
    const ogrenci = ogrenciler.find(o => o.id === req.params.id);
    res.render('duzenle', { ogrenciler: ogrenciler, seciliOgrenci: ogrenci });
});

// GÜNCELLEME İŞLEMİ
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

// 5. İLETİŞİM (Yeni)
app.get('/iletisim', (req, res) => res.render('iletisim'));

// SİLME
app.get('/sil/:id', (req, res) => {
    ogrenciler = ogrenciler.filter(o => o.id !== req.params.id);
    res.redirect('/');
});

app.listen(3005, () => console.log("http://localhost:3005"));