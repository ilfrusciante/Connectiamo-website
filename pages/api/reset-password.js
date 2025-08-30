import { createClient } from '@supabase/supabase-js';

// Crea un client Supabase con credenziali admin
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, token, newPassword } = req.body;

  // Validazione
  if (!email || !token || !newPassword) {
    return res.status(400).json({ error: 'Campi mancanti' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Password troppo corta' });
  }

  try {
    // Verifica se il token è valido
    const { data: tokenData, error: tokenError } = await supabaseAdmin
      .from('password_reset_tokens')
      .select('*')
      .eq('email', email)
      .eq('token', token)
      .gte('expires_at', new Date().toISOString())
      .single();

    if (tokenError || !tokenData) {
      return res.status(400).json({ error: 'Token non valido o scaduto' });
    }

    // Trova l'utente per ID
    const { data: userData, error: userError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (userError || !userData) {
      return res.status(404).json({ error: 'Utente non trovato' });
    }

    // Aggiorna la password usando le credenziali admin
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      userData.id,
      { password: newPassword }
    );

    if (updateError) {
      console.error('Errore aggiornamento password:', updateError);
      return res.status(500).json({ error: 'Errore nell\'aggiornamento della password' });
    }

    // Rimuovi il token usato
    await supabaseAdmin
      .from('password_reset_tokens')
      .delete()
      .eq('email', email)
      .eq('token', token);

    res.status(200).json({ 
      success: true, 
      message: 'Password aggiornata con successo' 
    });

  } catch (error) {
    console.error('Errore API reset password:', error);
    res.status(500).json({ 
      error: 'Errore interno del server' 
    });
  }
}
