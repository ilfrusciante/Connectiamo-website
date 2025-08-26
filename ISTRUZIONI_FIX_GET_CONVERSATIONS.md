# ISTRUZIONI PER SISTEMARE LA FUNZIONE get_conversations

## Problema Identificato
La funzione `get_conversations` nel database Supabase non funziona correttamente, causando l'errore 406 quando si cerca di aprire la chat.

## Soluzione
Ho creato il file `fix_get_conversations.sql` che contiene la definizione corretta della funzione.

## Come Applicare la Correzione

### Opzione 1: Dashboard Supabase (Raccomandato)
1. **Vai su [supabase.com](https://supabase.com)**
2. **Accedi al tuo progetto** Connectiamo
3. **Vai su "SQL Editor"** nella barra laterale sinistra
4. **Copia e incolla** tutto il contenuto del file `fix_get_conversations.sql`
5. **Clicca "Run"** per eseguire lo script

### Opzione 2: Via API (Alternativa)
Se preferisci usare l'API, puoi eseguire lo script tramite curl o un client SQL.

## Cosa Fa la Funzione
La funzione `get_conversations` ora:
- ✅ **Recupera tutte le conversazioni** di un utente
- ✅ **Mostra l'ultimo messaggio** di ogni conversazione
- ✅ **Conta i messaggi non letti** per ogni contatto
- ✅ **Ordina per data** dell'ultimo messaggio
- ✅ **Ha i permessi corretti** per utenti anonimi e autenticati

## Verifica
Dopo aver eseguito lo script:
1. **Prova a cliccare "Contatta"** su un risultato di ricerca
2. **Verifica che la chat si apra** correttamente
3. **Controlla che i contatti** si carichino nella pagina messaggi

## Se Continua a Non Funzionare
1. **Controlla la console del browser** per errori
2. **Verifica i permessi RLS** della tabella `profiles`
3. **Controlla che la funzione** sia stata creata correttamente

## Note Tecniche
- La funzione usa `SECURITY DEFINER` per bypassare i permessi RLS
- I permessi sono concessi a `anon` e `authenticated`
- La funzione gestisce correttamente i messaggi bidirezionali
