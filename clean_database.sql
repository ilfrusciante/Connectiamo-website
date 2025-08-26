-- SCRIPT PER PULIRE COMPLETAMENTE IL DATABASE CONNECTIAMO
-- ATTENZIONE: Questo script ELIMINA TUTTI i dati esistenti!

-- 1. ELIMINO TUTTI I MESSAGGI
DELETE FROM messages;
-- Reset dell'auto-increment se presente
ALTER SEQUENCE IF EXISTS messages_id_seq RESTART WITH 1;

-- 2. ELIMINO TUTTI I PROFILI
DELETE FROM profiles;
-- Reset dell'auto-increment se presente
ALTER SEQUENCE IF EXISTS profiles_id_seq RESTART WITH 1;

-- 3. ELIMINO TUTTI GLI UTENTI AUTH
-- ATTENZIONE: Questo elimina TUTTI gli account di autenticazione
-- Dopo questo comando dovrai ricreare tutti gli account da zero
DELETE FROM auth.users;

-- 4. VERIFICO CHE LE TABELLE SIANO VUOTE
SELECT 'profiles' as tabella, COUNT(*) as record FROM profiles
UNION ALL
SELECT 'messages' as tabella, COUNT(*) as record FROM messages
UNION ALL
SELECT 'auth.users' as tabella, COUNT(*) as record FROM auth.users;

-- 5. RESET DELLE SEQUENZE (se presenti)
-- ALTER SEQUENCE IF EXISTS profiles_id_seq RESTART WITH 1;
-- ALTER SEQUENCE IF EXISTS messages_id_seq RESTART WITH 1;

-- 6. VERIFICO LO STATO FINALE
SELECT 
  schemaname,
  relname as tablename,
  n_tup_ins as inserimenti,
  n_tup_del as eliminazioni,
  n_live_tup as record_attuali
FROM pg_stat_user_tables 
WHERE relname IN ('profiles', 'messages')
ORDER BY relname;

-- MESSAGGIO DI COMPLETAMENTO
SELECT 'Database pulito con successo! Ora puoi ricominciare da zero.' as status;
