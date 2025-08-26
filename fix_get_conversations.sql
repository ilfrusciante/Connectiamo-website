-- Funzione per ottenere le conversazioni di un utente
-- Questa funzione sostituisce o ricrea la funzione get_conversations problematica

-- Prima droppo la funzione esistente se presente
DROP FUNCTION IF EXISTS get_conversations(uuid);

-- Creo la funzione get_conversations
CREATE OR REPLACE FUNCTION get_conversations(current_user_id uuid)
RETURNS TABLE (
  id uuid,
  nickname text,
  avatar_url text,
  last_message text,
  unread_count bigint,
  last_message_time timestamptz
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT
    p.id,
    p.nickname,
    p.avatar_url,
    last_msg.content as last_message,
    COALESCE(unread.count, 0) as unread_count,
    last_msg.created_at as last_message_time
  FROM profiles p
  INNER JOIN (
    SELECT 
      CASE 
        WHEN sender_id = current_user_id THEN receiver_id
        ELSE sender_id
      END as other_user_id,
      content,
      created_at,
      ROW_NUMBER() OVER (
        PARTITION BY 
          CASE 
            WHEN sender_id = current_user_id THEN receiver_id
            ELSE sender_id
          END
        ORDER BY created_at DESC
      ) as rn
    FROM messages 
    WHERE sender_id = current_user_id OR receiver_id = current_user_id
  ) last_msg ON p.id = last_msg.other_user_id AND last_msg.rn = 1
  LEFT JOIN (
    SELECT 
      CASE 
        WHEN sender_id = current_user_id THEN receiver_id
        ELSE sender_id
      END as other_user_id,
      COUNT(*) as count
    FROM messages 
    WHERE receiver_id = current_user_id 
      AND sender_id != current_user_id
      AND read_at IS NULL
    GROUP BY 
      CASE 
        WHEN sender_id = current_user_id THEN receiver_id
        ELSE sender_id
      END
  ) unread ON p.id = unread.other_user_id
  WHERE p.id != current_user_id
  ORDER BY last_msg.created_at DESC;
END;
$$;

-- Concedo i permessi di esecuzione alla funzione
GRANT EXECUTE ON FUNCTION get_conversations(uuid) TO anon;
GRANT EXECUTE ON FUNCTION get_conversations(uuid) TO authenticated;

-- Verifico che la funzione sia stata creata correttamente
SELECT 
  proname as function_name,
  proargtypes::regtype[] as argument_types,
  prorettype::regtype as return_type
FROM pg_proc 
WHERE proname = 'get_conversations';
