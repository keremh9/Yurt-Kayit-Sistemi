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

app.get('/', (req, res) => res.render('index', { ogrenciler, odaKapasitesi }));

app.get('/yeni-kayit', (req, res) => res.render('yeni-kayit'));
app.post('/yeni-kayit', (req, res) => {
    const { isim, odaNo, telefon } = req.body; // EJS'deki 'telefon' ismiyle eşitledik
    ogrenciler.push({ id: Date.now().toString(), isim, odaNo, tel: telefon });
    res.redirect('/');
});

// DÜZENLEME PANELİ - Rota hatası giderildi
app.get('/duzenle/:id?', (req, res) => {
    const id = req.params.id;
    const secili = id ? ogrenciler.find(o => o.id === id) : null;
    // EJS tarafında 'seciliOgrenci' ve 'ogrenci' isimlerini karşılıyoruz
    res.render('duzenle', { ogrenciler: ogrenciler, seciliOgrenci: secili, ogrenci: secili });
});

app.post('/duzenle/:id', (req, res) => {
    const { isim, odaNo, telefon } = req.body; // 'tel' yerine formdaki 'telefon'
    const index = ogrenciler.findIndex(o => o.id === req.params.id);
    if (index !== -1) {
        ogrenciler[index] = { ...ogrenciler[index], isim, odaNo, tel: telefon };
    }
    res.redirect('/');
});

app.get('/hakkimizda', (req, res) => res.render('hakkimizda'));
app.get('/iletisim', (req, res) => res.render('iletisim'));

app.get('/sil/:id', (req, res) => {
    ogrenciler = ogrenciler.filter(o => o.id !== req.params.id);
    res.redirect('/');
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => console.log(`Sunucu hazır: http://localhost:${PORT}`));
