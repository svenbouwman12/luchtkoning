# ⚡ Quick Start Guide - LuchtKoning

Kom in **10 minuten** van nul naar een draaiende applicatie!

## 🚀 In 5 Stappen Live

### Stap 1️⃣: Clone & Install (2 min)

```bash
cd /Users/renevanderwerff/Projects/LuchtKoning
npm install
```

**Wacht tot alle packages geïnstalleerd zijn...**

---

### Stap 2️⃣: Supabase Setup (3 min)

1. **Ga naar** [supabase.com](https://supabase.com)
2. **Klik** op "New Project"
3. **Vul in**:
   - Project naam: `luchtkoning`
   - Database wachtwoord: (kies een sterk wachtwoord)
   - Regio: `West EU (Ireland)`
4. **Klik** "Create new project"
5. ⏳ **Wacht** ~2 minuten tot project klaar is

---

### Stap 3️⃣: Database Aanmaken (1 min)

1. In je Supabase dashboard, **ga naar** `SQL Editor` (linkermenu)
2. **Klik** op "New Query"
3. **Open** het bestand `supabase/schema.sql` in deze repo
4. **Kopieer** de volledige inhoud
5. **Plak** in de SQL Editor
6. **Klik** op "Run" (of `Cmd+Enter`)
7. ✅ **Zie** "Success. No rows returned" → Perfect!

---

### Stap 4️⃣: Environment Setup (1 min)

1. In Supabase, **ga naar** `Settings` > `API`
2. **Kopieer**:
   - Project URL
   - anon/public key

3. **Maak** `.env` bestand in project root:

```bash
# Maak het bestand
touch .env

# Open in editor en plak:
VITE_SUPABASE_URL=https://jouwprojectid.supabase.co
VITE_SUPABASE_ANON_KEY=jouw-anon-key-hier
```

**Of kopieer `.env.example`:**
```bash
cp .env.example .env
# Bewerk .env met je credentials
```

---

### Stap 5️⃣: Start! (1 min)

```bash
npm run dev
```

**Open browser op:** `http://localhost:5173`

🎉 **KLAAR!**

---

## 🎯 Wat kun je nu doen?

### Als Klant
1. 🏠 Ga naar de homepage → Zie hero en features
2. 🏕️ Klik op "Bekijk Artikelen" → Zie 6 vooraf ingevulde items
3. 📝 Klik op "Boek nu" bij een item → Maak je eerste boeking
4. ✅ Vul het formulier in → Zie bevestiging

### Als Admin
1. 🔗 Ga naar `http://localhost:5173/admin`
2. 📊 Zie het dashboard met statistieken
3. 📦 Ga naar "Artikelen" → Voeg een nieuw artikel toe
4. 🧍 Ga naar "Klanten" → Bekijk klantdetails
5. 📅 Ga naar "Boekingen" → Beheer boekingen
6. ⚙️ Ga naar "Instellingen" → Pas bedrijfsgegevens aan

---

## 🔍 Controleer of alles werkt

### Checklist
- [ ] Homepage laadt zonder errors
- [ ] Items pagina toont 6 voorbeelditems
- [ ] Je kunt een boeking maken
- [ ] Admin dashboard toont statistieken
- [ ] Je kunt een nieuw item toevoegen
- [ ] Settings pagina laadt bedrijfsgegevens

**Probleem?** → Zie Troubleshooting hieronder

---

## 🐛 Troubleshooting

### Error: "Supabase URL en Anon Key zijn vereist"
**Oplossing:**
```bash
# Controleer of .env bestaat
cat .env

# Moet tonen:
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_ANON_KEY=eyJ...

# Herstart dev server
npm run dev
```

### Geen items zichtbaar
**Oplossing:**
```bash
# Controleer of schema.sql correct is uitgevoerd
# Ga naar Supabase > Table Editor
# Moet zien: items, customers, bookings, booking_items, settings tabellen
# Items tabel moet 6 rijen hebben (sample data)
```

### Database errors
**Oplossing:**
1. Ga naar Supabase > Table Editor
2. Controleer of alle tabellen bestaan
3. Zo niet, voer `schema.sql` opnieuw uit

### Port 5173 in gebruik
**Oplossing:**
```bash
# Vite kiest automatisch een andere poort
# Kijk in de terminal voor de nieuwe URL
```

---

## 📚 Volgende Stappen

### Optie 1: Verder Ontwikkelen
- 📖 Lees `TODO.md` voor uitbreidingsideeën
- 🔐 Voeg authenticatie toe
- 💳 Integreer betalingen

### Optie 2: Deployen naar Productie
- 📘 Volg `DEPLOYMENT_GUIDE.md`
- 🚀 Deploy naar Vercel
- 🌐 Koppel een domein

### Optie 3: Aanpassen
- 🎨 Wijzig kleuren in `src/theme/theme.ts`
- 📝 Update bedrijfsgegevens in Admin > Instellingen
- 🖼️ Vervang afbeeldingen in database

---

## 🎓 Leer de Codebase Kennen

### Belangrijkste Bestanden
```
src/
├── App.tsx                    ← Start hier (routing)
├── pages/customer/HomePage.tsx ← Klantenkant
├── pages/admin/AdminDashboard.tsx ← Admin
├── lib/supabase.ts            ← Database connectie
└── types/database.types.ts    ← TypeScript types
```

### Hoe het werkt
1. **Routing**: `App.tsx` definieert alle routes
2. **Layouts**: Wrapper voor klant/admin met navigatie
3. **Pages**: Individuele pagina's per route
4. **Supabase**: Direct queries naar Postgres database
5. **Types**: TypeScript zorgt voor type-safety

---

## 💡 Tips

### Development
```bash
# Formatteer code
npx prettier --write .

# Check types
npx tsc --noEmit

# Build voor productie (test)
npm run build
npm run preview
```

### Database
- **Table Editor**: Visueel data bekijken/bewerken
- **SQL Editor**: Custom queries uitvoeren
- **Database Logs**: Errors en queries bekijken

### Debug
- Open browser DevTools (F12)
- Check Console voor errors
- Network tab voor API calls
- React DevTools voor component tree

---

## 🎨 Personalisatie

### Bedrijfsnaam wijzigen
1. Ga naar `http://localhost:5173/admin/settings`
2. Wijzig "LuchtKoning" naar jouw naam
3. Opslaan

### Kleuren aanpassen
```typescript
// src/theme/theme.ts
palette: {
  primary: {
    main: '#1976d2', // ← Verander dit!
  },
  secondary: {
    main: '#ff9800', // ← En dit!
  },
}
```

### Logo toevoegen
1. Plaats logo in `public/logo.png`
2. Update `index.html` favicon
3. Update `CustomerLayout.tsx` en `AdminLayout.tsx`

---

## 📞 Hulp Nodig?

### Resources
- 📘 **README.md** - Project overzicht
- 🚀 **DEPLOYMENT_GUIDE.md** - Deployment instructies
- ✨ **FEATURES.md** - Alle features uitgelegd
- 🔮 **TODO.md** - Toekomstige features
- 📁 **PROJECT_STRUCTURE.md** - Code structuur

### Documentatie
- [Supabase Docs](https://supabase.com/docs)
- [React Docs](https://react.dev)
- [Material UI](https://mui.com)
- [Vite](https://vitejs.dev)

### Community
- Supabase Discord
- Stack Overflow
- GitHub Issues

---

## ✅ Success Checklist

- [x] Project geïnstalleerd
- [x] Supabase project aangemaakt
- [x] Database schema uitgevoerd
- [x] Environment variables ingesteld
- [x] Dev server draait
- [x] Homepage werkt
- [x] Items zichtbaar
- [x] Boeking mogelijk
- [x] Admin dashboard werkt

**🎉 Gefeliciteerd! Je bent nu klaar om te beginnen!**

---

## 🚀 Pro Tips

1. **Gebruik hot reload**: Bewaar bestanden → Automatische refresh
2. **TypeScript helpt je**: Rode squiggly lines = errors
3. **Supabase heeft realtime**: Uncomment in `hooks/useSupabase.ts`
4. **Test op mobiel**: Open `http://[jouw-ip]:5173` op telefoon
5. **Version control**: Maak commits na elke feature

---

**Veel plezier met bouwen! 🎈**

Vragen? Check de andere documentatie bestanden!

