const fetch = require('node-fetch');

// Test manuale dettagliato del cron job
async function testCronManuale() {
  console.log('🔍 Test Manuale Dettagliato del Cron Job');
  console.log('========================================\n');
  
  const productionUrl = 'https://connectiamo-website.vercel.app';
  const cronSecret = 'connectiamo_cron_secret_2024';
  
  try {
    console.log('📧 Test endpoint cron job con metodo POST...');
    
    const response = await fetch(`${productionUrl}/api/cron-check-messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cronSecret}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    if (response.ok) {
      const data = await response.json();
      console.log('\n📊 Risposta Completa:');
      console.log('Success:', data.success);
      console.log('Message:', data.message);
      console.log('Total Unread Messages:', data.totalUnreadMessages);
      
      if (data.notifications && data.notifications.length > 0) {
        console.log('\n📬 Notifiche Processate:');
        data.notifications.forEach((notification, index) => {
          console.log(`${index + 1}. Email: ${notification.email}`);
          console.log(`   Messaggi: ${notification.messageCount}`);
          console.log(`   Successo: ${notification.success ? '✅' : '❌'}`);
          if (!notification.success && notification.error) {
            console.log(`   Errore: ${notification.error}`);
          }
        });
      } else {
        console.log('\n📭 Nessuna notifica processata');
      }
      
      // Test aggiuntivo: verifica se ci sono messaggi non letti
      console.log('\n🔍 Verifica Database...');
      await testDatabaseDirectly();
      
    } else {
      const errorText = await response.text();
      console.log('❌ Errore API:', errorText);
    }
    
  } catch (error) {
    console.error('\n💥 Errore durante il test:', error.message);
  }
}

async function testDatabaseDirectly() {
  console.log('💡 Possibili cause per 0 messaggi:');
  console.log('   1. Deploy non ancora attivo (cache Vercel)');
  console.log('   2. Variabili d\'ambiente non aggiornate');
  console.log('   3. Problemi con i timestamp o timezone');
  console.log('   4. Altro bug nel codice');
  console.log('\n🎯 Prossimi passi:');
  console.log('   1. ✅ Verifica che il deploy sia attivo in Vercel');
  console.log('   2. ✅ Controlla i log di Vercel per errori');
  console.log('   3. ✅ Verifica variabili d\'ambiente');
  console.log('   4. ✅ Aspetta qualche minuto per la cache');
}

async function runTest() {
  await testCronManuale();
  
  console.log('\n⏰ Se il deploy è appena completato:');
  console.log('   - Aspetta 2-3 minuti per la cache di Vercel');
  console.log('   - Controlla i log di Vercel per errori');
  console.log('   - Verifica che le variabili d\'ambiente siano aggiornate');
}

runTest();

