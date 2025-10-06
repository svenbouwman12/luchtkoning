# 📁 Project Structuur - LuchtKoning

## 📂 Folder Structuur

```
LuchtKoning/
├── 📄 README.md                      # Project overzicht en quick start
├── 📄 DEPLOYMENT_GUIDE.md            # Uitgebreide deployment instructies
├── 📄 FEATURES.md                    # Overzicht van alle features
├── 📄 TODO.md                        # Toekomstige uitbreidingen
├── 📄 PROJECT_STRUCTURE.md           # Dit bestand
│
├── 📦 package.json                   # Dependencies en scripts
├── 📦 tsconfig.json                  # TypeScript configuratie
├── 📦 vite.config.ts                 # Vite build configuratie
├── 📦 vercel.json                    # Vercel deployment configuratie
├── 📦 .eslintrc.cjs                  # ESLint regels
├── 📦 .gitignore                     # Git ignore regels
│
├── 🌐 index.html                     # HTML entry point
│
├── 📁 public/                        # Statische assets
│   └── vite.svg                      # Placeholder logo
│
├── 📁 supabase/                      # Database schema
│   └── schema.sql                    # Complete database setup script
│
└── 📁 src/                           # Broncode
    ├── 📄 main.tsx                   # React entry point
    ├── 📄 App.tsx                    # Root component met routing
    │
    ├── 📁 components/                # Herbruikbare componenten
    │   └── 📁 layouts/
    │       ├── CustomerLayout.tsx    # Layout voor klantenkant
    │       └── AdminLayout.tsx       # Layout voor admin dashboard
    │
    ├── 📁 pages/                     # Route pagina's
    │   ├── 📁 customer/              # Klantenkant pagina's
    │   │   ├── HomePage.tsx          # Homepage met hero
    │   │   ├── ItemsPage.tsx         # Overzicht verhuuritems
    │   │   ├── BookingPage.tsx       # Boekingsformulier
    │   │   └── ConfirmationPage.tsx  # Bevestiging na boeking
    │   │
    │   └── 📁 admin/                 # Admin dashboard pagina's
    │       ├── AdminDashboard.tsx    # Dashboard met statistieken
    │       ├── AdminItems.tsx        # Artikelenbeheer (CRUD)
    │       ├── AdminCustomers.tsx    # Klantenbeheer
    │       ├── AdminBookings.tsx     # Boekingenbeheer
    │       └── AdminSettings.tsx     # Instellingen
    │
    ├── 📁 lib/                       # Libraries en configuratie
    │   ├── supabase.ts               # Supabase client setup
    │   └── utils.ts                  # Utility functies
    │
    ├── 📁 hooks/                     # Custom React hooks
    │   └── useSupabase.ts            # Hooks voor Supabase data
    │
    ├── 📁 types/                     # TypeScript types
    │   └── database.types.ts         # Database type definities
    │
    └── 📁 theme/                     # Styling
        └── theme.ts                  # Material UI theme config
```

---

## 📄 Bestand Beschrijvingen

### Root Bestanden

#### `package.json`
- **Doel**: NPM package configuratie
- **Bevat**: Dependencies, scripts, project metadata
- **Scripts**:
  - `npm run dev` - Start development server
  - `npm run build` - Build voor productie
  - `npm run preview` - Preview production build

#### `vite.config.ts`
- **Doel**: Vite bundler configuratie
- **Features**: React plugin, path aliases (@/...)

#### `tsconfig.json`
- **Doel**: TypeScript compiler configuratie
- **Features**: Strict mode, ESNext target, path mapping

#### `vercel.json`
- **Doel**: Vercel deployment configuratie
- **Features**: SPA routing (alle routes → index.html)

---

### Source Code (`src/`)

#### `main.tsx`
- **Doel**: React applicatie entry point
- **Functie**: Rendert App component in DOM

#### `App.tsx`
- **Doel**: Root component
- **Functie**: 
  - Router setup
  - Theme provider
  - Date picker locale
  - Route definities

---

### Components

#### `CustomerLayout.tsx`
**Locatie**: `src/components/layouts/`
- **Doel**: Layout voor klantenkant
- **Bevat**:
  - Top navigation bar
  - Links naar Home, Artikelen, Boeken
  - Footer met contactinfo
  - Outlet voor child routes

#### `AdminLayout.tsx`
**Locatie**: `src/components/layouts/`
- **Doel**: Layout voor admin dashboard
- **Bevat**:
  - Sidebar navigation
  - Menu items: Dashboard, Artikelen, Klanten, Boekingen, Instellingen
  - Responsive drawer voor mobiel
  - Link terug naar klantenkant

---

### Pages - Customer

#### `HomePage.tsx`
- **Route**: `/`
- **Doel**: Landing page
- **Bevat**: Hero section, features, CTAs

#### `ItemsPage.tsx`
- **Route**: `/items`
- **Doel**: Overzicht verhuuritems
- **Features**: Grid weergave, filters (categorie, beschikbaarheid)

#### `BookingPage.tsx`
- **Route**: `/booking`
- **Doel**: Boekingsformulier
- **Features**: 
  - Klantgegevens formulier
  - Datum selectie
  - Item selectie met aantallen
  - Prijsberekening
  - Validatie overlappende boekingen

#### `ConfirmationPage.tsx`
- **Route**: `/confirmation?bookingId=xxx`
- **Doel**: Bevestiging na boeking
- **Bevat**: Boekingsdetails, klantinfo, volgende stappen

---

### Pages - Admin

#### `AdminDashboard.tsx`
- **Route**: `/admin`
- **Doel**: Dashboard overzicht
- **Statistieken**:
  - Boekingen vandaag/deze maand/totaal
  - Omzet deze maand
  - Aantal klanten
  - Populairste item

#### `AdminItems.tsx`
- **Route**: `/admin/items`
- **Doel**: Artikelenbeheer
- **CRUD**: Create, Read, Update, Delete items
- **Features**: Tabel met afbeeldingen, edit dialog

#### `AdminCustomers.tsx`
- **Route**: `/admin/customers`
- **Doel**: Klantenbeheer
- **Features**: 
  - Overzicht klanten
  - Detail modal met boekingsgeschiedenis
  - Totaal uitgegeven
  - Interne notities

#### `AdminBookings.tsx`
- **Route**: `/admin/bookings`
- **Doel**: Boekingenbeheer
- **Features**:
  - Overzicht boekingen
  - Status wijzigen
  - Details bekijken
  - Verwijderen

#### `AdminSettings.tsx`
- **Route**: `/admin/settings`
- **Doel**: Algemene instellingen
- **Velden**: Bedrijfsnaam, contact, BTW%, valuta

---

### Library Files

#### `lib/supabase.ts`
- **Doel**: Supabase client instantie
- **Export**: `supabase` client voor queries

#### `lib/utils.ts`
- **Doel**: Utility functies
- **Functies**:
  - `formatCurrency()` - EUR formatting
  - `calculateDays()` - Dagen tussen datums
  - `isValidEmail()` - Email validatie
  - `isValidPhone()` - Telefoon validatie
  - `generateShortId()` - Korte ID voor weergave
  - `truncate()` - Tekst afkappen

---

### Hooks

#### `hooks/useSupabase.ts`
- **Doel**: Custom hooks voor data fetching
- **Hooks**:
  - `useItems()` - Haal items op
  - `useBookings()` - Haal boekingen op
  - `useCustomers()` - Haal klanten op
- **Features**: Loading state, error handling, refetch

---

### Types

#### `types/database.types.ts`
- **Doel**: TypeScript type definities
- **Types**:
  - `Item` - Verhuurartikel
  - `Customer` - Klant
  - `Booking` - Boeking
  - `BookingItem` - Geboekt item
  - `Settings` - Instellingen
  - Extended types met relaties
  - Form data types
  - Dashboard stats type

---

### Theme

#### `theme/theme.ts`
- **Doel**: Material UI theme configuratie
- **Features**:
  - Material Design 3 stijl
  - Kleurenpalet (primary, secondary, etc.)
  - Typography (Roboto)
  - Component overrides (rounded corners)
  - Responsive breakpoints

---

## 🗄️ Database

### `supabase/schema.sql`
- **Doel**: Complete database setup
- **Bevat**:
  - Tabel definities
  - Indexes
  - Triggers (auto-update timestamps)
  - Functions (customer total_spent)
  - Sample data
  - Comments voor RLS setup

---

## 🎨 Design Systeem

### Kleuren
- **Primary**: Blauw (#1976d2) - Hoofdacties, navigatie
- **Secondary**: Oranje (#ff9800) - Secundaire acties
- **Success**: Groen (#2e7d32) - Bevestigingen, beschikbaar
- **Error**: Rood (#d32f2f) - Errors, niet beschikbaar
- **Warning**: Oranje (#ed6c02) - Waarschuwingen

### Typografie
- **Font**: Roboto (Material Design standaard)
- **Sizes**: h1-h6, body1, body2, caption

### Spacing
- **Base unit**: 8px (MUI standaard)
- **Rounding**: 12-16px voor cards en buttons

---

## 🔄 Data Flow

### Boeking Proces
```
Klant (BookingPage)
  ↓
Validatie
  ↓
Supabase (customers tabel)
  ↓ (insert/update)
Supabase (bookings tabel)
  ↓ (insert)
Supabase (booking_items tabel)
  ↓ (insert)
Database Trigger (update customer.total_spent)
  ↓
Redirect naar ConfirmationPage
```

### Admin Operaties
```
Admin Interface
  ↓
Form Submit
  ↓
Supabase Query (CRUD)
  ↓
Refetch Data
  ↓
UI Update
```

---

## 🔌 API Endpoints (Supabase)

Alle communicatie via Supabase REST API:
- `POST /rest/v1/items` - Create item
- `GET /rest/v1/items` - Read items
- `PATCH /rest/v1/items?id=eq.xxx` - Update item
- `DELETE /rest/v1/items?id=eq.xxx` - Delete item
- (Zelfde voor customers, bookings, etc.)

---

## 🚀 Build Process

### Development
```bash
npm run dev
→ Vite Dev Server
→ Hot Module Replacement
→ http://localhost:5173
```

### Production
```bash
npm run build
→ TypeScript compile
→ Vite build
→ Output: dist/
→ Deploy dist/ to Vercel
```

---

## 📦 Dependencies Breakdown

### Core
- `react` + `react-dom` - UI library
- `typescript` - Type safety
- `vite` - Build tool

### UI
- `@mui/material` - Component library
- `@mui/icons-material` - Icons
- `@mui/x-date-pickers` - Date pickers
- `@emotion/react` + `@emotion/styled` - CSS-in-JS

### Routing
- `react-router-dom` - Client-side routing

### Backend
- `@supabase/supabase-js` - Database client

### Utils
- `date-fns` - Date manipulation

---

## 🧪 Code Kwaliteit

### Linting
- ESLint met TypeScript plugin
- React Hooks regels
- Auto-fix on save (optioneel in editor)

### TypeScript
- Strict mode enabled
- No implicit any
- Unused locals/parameters check

### Best Practices
- Component per file
- Hooks voor logica hergebruik
- Types voor alle data
- Error boundaries (TODO)
- Loading states overal

---

## 📱 Responsiveness

### Breakpoints (MUI)
- **xs**: 0px - Mobiel portrait
- **sm**: 600px - Mobiel landscape / Kleine tablet
- **md**: 960px - Tablet
- **lg**: 1280px - Desktop
- **xl**: 1920px - Grote desktop

### Responsive Features
- Sidebar → Drawer op mobiel
- Grid → Stack op kleine schermen
- Touch-friendly buttons
- Scrollable tabellen

---

## 🔒 Security Notes

### Huidige Status
⚠️ **LET OP**: Deze applicatie heeft momenteel geen authenticatie!

### Voor Productie
- Implementeer Supabase Auth
- Enable RLS policies
- Valideer alle input server-side
- HTTPS only
- Environment variables beveiligen

---

## 📈 Performance

### Optimalisaties
- Code splitting per route (via React Router)
- Lazy loading images
- Efficient queries (select specifieke velden)
- Database indexes
- Vite build optimalisatie

### Monitoring
- Check bundle size: `npm run build`
- Lighthouse scores
- Network tab in DevTools

---

## 🎯 Next Steps

1. ✅ Project setup
2. ✅ Database schema
3. ✅ Basis functionaliteit
4. 🔜 Authenticatie toevoegen
5. 🔜 Betalingen integreren
6. 🔜 Email notificaties
7. 🔜 Testing

Zie `TODO.md` voor volledige roadmap!

---

**Happy coding! 🎈**

