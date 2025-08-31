const fetch = require('node-fetch');

// Test con log di debug per capire se il codice viene eseguito
async function testCronDebug() {
  console.log('🔍 Test Debug del Cron Job');
  console.log('===========================\n');
  
  const productionUrl = 'https://connectiamo-website.vercel.app';
  const cronSecret = 'connectiamo_cron_secret_2024';
  
  try {
    console.log('📧 Test endpoint cron job con timeout lungo...');
    
    // Test con timeout più lungo per vedere se il codice viene eseguito
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 secondi
    
    const response = await fetch(`${productionUrl}/api/cron-check-messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cronSecret}`,
        'Content-Type': 'application/json'
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('\n📊 Risposta Completa:');
      console.log('Success:', data.success);
      console.log('Message:', data.message);
      console.log('Total Unread Messages:', data.totalUnreadMessages);
      console.log('Notifications:', data.notifications?.length || 0);
      
      if (data.notifications && data.notifications.length > 0) {
        console.log('\n📬 Dettagli Notifiche:');
        data.notifications.forEach((notification, index) => {
          console.log(`${index + 1}. Email: ${notification.email}`);
          console.log(`   Messaggi: ${notification.messageCount}`);
          console.log(`   Successo: ${notification.success ? '✅' : '❌'}`);
        });
      }
    } else {
      const errorText = await response.text();
      console.log('❌ Errore API:', errorText);
    }
    
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('⏰ Timeout: L\'endpoint non ha risposto entro 30 secondi');
      console.log('💡 Questo indica che il codice potrebbe essere bloccato o in loop infinito');
    } else {
      console.error('\n💥 Errore durante il test:', error.message);
    }
  }
}

async function runDebugTest() {
  await testCronDebug();
  
  console.log('\n🎯 Analisi del Problema:');
  console.log('1. ✅ Se vedi la risposta: il codice viene eseguito ma trova 0 messaggi');
  console.log('2. ✅ Se vedi timeout: il codice è bloccato o in loop infinito');
  console.log('3. ✅ Se vedi errori: problema specifico identificato');
  console.log('\n💡 Prossimi passi:');
  console.log('   - Controlla i log di Vercel per timeout o errori');
  console.log('   - Verifica se ci sono problemi di memoria o performance');
  console.log('   - Controlla se il database è raggiungibile');
}

runDebugTest();
