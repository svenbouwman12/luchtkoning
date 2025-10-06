# 🔍 Build Checklist - Voor ELKE Commit!

## ⚠️ BELANGRIJK: Voer dit uit VOOR elke commit!

Dit voorkomt build errors op Vercel en houdt de code schoon.

## ✅ Pre-Commit Checklist

### 1. Type Check
```bash
npm run type-check
```
**Verwacht**: Geen errors
**Fixt**: Type errors, missing properties, etc.

### 2. Lint Check
```bash
npm run lint
```
**Verwacht**: Geen errors of warnings
**Fixt**: Ongebruikte imports, ongebruikte variables, code style

### 3. Auto-Fix Lint Issues
```bash
npm run lint:fix
```
**Fixt automatisch**: Vele lint issues

### 4. Test Build Lokaal
```bash
npm run build
```
**Verwacht**: Succesvol build zonder errors
**Dit is precies wat Vercel doet!**

### 5. Clean Build (optioneel bij problemen)
```bash
rm -rf dist node_modules package-lock.json
npm install
npm run build
```

## 🚀 All-in-One Pre-Commit Command

```bash
npm run precommit
```

Dit runt automatisch:
- ✅ Type checking
- ✅ Linting

## 🔧 Veelvoorkomende Fixes

### "X is declared but never read"
**Probleem**: Ongebruikte import of variable
**Fix**: Verwijder de ongebruikte import/variable

```typescript
// ❌ Fout
import { Button, Alert } from '@mui/material';
// Alert wordt niet gebruikt

// ✅ Goed
import { Button } from '@mui/material';
```

### Type Errors
**Probleem**: Missing properties, type mismatch
**Fix**: Voeg ontbrekende properties toe of fix type

```typescript
// ❌ Fout
const formData = {
  name: '',
  email: '',
  // startTime en endTime ontbreken!
};

// ✅ Goed
const formData: BookingFormData = {
  name: '',
  email: '',
  startTime: '',
  endTime: '',
};
```

### Backup Bestanden
**Probleem**: Oude .tsx bestanden met type errors
**Fix**: VERWIJDER backup bestanden!

```bash
# Verwijder ALLE *Old.tsx bestanden
find src -name "*Old.tsx" -delete
```

## 📋 Git Workflow

```bash
# 1. Maak wijzigingen
# ... edit files ...

# 2. Pre-commit check
npm run precommit

# 3. Fix eventuele issues
npm run lint:fix
# Controleer en fix type errors handmatig

# 4. Test build
npm run build

# 5. Als alles OK is:
git add .
git commit -m "Your message"
git push

# 6. Check Vercel deployment
# Ga naar Vercel dashboard en check build logs
```

## 🛡️ Preventie Tips

### 1. Editor Setup
Zet je editor (VS Code) in om:
- Lint errors te tonen
- Auto-fix bij save
- TypeScript errors te highlighten

**VS Code settings.json**:
```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

### 2. Verwijder Ongebruikte Code Meteen
- Import iets → gebruik het direct
- Maak een variable → gebruik het direct
- Anders: verwijder het!

### 3. Test Lokaal Voor Commit
**ALTIJD** `npm run build` draaien voor commit!

### 4. Gebruik Type-Safe Patterns
```typescript
// ✅ Goed: Type annotaties
const [data, setData] = useState<MyType[]>([]);

// ✅ Goed: Expliciete types
function myFunction(param: string): number {
  return parseInt(param);
}
```

### 5. Backup Bestanden in .gitignore
Voeg toe aan `.gitignore`:
```
*Old.tsx
*Backup.tsx
*.backup
```

## 🚨 Als Vercel Build Faalt

### Stap 1: Check Build Logs
Lees de Vercel error message zorgvuldig

### Stap 2: Reproduceer Lokaal
```bash
npm run build
```

### Stap 3: Fix Errors
Gebruik de error messages om te fixen

### Stap 4: Test Opnieuw
```bash
npm run precommit
npm run build
```

### Stap 5: Commit & Push
```bash
git add .
git commit -m "Fix: [beschrijf wat je fixt]"
git push
```

## 📊 Checklist Template

Kopieer dit in je commit messages als reminder:

```
✅ Type check passed
✅ Lint check passed  
✅ Build succeeds locally
✅ No unused imports/variables
✅ No backup files included
```

## 🎯 Goal

**ZERO BUILD ERRORS ON VERCEL!**

Door deze checklist te volgen elke keer:
- ✅ Builds slagen altijd
- ✅ Code blijft schoon
- ✅ Type safety gegarandeerd
- ✅ Geen ongebruikte code
- ✅ Professionele codebase

---

**Onthoud**: Een minuut extra checking bespaart 10 minuten debugging! 🎉

