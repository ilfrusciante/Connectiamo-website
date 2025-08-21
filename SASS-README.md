# 🎨 Sistema Sass per Connectiamo

## 📁 Struttura file

```
src/styles/
├── custom.scss          # ← File sorgente Sass (modifica questo!)
└── custom.scss

styles/
└── custom.css          # ← File CSS compilato (NON modificare!)
```

## 🚀 Come usare

### **1. Installazione dipendenze**
```bash
npm install
```

### **2. Sviluppo (due terminali)**
```bash
# Terminale 1: Next.js
npm run dev

# Terminale 2: Watch mode Sass
npm run dev:sass
```
Questo approccio:
- ✅ **Avvia** Next.js in modalità sviluppo
- ✅ **Avvia** il watch mode Sass in parallelo
- ✅ **Compila** `custom.scss` → `custom.css` ad ogni salvataggio
- ✅ **Compressione** automatica del CSS

### **3. Compilazione manuale**
```bash
npm run sass:build
```

### **4. Solo watch mode Sass**
```bash
npm run sass
```
Questo comando:
- ✅ **Compila** `custom.scss` → `custom.css`
- ✅ **Compressione** automatica del CSS
- ✅ **Watch mode** - ricompila ad ogni salvataggio
- ✅ **Output** in `styles/custom.css`

## ✏️ Come modificare gli stili

### **Modifica il file sorgente:**
1. **Apri** `src/styles/custom.scss`
2. **Modifica** variabili, mixins, stili
3. **Salva** il file
4. **Il CSS si ricompila automaticamente** (se watch mode attivo)

### **Esempi di modifiche:**

#### **Cambiare colori principali:**
```scss
// Modifica queste variabili
$primary-color: #0f1e3c;      // ← Colore principale
$secondary-color: #fbbf24;    // ← Colore secondario
```

#### **Aggiungere nuovi componenti:**
```scss
.card {
  background: $bg-gray;
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

#### **Creare nuovi mixins:**
```scss
@mixin gradient-bg($start, $end) {
  background: linear-gradient(45deg, $start, $end);
}
```

## 🎯 Vantaggi del sistema

- ✅ **File sorgente** Sass con variabili e mixins
- ✅ **Compilazione automatica** ad ogni salvataggio
- ✅ **CSS compresso** per produzione
- ✅ **Organizzazione** chiara dei stili
- ✅ **Riutilizzo** di componenti e utility

## ⚠️ Importante

- **NON modificare** `styles/custom.css` (si sovrascrive automaticamente)
- **Modifica SOLO** `src/styles/custom.scss`
- **Usa sempre** `npm run dev` + `npm run dev:sass` per sviluppo
- **Usa** `npm run sass:build` per build di produzione

## 🔧 Troubleshooting

### **Se il CSS non si aggiorna:**
1. **Verifica** che il watch mode sia attivo: `npm run dev:sass` (in terminale separato)
2. **Controlla** che il file sorgente sia salvato
3. **Verifica** i permessi delle cartelle

### **Se ci sono errori di compilazione:**
1. **Controlla** la sintassi Sass nel file sorgente
2. **Verifica** che tutte le variabili siano definite
3. **Controlla** la console per errori specifici

## 📚 Risorse Sass

- [Documentazione Sass](https://sass-lang.com/documentation)
- [Guida Mixins](https://sass-lang.com/guide#mixins)
- [Variabili Sass](https://sass-lang.com/guide#variables) 