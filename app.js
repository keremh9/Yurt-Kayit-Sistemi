const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Başlangıç verisi - Senin numaran
let ogrenciler = [{ id: "1", isim: "Mehmet Kerem Hakan", odaNo: "105", tel: "23040301045" }];

// ANASAYFA
app.get('/', (req, res) => res.render('index', { ogrenciler }));

// DÜZENLEME PANELİ (Internal Server Error Çözümü)
app.get('/duzenle/:id?', (req, res) => {
    const id = req.params.id;
    // Eğer ID varsa onu bul, yoksa listedeki ilk öğrenciyi seç
    const secili = id ? ogrenciler.find(o => o.id === id) : ogrenciler[0];
    
    // Hata buradaydı: EJS ile değişken ismini 'ogrenci' olarak sabitliyoruz
    res.render('duzenle', { ogrenciler: ogrenciler, ogrenci: secili });
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

// DİĞER SAYFALAR
app.get('/hakkimizda', (req, res) => res.render('hakkimizda'));
app.get('/iletisim', (req, res) => res.render('iletisim'));

app.listen(3005, () => console.log("http://localhost:3005"));
