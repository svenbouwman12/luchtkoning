# 🚀 Deployment Guide - LuchtKoning

Deze handleiding helpt je bij het opzetten en deployen van de LuchtKoning webapp.

## 📋 Vereisten

- Node.js 18+ en npm
- Een Supabase account (gratis tier is voldoende voor testen)
- Een Vercel account (gratis tier is voldoende)
- Git

## 🔧 Stap 1: Lokale Setup

### 1.1 Installeer dependencies

```bash
npm install
```

### 1.2 Maak een Supabase project

1. Ga naar [supabase.com](https://supabase.com)
2. Klik op "New Project"
3. Vul de project details in
4. Wacht tot het project is aangemaakt

### 1.3 Configureer de database

1. Ga naar de SQL Editor in je Supabase dashboard
2. Open het bestand `supabase/schema.sql`
3. Kopieer de inhoud en plak het in de SQL Editor
4. Klik op "Run" om de database aan te maken

Dit creëert:
- Alle benodigde tabellen (items, customers, bookings, etc.)
- Indexes voor betere performance
- Triggers voor automatische updates
- Sample data om mee te testen

### 1.4 Haal je Supabase credentials op

1. Ga naar Project Settings > API
2. Kopieer de **Project URL**
3. Kopieer de **anon/public key**

### 1.5 Configureer environment variables

Hernoem `.env.example` naar `.env` en vul je credentials in:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 1.6 Start de development server

```bash
npm run dev
```

De applicatie draait nu op `http://localhost:5173`

## 🌐 Stap 2: Deployment naar Vercel

### 2.1 Push code naar GitHub

```bash
git init
git add .
git commit -m "Initial commit - LuchtKoning webapp"
git branch -M main
git remote add origin https://github.com/your-username/luchtkoning.git
git push -u origin main
```

### 2.2 Deploy op Vercel

1. Ga naar [vercel.com](https://vercel.com)
2. Klik op "New Project"
3. Importeer je GitHub repository
4. Vercel detecteert automatisch dat het een Vite project is

### 2.3 Configureer environment variables in Vercel

1. Ga naar Project Settings > Environment Variables
2. Voeg toe:
   - `VITE_SUPABASE_URL` = je Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = je Supabase anon key
3. Klik op "Save"

### 2.4 Deploy

1. Klik op "Deploy"
2. Wacht tot de deployment klaar is (meestal 1-2 minuten)
3. Je app is nu live op `https://your-project.vercel.app`

## 🔒 Stap 3: Beveilig je Database (Optioneel maar aanbevolen)

### 3.1 Enable Row Level Security (RLS)

In de Supabase SQL Editor:

```sql
-- Enable RLS voor alle tabellen
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Public read access voor items (klanten kunnen items zien)
CREATE POLICY "Items zijn zichtbaar voor iedereen"
ON items FOR SELECT
USING (true);

-- TODO: Voeg authenticatie toe en creëer policies voor admin functies
```

### 3.2 Setup Authentication (Voor later)

Voor een volledige productie-omgeving, voeg Supabase Auth toe:

1. Ga naar Authentication in je Supabase dashboard
2. Enable Email provider
3. Configureer email templates
4. Update de RLS policies om alleen authenticated users toe te staan

## 📊 Stap 4: Test de Applicatie

### 4.1 Test de klantenkant

1. Ga naar de homepage
2. Bekijk de items op `/items`
3. Maak een testboeking op `/booking`
4. Controleer de bevestigingspagina

### 4.2 Test het admin dashboard

1. Ga naar `/admin`
2. Test het toevoegen/bewerken van items
3. Bekijk klanten en boekingen
4. Update de instellingen

## 🔧 Onderhoud en Updates

### Database Backup

Supabase maakt automatisch backups. Voor handmatige backups:

1. Ga naar Database > Backups in Supabase
2. Klik op "Create Backup"

### Updates deployen

```bash
git add .
git commit -m "Your update message"
git push
```

Vercel deployed automatisch bij elke push naar main.

## 🐛 Troubleshooting

### Error: "Supabase URL en Anon Key zijn vereist"

- Controleer of je `.env` bestand correct is ingevuld
- Herstart de development server na het updaten van `.env`

### Database errors

- Controleer of het schema correct is uitgevoerd in Supabase
- Kijk in de Supabase logs (Database > Logs)

### Deployment fails

- Controleer of alle environment variables correct zijn ingesteld in Vercel
- Bekijk de build logs in Vercel

## 📧 Support

Voor vragen of problemen, check de volgende resources:

- [Supabase Documentatie](https://supabase.com/docs)
- [Vite Documentatie](https://vitejs.dev)
- [Material UI Documentatie](https://mui.com)
- [Vercel Documentatie](https://vercel.com/docs)

## ✅ Checklist voor Go-Live

- [ ] Database schema uitgevoerd
- [ ] Sample data verwijderd of aangepast
- [ ] Environment variables ingesteld
- [ ] Bedrijfsgegevens bijgewerkt in Admin > Instellingen
- [ ] RLS policies geconfigureerd
- [ ] Applicatie getest op desktop en mobiel
- [ ] Custom domein gekoppeld (optioneel)
- [ ] Analytics toegevoegd (optioneel)

Succes met je LuchtKoning applicatie! 🎈

