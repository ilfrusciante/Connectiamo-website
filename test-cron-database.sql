-- Script di test per il cron job dei reminder delle chat
-- Esegui questo script su Supabase per verificare la struttura del database

-- 1. VERIFICA STRUTTURA TABELLA PROFILES
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- 2. VERIFICA STRUTTURA TABELLA MESSAGES
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'messages' 
ORDER BY ordinal_position;

-- 3. VERIFICA SE ESISTE LA COLONNA notify_on_message
SELECT 
  column_name,
  data_type
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name = 'notify_on_message';

-- 4. VERIFICA UTENTI ESISTENTI E LORO PREFERENZE
SELECT 
  id,
  email,
  nickname,
  notify_on_message,
  created_at
FROM profiles 
ORDER BY created_at DESC;

-- 5. VERIFICA MESSAGGI ESISTENTI
SELECT 
  id,
  sender_id,
  receiver_id,
  content,
  created_at,
  read_at
FROM messages 
ORDER BY created_at DESC;

-- 6. VERIFICA MESSAGGI NON LETTI DEGLI ULTIMI 2 GIORNI
SELECT 
  m.id,
  m.content,
  m.created_at,
  m.sender_id,
  m.receiver_id,
  m.read_at,
  s.nickname as sender_nickname,
  r.nickname as receiver_nickname,
  r.email as receiver_email,
  r.notify_on_message
FROM messages m
JOIN profiles s ON m.sender_id = s.id
JOIN profiles r ON m.receiver_id = r.id
WHERE m.read_at IS NULL
AND m.created_at >= NOW() - INTERVAL '2 days'
ORDER BY m.created_at DESC;

-- 7. VERIFICA RELAZIONI FOREIGN KEY
SELECT 
  tc.table_name, 
  kcu.column_name, 
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name 
FROM 
  information_schema.table_constraints AS tc 
  JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
  JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_name IN ('messages', 'profiles');

-- 8. VERIFICA INDICI
SELECT 
  indexname,
  tablename,
  indexdef
FROM pg_indexes 
WHERE tablename IN ('messages', 'profiles')
ORDER BY tablename, indexname;

-- 9. VERIFICA STATISTICHE TABELLE
SELECT 
  schemaname,
  relname as tablename,
  n_tup_ins as inserimenti,
  n_tup_del as eliminazioni,
  n_live_tup as record_attuali,
  n_dead_tup as record_morti
FROM pg_stat_user_tables 
WHERE relname IN ('profiles', 'messages')
ORDER BY relname;
