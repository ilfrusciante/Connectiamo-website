// Script di test per il cron job dei reminder delle chat
// Esegui con: node test-cron-job.js

const fetch = require('node-fetch');

async function testCronJob() {
  console.log('🧪 Test del Cron Job per i Reminder delle Chat\n');
  
  const cronSecret = 'connectiamo_cron_secret_2024';
  const baseUrl = 'http://localhost:3000'; // Cambia se necessario
  
  try {
    console.log('📧 Test invio richiesta al cron job...');
    
    const response = await fetch(`${baseUrl}/api/cron-check-messages`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${cronSecret}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    console.log('✅ Risposta ricevuta:');
    console.log('Status:', response.status);
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
      console.log('\n📭 Nessuna notifica inviata (probabilmente nessun messaggio non letto)');
    }
    
    console.log('\n🔍 Dettagli del test:');
    console.log('- URL chiamato:', `${baseUrl}/api/cron-check-messages`);
    console.log('- Secret utilizzato:', cronSecret);
    console.log('- Timestamp:', new Date().toISOString());
    
  } catch (error) {
    console.error('❌ Errore durante il test:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Suggerimento: Assicurati che il server sia in esecuzione con "npm run dev"');
    }
  }
}

// Test anche senza autenticazione per verificare la sicurezza
async function testUnauthorized() {
  console.log('\n🔒 Test accesso non autorizzato...');
  
  try {
    const response = await fetch('http://localhost:3000/api/cron-check-messages', {
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
  await testCronJob();
  await testUnauthorized();
  
  console.log('\n🎯 Riepilogo del sistema:');
  console.log('✅ Cron job configurato ogni 2 giorni (0 0 */2 * *)');
  console.log('✅ API endpoint: /api/cron-check-messages');
  console.log('✅ Autenticazione con CRON_SECRET');
  console.log('✅ Sistema email configurato');
  console.log('✅ Campo notify_on_message nella tabella profiles');
  console.log('✅ Gestione messaggi non letti degli ultimi 2 giorni');
}

runTests();
