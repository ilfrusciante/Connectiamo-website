-- Crea la tabella per i token di reset password
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crea indice per email e token per performance
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_email ON password_reset_tokens(email);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires ON password_reset_tokens(expires_at);

-- Concedi permessi alla tabella
GRANT ALL ON password_reset_tokens TO anon;
GRANT ALL ON password_reset_tokens TO authenticated;

-- Abilita RLS (Row Level Security)
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Crea policy per permettere inserimento e lettura dei token
CREATE POLICY "Allow insert password reset tokens" ON password_reset_tokens
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow select password reset tokens" ON password_reset_tokens
  FOR SELECT USING (true);

CREATE POLICY "Allow delete password reset tokens" ON password_reset_tokens
  FOR DELETE USING (true);

-- Verifica che la tabella sia stata creata
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'password_reset_tokens'
ORDER BY ordinal_position;
