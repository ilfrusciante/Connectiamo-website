-- Script per creare messaggi di test per il cron job
-- Esegui questo script su Supabase per testare i reminder

-- 1. ASSICURATI CHE CI SIANO ALMENO 2 UTENTI CON notify_on_message = true
-- Se non ci sono, aggiorna i profili esistenti:
UPDATE profiles 
SET notify_on_message = true 
WHERE notify_on_message IS NULL OR notify_on_message = false;

-- 2. VERIFICA UTENTI DISPONIBILI
SELECT 
  id,
  email,
  nickname,
  notify_on_message
FROM profiles 
WHERE notify_on_message = true
ORDER BY created_at DESC;

-- 3. CREA MESSAGGI DI TEST (sostituisci gli ID con quelli reali degli utenti)
-- Sostituisci 'USER_ID_1' e 'USER_ID_2' con gli ID reali degli utenti

-- Messaggio 1: non letto, recente (entro 2 giorni)
INSERT INTO messages (sender_id, receiver_id, content, created_at, read_at) 
VALUES (
  'USER_ID_1',  -- Sostituisci con ID utente reale
  'USER_ID_2',  -- Sostituisci con ID utente reale
  'Ciao! Questo è un messaggio di test per il cron job. Dovrebbe generare un reminder email.',
  NOW() - INTERVAL '1 day',
  NULL  -- NULL significa non letto
);

-- Messaggio 2: non letto, molto recente
INSERT INTO messages (sender_id, receiver_id, content, created_at, read_at) 
VALUES (
  'USER_ID_1',  -- Sostituisci con ID utente reale
  'USER_ID_2',  -- Sostituisci con ID utente reale
  'Secondo messaggio di test. Anche questo dovrebbe generare un reminder.',
  NOW() - INTERVAL '12 hours',
  NULL
);

-- Messaggio 3: non letto, vecchio (più di 2 giorni - NON dovrebbe generare reminder)
INSERT INTO messages (sender_id, receiver_id, content, created_at, read_at) 
VALUES (
  'USER_ID_1',  -- Sostituisci con ID utente reale
  'USER_ID_2',  -- Sostituisci con ID utente reale
  'Messaggio vecchio di più di 2 giorni. Non dovrebbe generare reminder.',
  NOW() - INTERVAL '3 days',
  NULL
);

-- Messaggio 4: già letto (non dovrebbe generare reminder)
INSERT INTO messages (sender_id, receiver_id, content, created_at, read_at) 
VALUES (
  'USER_ID_1',  -- Sostituisci con ID utente reale
  'USER_ID_2',  -- Sostituisci con ID utente reale
  'Messaggio già letto. Non dovrebbe generare reminder.',
  NOW() - INTERVAL '1 day',
  NOW()  -- Già letto
);

-- 4. VERIFICA I MESSAGGI CREATI
SELECT 
  id,
  sender_id,
  receiver_id,
  content,
  created_at,
  read_at,
  CASE 
    WHEN read_at IS NULL THEN 'Non letto'
    ELSE 'Letto'
  END as status,
  CASE 
    WHEN created_at >= NOW() - INTERVAL '2 days' THEN 'Recente (< 2 giorni)'
    ELSE 'Vecchio (> 2 giorni)'
  END as age
FROM messages 
ORDER BY created_at DESC;

-- 5. VERIFICA MESSAGGI CHE DOVREBBERO GENERARE REMINDER
SELECT 
  m.id,
  m.content,
  m.created_at,
  s.nickname as sender,
  r.nickname as receiver,
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
ORDER BY m.created_at DESC;

-- 6. PULIZIA (opzionale - rimuovi i messaggi di test)
-- DELETE FROM messages WHERE content LIKE '%test per il cron job%';
-- DELETE FROM messages WHERE content LIKE '%Messaggio di test%';
