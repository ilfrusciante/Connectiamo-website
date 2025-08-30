-- Script per verificare i messaggi di test nel database
-- Esegui questo script su Supabase per diagnosticare il problema

-- 1. VERIFICA UTENTI E LORO PREFERENZE
SELECT 
  id,
  email,
  nickname,
  notify_on_message,
  created_at
FROM profiles 
ORDER BY created_at DESC;

-- 2. VERIFICA MESSAGGI TOTALI
SELECT 
  COUNT(*) as total_messages,
  COUNT(CASE WHEN read_at IS NULL THEN 1 END) as unread_messages,
  COUNT(CASE WHEN read_at IS NOT NULL THEN 1 END) as read_messages
FROM messages;

-- 3. VERIFICA MESSAGGI NON LETTI DEGLI ULTIMI 2 GIORNI
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
  r.notify_on_message,
  CASE 
    WHEN m.read_at IS NULL AND m.created_at >= NOW() - INTERVAL '2 days' 
    THEN 'DOVREBBE generare reminder'
    ELSE 'NON dovrebbe generare reminder'
  END as reminder_status
FROM messages m
JOIN profiles s ON m.sender_id = s.id
JOIN profiles r ON m.receiver_id = r.id
WHERE m.read_at IS NULL
AND m.created_at >= NOW() - INTERVAL '2 days'
ORDER BY m.created_at DESC;

-- 4. VERIFICA MESSAGGI CHE DOVREBBERO GENERARE REMINDER
SELECT 
  COUNT(*) as messages_for_reminder
FROM messages m
JOIN profiles r ON m.receiver_id = r.id
WHERE m.read_at IS NULL
AND m.created_at >= NOW() - INTERVAL '2 days'
AND r.notify_on_message = true;

-- 5. VERIFICA TIMESTAMP E TIMEZONE
SELECT 
  NOW() as current_time,
  NOW() - INTERVAL '2 days' as two_days_ago,
  'UTC' as timezone_info;

-- 6. VERIFICA MESSAGGI DI TEST SPECIFICI
SELECT 
  id,
  content,
  created_at,
  read_at,
  CASE 
    WHEN content LIKE '%test%' OR content LIKE '%cron%' OR content LIKE '%reminder%'
    THEN 'MESSAGGIO DI TEST'
    ELSE 'MESSAGGIO NORMALE'
  END as message_type
FROM messages 
WHERE content LIKE '%test%' OR content LIKE '%cron%' OR content LIKE '%reminder%'
ORDER BY created_at DESC;

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

