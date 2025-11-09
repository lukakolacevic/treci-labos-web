# 🎮 Breakout Arkadna Igra

Pojednostavljena verzija klasične Atari Breakout igre implementirana kao HTML5 Canvas web aplikacija.

## 📋 Opis

Igra sadrži:
- 50 cigli raspoređenih u 5 redova x 10 stupaca
- Loptica koja se odbija od palice, cigli i rubova ekrana
- 3D efekti na svim objektima
- Spremanje najboljeg rezultata (localStorage)
- Potpuno komentirani kod

## 🎯 Kontrole

- **Space** - Pokretanje igre
- **← →** ili **A/D** - Kretanje palice lijevo/desno

## 🚀 Lokalno pokretanje

### Opcija 1: Direktno otvaranje u pregledniku
Jednostavno otvorite `index.html` u web pregledniku.

### Opcija 2: Node.js server

1. Instalirajte dependencies:
```bash
npm install
```

2. Pokrenite server:
```bash
npm start
```

3. Otvorite preglednik na: `http://localhost:3000`

## 📦 Deployment opcije

### 1. **Vercel** (Preporučeno - najbrže)

```bash
# Instalirajte Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### 2. **Netlify**

```bash
# Instalirajte Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy
```

### 3. **Render**

1. Spojite GitHub repozitorij
2. Postavite build command: `npm install`
3. Postavite start command: `npm start`

### 4. **Railway**

1. Spojite GitHub repozitorij
2. Railway će automatski detektirati Node.js projekt
3. Deploy se pokreće automatski

### 5. **Heroku**

```bash
# Login
heroku login

# Kreirajte app
heroku create ime-vase-igre

# Deploy
git push heroku main
```

### 6. **GitHub Pages** (samo statičke datoteke)

1. Push kod na GitHub
2. Settings → Pages → Deploy from branch (main)
3. Igra će biti dostupna na `https://username.github.io/repo-name`

## 📁 Struktura projekta

```
treci_labos_web/
├── index.html          # Glavna HTML stranica
├── style.css           # Stiliziranje
├── game.js             # Logika igre
├── server.js           # Express server (opciono)
├── package.json        # Node.js konfiguracija
└── README.md           # Dokumentacija
```

## 🛠️ Tehnologije

- HTML5 Canvas API
- JavaScript (ES6+)
- CSS3
- Node.js + Express (za server)
- LocalStorage API

## 📝 Pravila igre

- Razbijte sve cigle pomoću loptice
- Svaka cigla donosi 1 bod
- Ako loptica padne ispod palice - kraj igre
- Najbolji rezultat se automatski sprema

## 🎨 Features

- ✅ 50 cigli u 5 redova
- ✅ Precizne RGB boje po specifikaciji
- ✅ 3D sjenčanje na svim objektima
- ✅ Fizika odbijanja loptice
- ✅ Povećanje brzine pri udaru u kut cigle
- ✅ LocalStorage za najbolji rezultat
- ✅ Game Over i Win ekrani
- ✅ Potpuno komentirani kod

---

Razvijeno za Web2 - Laboratorijska vježba 3

