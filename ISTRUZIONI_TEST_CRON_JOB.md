# 🧪 ISTRUZIONI PER TESTARE IL CRON JOB DEI REMINDER CHAT

## 📋 Panoramica del Sistema

Il sistema di reminder delle chat funziona così:
1. **Cron Job Vercel**: Esegue ogni 2 giorni (`0 0 */2 * *`)
2. **API Endpoint**: `/api/cron-check-messages`
3. **Logica**: Trova messaggi non letti degli ultimi 2 giorni
4. **Email**: Invia reminder agli utenti con `notify_on_message = true`
5. **Sicurezza**: Autenticazione tramite `CRON_SECRET`

## 🔧 Componenti del Sistema

### ✅ File Configurati
- `vercel.json` - Configurazione cron job
- `pages/api/cron-check-messages.js` - API endpoint
- `utils/emailService.js` - Servizio email
- `pages/api/send-email.js` - API email
- `.env.local` - Variabili d'ambiente

### ✅ Database
- Tabella `profiles` con colonna `notify_on_message`
- Tabella `messages` con colonne `read_at`, `created_at`
- Relazioni foreign key configurate

## 🚀 Test del Sistema

### **Passo 1: Verifica Configurazione Database**

1. **Vai su Supabase Dashboard**
2. **Esegui lo script**: `test-cron-database.sql`
3. **Verifica che**:
   - Esista la colonna `notify_on_message` in `profiles`
   - Esistano almeno 2 utenti con `notify_on_message = true`
   - La tabella `messages` abbia la struttura corretta

### **Passo 2: Crea Messaggi di Test**

1. **Esegui lo script**: `create-test-messages.sql`
2. **Sostituisci gli ID utenti** con quelli reali del tuo database
3. **Verifica che** ci siano messaggi non letti degli ultimi 2 giorni

### **Passo 3: Test Locale dell'API**

1. **Avvia il server**: `npm run dev`
2. **Esegui il test**: `node test-cron-job.js`
3. **Verifica che**:
   - L'API risponda correttamente
   - L'autenticazione funzioni
   - Le email vengano inviate

### **Passo 4: Test Sicurezza**

1. **Test senza autenticazione** (dovrebbe dare 401)
2. **Test con secret sbagliato** (dovrebbe dare 401)
3. **Test con secret corretto** (dovrebbe funzionare)

## 📊 Verifica Risultati

### **Risposta API Attesa**
```json
{
  "success": true,
  "message": "Processati X destinatari",
  "notifications": [
    {
      "receiverId": "user_id",
      "email": "user@example.com",
      "messageCount": 2,
      "success": true
    }
  ],
  "totalUnreadMessages": 5
}
```

### **Email Attese**
- **Oggetto**: "Hai X nuovo messaggio(i) su Connectiamo"
- **Contenuto**: Link diretto a `/messages`
- **Design**: Template HTML con branding Connectiamo

## 🐛 Troubleshooting

### **Problema: API non risponde**
- ✅ Verifica che il server sia in esecuzione
- ✅ Controlla i log del server
- ✅ Verifica la connessione al database

### **Problema: Autenticazione fallisce**
- ✅ Verifica `CRON_SECRET` in `.env.local`
- ✅ Riavvia il server dopo modifiche
- ✅ Controlla il formato `Bearer {secret}`

### **Problema: Email non inviate**
- ✅ Verifica configurazione SMTP
- ✅ Controlla `SMTP_USER` e `SMTP_PASS`
- ✅ Verifica che `notify_on_message = true`

### **Problema: Nessun messaggio trovato**
- ✅ Verifica che esistano messaggi non letti
- ✅ Controlla che siano degli ultimi 2 giorni
- ✅ Verifica relazioni foreign key

## 🔍 Log e Monitoraggio

### **Log del Server**
```bash
# Controlla i log in tempo reale
npm run dev
# Cerca messaggi "Cron job" nei log
```

### **Log Supabase**
- Vai su Supabase Dashboard → Logs
- Cerca query alla tabella `messages`
- Verifica errori di autenticazione

### **Test Manuale**
```bash
# Test diretto dell'API
curl -H "Authorization: Bearer connectiamo_cron_secret_2024" \
     http://localhost:3000/api/cron-check-messages
```

## 🎯 Prossimi Passi

1. **Test completo** del sistema
2. **Verifica email** ricevute
3. **Test in produzione** (Vercel)
4. **Monitoraggio** del cron job
5. **Ottimizzazioni** se necessario

## 📞 Supporto

Se hai problemi:
1. Controlla i log del server
2. Verifica la configurazione database
3. Testa l'API manualmente
4. Controlla le variabili d'ambiente

---

**🎉 Il sistema è configurato correttamente e dovrebbe funzionare!**
