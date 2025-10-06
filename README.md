# LuchtKoning - Verhuurplatform voor Springkussens en Feesttenten

Een moderne webapplicatie gebouwd met React, TypeScript, Material UI v5 en Supabase voor het beheren van verhuur van springkussens, feesttenten en aanverwante artikelen.

## ✨ Functies

### Klantkant
- 📅 Live agenda met beschikbaarheid
- 🏕️ Overzicht van verhuuritems met filters
- 📝 Boekingsformulier met automatische prijsberekening
- ✅ Bevestigingsscherm na boeking

### Admin Dashboard
- 📦 Artikelenbeheer (CRUD)
- 🧍 Klantenbeheer met boekingsgeschiedenis
- 📅 Boekingenbeheer met kalender
- 📊 Dashboard met statistieken
- ⚙️ Instellingen

## 🚀 Quick Start

### 1. Installeer dependencies
```bash
npm install
```

### 2. Supabase Setup

1. Maak een account op [supabase.com](https://supabase.com)
2. Maak een nieuw project aan
3. Ga naar Project Settings > API
4. Kopieer de URL en anon key

### 3. Database Setup

Ga naar SQL Editor in Supabase en voer het script uit in `supabase/schema.sql`

### 4. Environment Variables

Kopieer `.env.example` naar `.env` en vul je Supabase credentials in:

```bash
cp .env.example .env
```

### 5. Start de applicatie

```bash
npm run dev
```

De applicatie draait nu op `http://localhost:5173`

## 📁 Project Structuur

```
src/
├── components/       # Herbruikbare UI componenten
├── pages/           # Route pagina's
├── lib/             # Utilities en configuratie
├── hooks/           # Custom React hooks
├── types/           # TypeScript type definities
└── theme/           # Material UI theme configuratie
```

## 🗄️ Database Structuur

- `items` - Verhuurartikelen
- `customers` - Klantgegevens
- `bookings` - Boekingen
- `booking_items` - Koppeltabel voor geboekte items
- `settings` - Algemene instellingen

## 🚀 Deployment op Vercel

1. Push je code naar GitHub
2. Ga naar [vercel.com](https://vercel.com) en importeer je repository
3. Voeg environment variables toe in Vercel settings
4. Deploy!

## 🔮 Toekomstige Uitbreidingen

- 💳 Betalingen via Stripe
- 🔔 Notificatiesysteem (e-mail/push)
- 🗺️ Locatiebeheer voor meerdere depots
- 🧾 PDF facturen
- 🌍 Meertaligheid (NL/EN)
- 🔒 Rollen & rechten systeem
- 📱 Verbeterde mobiele weergave

## 📝 License

Proprietary - LuchtKoning

