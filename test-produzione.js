// Script per testare l'API cron job in produzione
// Esegui con: node test-produzione.js

const fetch = require('node-fetch');

async function testProduzione() {
  console.log('🧪 Test API Cron Job in Produzione\n');
  
  // Sostituisci con l'URL reale della tua app in produzione
  const productionUrl = 'https://connectiamo-website.vercel.app'; // URL basato sul nome del progetto Vercel
  const cronSecret = 'connectiamo_cron_secret_2024';
  
  try {
    console.log('📧 Test invio richiesta al cron job in produzione...');
    console.log('URL:', `${productionUrl}/api/cron-check-messages`);
    
    const response = await fetch(`${productionUrl}/api/cron-check-messages`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${cronSecret}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Risposta ricevuta:');
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Success:', data.success);
      console.log('Message:', data.message);
      console.log('Total Unread Messages:', data.totalUnreadMessages);
      
      if (data.notifications && data.notifications.length > 0) {
        console.log('\n📬 Notifiche inviate:');
        data.notifications.forEach((notification, index) => {
          console.log(`${index + 1}. ${notification.email}: ${notification.messageCount} messaggi - ${notification.success ? '✅ Successo' : '❌ Fallito'}`);
          if (!notification.success && notification.error) {
            console.log(`   Errore: ${notification.error}`);
          }
        });
      } else {
        console.log('\n📭 Nessuna notifica inviata');
        console.log('💡 Possibili cause:');
        console.log('   - Nessun messaggio non letto negli ultimi 2 giorni');
        console.log('   - Utenti con notify_on_message = false');
        console.log('   - Problemi con il database');
      }
    } else {
      console.log('❌ Errore HTTP:', response.status);
      const errorText = await response.text();
      console.log('Risposta errore:', errorText);
    }
    
  } catch (error) {
    console.error('❌ Errore durante il test:', error.message);
    
    if (error.code === 'ENOTFOUND') {
      console.log('\n💡 Suggerimento: Verifica che l\'URL sia corretto');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Suggerimento: Verifica che l\'app sia online');
    }
  }
}

// Test anche senza autenticazione
async function testUnauthorized() {
  console.log('\n🔒 Test accesso non autorizzato in produzione...');
  
  const productionUrl = 'https://connectiamo-website.vercel.app'; // URL basato sul nome del progetto Vercel
  
  try {
    const response = await fetch(`${productionUrl}/api/cron-check-messages`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Status (dovrebbe essere 401):', response.status);
    const data = await response.json();
    console.log('Risposta:', data.error);
    
  } catch (error) {
    console.log('Errore:', error.message);
  }
}

// Esegui i test
async function runTests() {
  await testProduzione();
  await testUnauthorized();
  
  console.log('\n🎯 Prossimi passi per la diagnosi:');
  console.log('1. ✅ Controlla i log di Vercel');
  console.log('2. ✅ Verifica che l\'URL sia corretto');
  console.log('3. ✅ Controlla le variabili d\'ambiente in Vercel');
  console.log('4. ✅ Verifica la configurazione SMTP');
  console.log('5. ✅ Controlla i log del database Supabase');
}

runTests();

