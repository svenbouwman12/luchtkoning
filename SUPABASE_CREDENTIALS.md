# 🔐 Supabase Credentials - LuchtKoning

## ⚠️ BELANGRIJK: Voeg deze credentials toe aan Vercel!

### Supabase Project Details

**Project URL:**
```
https://vvjzuaknfaqncnltnfen.supabase.co
```

**Anon/Public Key:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2anp1YWtuZmFxbmNubHRuZmVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NzU4NDEsImV4cCI6MjA3NTM1MTg0MX0.A2Hm7-C9j8tOfrfU6yA9uZrGtr8LrcFVMG_Rfp-vBs4
```

---

## 📋 Stappen om toe te voegen aan Vercel

### 1. Ga naar Vercel Dashboard
   - Open: https://vercel.com
   - Selecteer je "luchtkoning" project

### 2. Open Settings
   - Klik op "Settings" tab bovenaan
   - Klik op "Environment Variables" in het linkermenu

### 3. Voeg de eerste variable toe
   - **Key:** `VITE_SUPABASE_URL`
   - **Value:** `https://vvjzuaknfaqncnltnfen.supabase.co`
   - Klik "Add"

### 4. Voeg de tweede variable toe
   - **Key:** `VITE_SUPABASE_ANON_KEY`
   - **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2anp1YWtuZmFxbmNubHRuZmVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NzU4NDEsImV4cCI6MjA3NTM1MTg0MX0.A2Hm7-C9j8tOfrfU6yA9uZrGtr8LrcFVMG_Rfp-vBs4`
   - Klik "Add"

### 5. Redeploy
   - Ga naar de "Deployments" tab
   - Klik op de laatste deployment
   - Klik op de "..." (drie puntjes) rechtsboven
   - Klik "Redeploy"

---

## 🖥️ Lokale Development Setup

Maak een `.env` bestand in de project root:

```bash
VITE_SUPABASE_URL=https://vvjzuaknfaqncnltnfen.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2anp1YWtuZmFxbmNubHRuZmVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NzU4NDEsImV4cCI6MjA3NTM1MTg0MX0.A2Hm7-C9j8tOfrfU6yA9uZrGtr8LrcFVMG_Rfp-vBs4
```

Dan:
```bash
npm run dev
```

---

## 🗄️ Database Setup

Als je dit nog niet gedaan hebt:

1. **Ga naar Supabase Dashboard:** https://supabase.com/dashboard/project/vvjzuaknfaqncnltnfen
2. **Open SQL Editor** (linkermenu)
3. **Klik "New Query"**
4. **Kopieer de inhoud van** `supabase/schema.sql` **uit dit project**
5. **Plak in de SQL Editor**
6. **Klik "Run"** (of druk Cmd+Enter)
7. ✅ Database is klaar!

---

## ✅ Checklist

- [ ] Environment variables toegevoegd aan Vercel
- [ ] Vercel deployment opnieuw gestart
- [ ] Lokaal `.env` bestand aangemaakt
- [ ] Database schema uitgevoerd in Supabase
- [ ] Applicatie test met `npm run dev`

---

## 🔒 Security Note

⚠️ De `anon` key is bedoeld voor client-side gebruik en is **veilig om te delen** in frontend code.

Voor productie:
- Enable Row Level Security (RLS) in Supabase
- Voeg authenticatie toe
- Configureer RLS policies

Zie `TODO.md` voor security roadmap.

---

## 🎉 Success!

Als alles correct is ingesteld, zou je applicatie nu moeten werken op Vercel!

Test de live URL en controleer of:
- [ ] Items pagina laadt
- [ ] Je een boeking kunt maken
- [ ] Admin dashboard werkt

