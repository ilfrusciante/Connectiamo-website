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
  
  console.log('🌐 URL Supabase:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  
  // Test database e schema
  console.log('🔍 Test database e schema...');
  try {
    const { data: dbInfo, error: dbError } = await supabase
      .rpc('version');
    
    console.log('📊 Info database:', {
      success: !dbError,
      error: dbError?.message || null,
      version: dbInfo
    });
  } catch (dbError) {
    console.log('📊 Info database: Errore nel recupero versione');
  }
  
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
    
    // Usa la stessa logica del badge nella navbar - funzione RPC get_conversations
    console.log('🔍 Query usando get_conversations (stessa logica del badge)...');
    
    // Prima ottieni tutti gli utenti con profili
    const { data: allProfiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, nickname, email, notify_on_message')
      .eq('notify_on_message', true);
    
    if (profilesError) {
      console.error('Errore nel recupero profili:', profilesError);
      return res.status(500).json({ error: 'Errore nel recupero profili' });
    }
    
    console.log('📊 Profili con notifiche abilitate:', allProfiles?.length || 0);
    
    // Per ogni utente, usa get_conversations per ottenere i messaggi non letti
    const allUnreadMessages = [];
    const messagesByReceiver = {};
    
    for (const profile of allProfiles) {
      try {
        console.log(`🔍 Test get_conversations per utente: ${profile.nickname} (${profile.id})`);
        
        const { data: conversations, error: convError } = await supabase.rpc('get_conversations', {
          current_user_id: profile.id,
        });
        
        console.log(`📊 Risultato get_conversations per ${profile.nickname}:`, {
          success: !convError,
          error: convError?.message || null,
          conversationsCount: conversations?.length || 0,
          conversations: conversations?.slice(0, 3) || [] // Mostra prime 3 conversazioni
        });
        
        if (!convError && conversations) {
          // Filtra solo conversazioni con messaggi non letti degli ultimi 2 giorni
          const recentUnread = conversations.filter(conv => {
            if (!conv.unread_count || conv.unread_count === 0) return false;
            
            // Verifica se l'ultimo messaggio è degli ultimi 2 giorni
            if (conv.last_message_date) {
              const lastMessageDate = new Date(conv.last_message_date);
              const twoDaysAgo = new Date();
              twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
              return lastMessageDate >= twoDaysAgo;
            }
            return false;
          });
          
          console.log(`🔍 Filtro messaggi recenti per ${profile.nickname}:`, {
            totalConversations: conversations.length,
            withUnreadCount: conversations.filter(c => c.unread_count > 0).length,
            withRecentDate: conversations.filter(c => c.last_message_date).length,
            recentUnreadCount: recentUnread.length
          });
          
          if (recentUnread.length > 0) {
            console.log(`👤 Utente ${profile.nickname}: ${recentUnread.length} conversazioni con messaggi recenti non letti`);
            
            // Simula i messaggi non letti per questo utente
            const userUnreadMessages = recentUnread.map(conv => ({
              id: `simulated_${profile.id}_${conv.id}`,
              content: conv.last_message || 'Messaggio non letto',
              created_at: conv.last_message_date || new Date().toISOString(),
              sender_id: conv.other_user_id || 'unknown',
              receiver_id: profile.id,
              read_at: null
            }));
            
            allUnreadMessages.push(...userUnreadMessages);
            messagesByReceiver[profile.id] = userUnreadMessages;
          } else {
            console.log(`📭 Utente ${profile.nickname}: Nessuna conversazione con messaggi recenti non letti`);
          }
        }
      } catch (error) {
        console.error(`💥 Errore per utente ${profile.id}:`, error.message);
      }
    }
    
    console.log('📊 Messaggi non letti trovati tramite get_conversations:', allUnreadMessages.length);
    console.log('👥 Destinatari con messaggi non letti:', Object.keys(messagesByReceiver).length);
    
    // VERIFICA DIRETTA: Controlla se ci sono realmente messaggi non letti nella tabella
    console.log('🔍 VERIFICA DIRETTA: Query diretta alla tabella messages...');
    
    try {
      const { data: directUnread, error: directError } = await supabase
        .from('messages')
        .select('id, receiver_id, created_at, read_at')
        .is('read_at', null)
        .gte('created_at', twoDaysAgo.toISOString());
      
      console.log('📊 VERIFICA DIRETTA - Messaggi non letti ultimi 2 giorni:', {
        success: !directError,
        error: directError?.message || null,
        count: directUnread?.length || 0,
        samples: directUnread?.slice(0, 3).map(m => ({
          id: m.id,
          receiver_id: m.receiver_id,
          created_at: m.created_at,
          read_at: m.read_at
        }))
      });
      
      if (directUnread && directUnread.length > 0) {
        console.log('⚠️ DISCREPANZA: get_conversations dice 0, ma la tabella ha messaggi non letti!');
        console.log('🔍 Questo spiega perché il badge funziona ma il cron no!');
      }
    } catch (directError) {
      console.error('💥 Errore verifica diretta:', directError.message);
    }
    
    // Usa i messaggi simulati per il resto della logica
    const unreadMessages = allUnreadMessages;
    const receiverProfiles = allProfiles;



    // I messaggi sono già raggruppati per destinatario da get_conversations



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