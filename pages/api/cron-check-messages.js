import { supabase } from '../../utils/supabaseClient';
import { sendEmail } from '../../utils/emailService';

export default async function handler(req, res) {
  
  console.log('🚀 Cron job avviato:', new Date().toISOString());
  
  // Verifica che la richiesta sia autorizzata (cron job di Vercel)
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.error('Cron job non autorizzato');
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Test connessione Supabase
  console.log('🔍 Test connessione Supabase...');
  console.log('🔑 Credenziali Supabase:', {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Presente' : '❌ Mancante',
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Presente' : '❌ Mancante',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Presente' : '❌ Mancante'
  });
  
  try {
    const { data: testData, error: testError } = await supabase
      .from('messages')
      .select('count')
      .limit(1);
    
    console.log('📊 Test connessione Supabase:', {
      success: !testError,
      error: testError?.message || null,
      data: testData?.length || 0
    });
    
    // Test schema tabella
    console.log('🔍 Test schema tabella messages...');
    const { data: schemaData, error: schemaError } = await supabase
      .from('messages')
      .select('*')
      .limit(1);
    
    console.log('📊 Test schema tabella:', {
      success: !schemaError,
      error: schemaError?.message || null,
      columns: schemaData && schemaData.length > 0 ? Object.keys(schemaData[0]) : [],
      sample: schemaData && schemaData.length > 0 ? schemaData[0] : null
    });
    
    // Test conteggio totale
    console.log('🔍 Test conteggio totale messaggi...');
    const { count: totalCount, error: countError } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true });
    
    console.log('📊 Conteggio totale messaggi:', {
      count: totalCount,
      error: countError?.message || null
    });
    
    // Test bypass RLS
    console.log('🔍 Test bypass RLS...');
    const { data: bypassData, error: bypassError } = await supabase
      .from('messages')
      .select('*')
      .limit(1)
      .abortSignal(new AbortController().signal);
    
    console.log('📊 Test bypass RLS:', {
      success: !bypassError,
      error: bypassError?.message || null,
      data: bypassData?.length || 0
    });
    
  } catch (supabaseError) {
    console.error('💥 Errore connessione Supabase:', supabaseError.message);
    return res.status(500).json({ error: 'Errore connessione database' });
  }

  try {
    
    // 1. Trova tutti i messaggi non letti degli ultimi 2 giorni
    // Usa la stessa logica del database: NOW() - INTERVAL '2 days'
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
    // Aggiungi un margine di sicurezza per evitare problemi di timezone
    const twoDaysAgoWithMargin = new Date(twoDaysAgo.getTime() - (24 * 60 * 60 * 1000)); // 1 giorno in più di margine
    
    console.log('📅 Calcolo data 2 giorni fa:', twoDaysAgo.toISOString());
    console.log('📅 Data con margine (3 giorni fa):', twoDaysAgoWithMargin.toISOString());
    
    // Test filtri separatamente
    console.log('🔍 Test 1: Query senza filtri...');
    let { data: allMessages, error: allError } = await supabase
      .from('messages')
      .select('id, created_at, read_at')
      .limit(10);
    
    console.log('📊 Test 1 - Tutti i messaggi (max 10):', {
      count: allMessages?.length || 0,
      error: allError?.message || null,
      samples: allMessages?.slice(0, 3).map(m => ({
        id: m.id,
        created_at: m.created_at,
        read_at: m.read_at
      }))
    });
    
    console.log('🔍 Test 2: Query solo messaggi non letti...');
    let { data: unreadOnly, error: unreadError } = await supabase
      .from('messages')
      .select('id, created_at, read_at')
      .is('read_at', null)
      .limit(10);
    
    console.log('📊 Test 2 - Solo messaggi non letti:', {
      count: unreadOnly?.length || 0,
      error: unreadError?.message || null
    });
    
    console.log('🔍 Test 3: Query con filtro data...');
    let { data: recentMessages, error: recentError } = await supabase
      .from('messages')
      .select('id, created_at, read_at')
      .gte('created_at', twoDaysAgoWithMargin.toISOString())
      .limit(10);
    
    console.log('📊 Test 3 - Messaggi recenti (ultimi 3 giorni):', {
      count: recentMessages?.length || 0,
      error: recentError?.message || null,
      samples: recentMessages?.slice(0, 3).map(m => ({
        id: m.id,
        created_at: m.created_at,
        read_at: m.read_at
      }))
    });
    
    // Prima ottieni i messaggi non letti degli ultimi 2 giorni
    console.log('🔍 Query messaggi non letti...');
    let { data: unreadMessages, error: messagesError } = await supabase
      .from('messages')
      .select(`
        id,
        content,
        created_at,
        sender_id,
        receiver_id,
        read_at
      `)
      .is('read_at', null)
      .gte('created_at', twoDaysAgoWithMargin.toISOString()) // Usa il margine per essere sicuri
      .order('created_at', { ascending: false });
    
    console.log('📊 Risultati query messaggi:', {
      count: unreadMessages?.length || 0,
      error: messagesError?.message || null
    });

    if (messagesError) {
      console.error('Errore nel recupero messaggi:', messagesError);
      return res.status(500).json({ error: 'Errore nel recupero messaggi' });
    }

    // Poi ottieni i profili dei destinatari con notifiche abilitate
    if (unreadMessages && unreadMessages.length > 0) {
      const receiverIds = [...new Set(unreadMessages.map(m => m.receiver_id))];
      console.log('👥 ID destinatari trovati:', receiverIds);
      
      console.log('🔍 Query profili destinatari...');
      const { data: receiverProfiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, nickname, email, notify_on_message')
        .in('id', receiverIds)
        .eq('notify_on_message', true);

      if (profilesError) {
        console.error('Errore nel recupero profili:', profilesError);
        return res.status(500).json({ error: 'Errore nel recupero profili' });
      }

      console.log('📊 Profili destinatari trovati:', {
        count: receiverProfiles?.length || 0,
        profiles: receiverProfiles?.map(p => ({ id: p.id, email: p.email, notify: p.notify_on_message }))
      });

      // Filtra solo i messaggi per destinatari con notifiche abilitate
      const validReceiverIds = receiverProfiles.map(p => p.id);
      unreadMessages = unreadMessages.filter(m => validReceiverIds.includes(m.receiver_id));
      
      console.log('📬 Messaggi filtrati per destinatari validi:', unreadMessages.length);
    } else {
      console.log('📭 Nessun messaggio non letto trovato negli ultimi 2 giorni');
    }

    if (messagesError) {
      console.error('Errore nel recupero messaggi:', messagesError);
      return res.status(500).json({ error: 'Errore nel recupero messaggi' });
    }



    // 2. Raggruppa i messaggi per destinatario
    const messagesByReceiver = {};
    unreadMessages?.forEach(message => {
      if (!messagesByReceiver[message.receiver_id]) {
        messagesByReceiver[message.receiver_id] = [];
      }
      messagesByReceiver[message.receiver_id].push(message);
    });



    // 3. Per ogni destinatario, invia email di notifica
    const notificationResults = [];
    
    for (const [receiverId, messages] of Object.entries(messagesByReceiver)) {

      
      // Ottieni i dati del destinatario dai profili già filtrati
      const receiverProfile = receiverProfiles.find(p => p.id === receiverId);
      
      if (!receiverProfile) {
        console.error(`Profilo destinatario non trovato per ${receiverId}`);
        continue;
      }

      // Prepara il contenuto dell'email
      const senderNames = [...new Set(messages.map(m => 'Utente anonimo'))]; // Per ora usiamo nome generico
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
        
        await sendEmail(emailContent);

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



    console.log('✅ Cron job completato con successo');
    console.log('📊 Risultati finali:', {
      destinatariProcessati: Object.keys(messagesByReceiver).length,
      notificheInviate: notificationResults.length,
      messaggiTotali: unreadMessages?.length || 0
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