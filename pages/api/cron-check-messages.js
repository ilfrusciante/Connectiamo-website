import { supabase } from '../../utils/supabaseClient';
import { sendEmail } from '../../utils/emailService';

export default async function handler(req, res) {
  console.log('Cron job avviato:', new Date().toISOString());
  
  // Verifica che la richiesta sia autorizzata (cron job di Vercel)
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.error('Cron job non autorizzato');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    console.log('Cron job autorizzato, inizio elaborazione...');
    
    // 1. Trova tutti i messaggi non letti degli ultimi 48 ore
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
    console.log('Cercando messaggi non letti dal:', twoDaysAgo.toISOString());
    
    const { data: unreadMessages, error: messagesError } = await supabase
      .from('messages')
      .select(`
        id,
        content,
        created_at,
        sender_id,
        receiver_id,
        read_at,
        profiles!messages_sender_id_fkey(nickname, email, notify_on_message)
      `)
      .is('read_at', null)
      .gte('created_at', twoDaysAgo.toISOString())
      .order('created_at', { ascending: false });

    if (messagesError) {
      console.error('Errore nel recupero messaggi:', messagesError);
      return res.status(500).json({ error: 'Errore nel recupero messaggi' });
    }

    console.log(`Trovati ${unreadMessages?.length || 0} messaggi non letti`);

    // 2. Raggruppa i messaggi per destinatario
    const messagesByReceiver = {};
    unreadMessages?.forEach(message => {
      if (!messagesByReceiver[message.receiver_id]) {
        messagesByReceiver[message.receiver_id] = [];
      }
      messagesByReceiver[message.receiver_id].push(message);
    });

    console.log(`Messaggi raggruppati per ${Object.keys(messagesByReceiver).length} destinatari`);

    // 3. Per ogni destinatario, invia email di notifica
    const notificationResults = [];
    
    for (const [receiverId, messages] of Object.entries(messagesByReceiver)) {
      console.log(`Elaborando destinatario ${receiverId} con ${messages.length} messaggi`);
      
      // Ottieni i dati del destinatario
      const { data: receiverProfile, error: profileError } = await supabase
        .from('profiles')
        .select('email, nickname, notify_on_message')
        .eq('id', receiverId)
        .single();

      if (profileError || !receiverProfile) {
        console.error(`Errore nel recupero profilo per ${receiverId}:`, profileError);
        continue;
      }

      console.log(`Profilo trovato: ${receiverProfile.email}, notify_on_message: ${receiverProfile.notify_on_message}`);

      // Verifica se l'utente vuole ricevere notifiche email
      if (!receiverProfile.notify_on_message) {
        console.log(`Utente ${receiverProfile.email} ha disabilitato le notifiche email`);
        continue;
      }

      // Prepara il contenuto dell'email
      const senderNames = [...new Set(messages.map(m => m.profiles?.nickname || 'Utente anonimo'))];
      const messageCount = messages.length;
      
      const emailContent = {
        to: receiverProfile.email,
        subject: `Hai ${messageCount} nuovo messaggio${messageCount > 1 ? 'i' : ''} su Connectiamo`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #0f1e3c; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 24px;">Connectiamo</h1>
            </div>
            <div style="background-color: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px;">
              <h2 style="color: #0f1e3c; margin-bottom: 20px;">Nuovi messaggi</h2>
              <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
                Ciao <strong>${receiverProfile.nickname || 'utente'}</strong>,
              </p>
              <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
                Hai ricevuto <strong>${messageCount} nuovo messaggio${messageCount > 1 ? 'i' : ''}</strong> da ${senderNames.length > 1 ? 'diversi utenti' : senderNames[0]}.
              </p>
              <p style="color: #333; line-height: 1.6; margin-bottom: 30px;">
                Accedi alla tua area personale per leggere i messaggi:
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}/messages" 
                   style="background-color: #0f1e3c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                  Vai ai messaggi
                </a>
              </div>
              <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
              <p style="color: #666; font-size: 14px; margin-top: 30px;">
                Questa email è stata inviata automaticamente. 
                Puoi disattivare le notifiche email nelle impostazioni del tuo profilo.
              </p>
              <p style="color: #999; font-size: 12px; text-align: center;">
                Connectiamo - La piattaforma per connettere professionisti<br>
                <strong>info@connectiamo.com</strong>
              </p>
            </div>
          </div>
        `,
        text: `Nuovi messaggi su Connectiamo

Ciao ${receiverProfile.nickname || 'utente'},

Hai ricevuto ${messageCount} nuovo messaggio${messageCount > 1 ? 'i' : ''} da ${senderNames.length > 1 ? 'diversi utenti' : senderNames[0]}.

Accedi alla tua area personale per leggere i messaggi:
${process.env.NEXT_PUBLIC_SITE_URL}/messages

Questa email è stata inviata automaticamente. 
Puoi disattivare le notifiche email nelle impostazioni del tuo profilo.

Connectiamo - La piattaforma per connettere professionisti
info@connectiamo.com`
      };

      // Invia l'email
      try {
        console.log(`Tentativo invio email a ${emailContent.to}...`);
        
        await sendEmail(emailContent);

        console.log(`Email inviata con successo a ${emailContent.to}`);

        notificationResults.push({
          receiverId,
          email: emailContent.to,
          messageCount,
          success: true
        });

      } catch (emailError) {
        console.error(`Errore nell'invio email a ${emailContent.to}:`, emailError);
        
        // Traduci gli errori SMTP in italiano
        let errorMessage = emailError.message;
        if (emailError.message.includes('Invalid login')) {
          errorMessage = 'Credenziali email non valide';
        } else if (emailError.message.includes('getaddrinfo ENOTFOUND')) {
          errorMessage = 'Server email non trovato';
        } else if (emailError.message.includes('EAUTH')) {
          errorMessage = 'Autenticazione email fallita';
        } else if (emailError.message.includes('ECONNECTION')) {
          errorMessage = 'Impossibile connettersi al server email';
        }
        
        notificationResults.push({
          receiverId,
          email: emailContent.to,
          messageCount,
          success: false,
          error: errorMessage
        });
      }
    }

    console.log('Cron job completato. Risultati:', {
      totalDestinatari: Object.keys(messagesByReceiver).length,
      emailInviate: notificationResults.filter(r => r.success).length,
      emailFallite: notificationResults.filter(r => !r.success).length,
      risultati: notificationResults
    });

    return res.status(200).json({
      success: true,
      message: `Processati ${Object.keys(messagesByReceiver).length} destinatari`,
      notifications: notificationResults,
      totalUnreadMessages: unreadMessages?.length || 0
    });

  } catch (error) {
    console.error('Errore generale nel cron job:', error);
    return res.status(500).json({ error: 'Errore interno del server' });
  }
} 