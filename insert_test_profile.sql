-- SCRIPT PER INSERIRE UN PROFILO DI TEST DOPO LA PULIZIA
-- Eseguire questo script DOPO aver eseguito clean_database.sql

-- 1. INSERISCO UN PROFILO DI TEST
INSERT INTO profiles (
  id,
  email,
  nome,
  cognome,
  nickname,
  role,
  city,
  cap,
  category,
  description,
  avatar_url,
  notify_on_message,
  is_admin,
  created_at
) VALUES (
  gen_random_uuid(), -- Genera un nuovo UUID
  'test@connectiamo.com',
  'Utente',
  'Test',
  'TestUser',
  'Professionista',
  'Roma',
  '00100',
  'Tecnologie',
  'Questo è un profilo di test per verificare il funzionamento del sistema.',
  '', -- avatar_url vuoto
  true, -- notify_on_message
  false, -- is_admin
  NOW() -- created_at
);

-- 2. VERIFICO L'INSERIMENTO
SELECT 
  id,
  email,
  nickname,
  role,
  city,
  category,
  created_at
FROM profiles 
WHERE email = 'test@connectiamo.com';

-- 3. VERIFICO CHE LA FUNZIONE get_conversations FUNZIONI
-- (dovrebbe restituire un array vuoto per ora, dato che non ci sono messaggi)
SELECT get_conversations((SELECT id FROM profiles WHERE email = 'test@connectiamo.com' LIMIT 1));

-- MESSAGGIO DI COMPLETAMENTO
SELECT 'Profilo di test inserito con successo!' as status;
