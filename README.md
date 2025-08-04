
# Connectiamo

**Connectiamo** è una piattaforma moderna, responsive e accessibile, costruita con **Next.js**, **Tailwind CSS** e **Supabase**, pensata per connettere persone in modo semplice, veloce e sicuro.

## Funzionalità principali

- Registrazione e login utenti con Supabase
- Creazione e modifica del profilo utente
- Sistema di messaggistica in tempo reale
- Dashboard personale
- Visualizzazione di profili compatibili (match)
- Notifiche dinamiche
- Modal contatti e modulo supporto
- Ricerca avanzata con filtri (ruolo, città, zona, categoria)
- Traduzione multilingua (IT / EN)
- Modalità dark / light
- FAQ, Termini e Privacy
- Pannello amministratore



## Struttura del progetto

### `/pages/`

- `index.js` — Homepage con Hero, Searchbar e sezioni introduttive
- `chi-siamo.js` — Pagina Chi Siamo
- `faq.js` — Domande frequenti
- `privacy.js` — Privacy Policy
- `terms.js` — Termini e Condizioni
- `support.js` — Supporto utenti
- `login.js` / `signup.js` — Autenticazione
- `dashboard.js` — Area utente
- `profile.js` — Modifica profilo
- `messages.js` — Messaggistica utente
- `match.js` — Visualizza utenti compatibili
- `notifications.js` — Notifiche utente
- `admin.js` — Pannello admin
- `logout.js` — Logout
- `404.js` — Pagina non trovata

### `/components/`

- `Hero.js`
- `Searchbar.js`
- `Navbar.js`
- `Footer.js`
- `ContactModal.js`
- `StepSection.js`
- `ProfileCard.js`
- `MessageItem.js`
- `MessageList.js`
- `LanguageSwitcher.js`
- `UserList.js`
- `UserCard.js`
- `UserProfile.js`
- `LoadingSpinner.js`
- `AvatarUpload.js`

### `/utils/`

- `supabaseClient.js`
- `useAuth.js`
- `useUser.js`
- `useLocalStorage.js`
- `useTheme.js`
- `send-email.js`

### `/styles/`

- `globals.css`

## Configurazione

- `.env.local`
- `tailwind.config.js`
- `postcss.config.js`
- `next.config.js`
- `package.json`
- `_app.js` / `_document.js`

## Script disponibili

```bash
npm install        # Installa le dipendenze
npm run dev        # Avvia il server in modalità sviluppo
npm run build      # Crea la build di produzione
npm run start      # Avvia il server in produzione
npm run lint       # Controllo del codice
```

## Test

- Test unitari in `/__tests__/`
- Esempi consigliati:
  - `Navbar.test.js`
  - `Searchbar.test.js`
  - `ProfileCard.test.js`

```bash
npm run test
```

## Traduzione

Pronto per `next-i18next`, con `LanguageSwitcher.js` incluso.

## Autore

Realizzato come progetto Next.js completo per **Connectiamo**.
