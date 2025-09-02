const fetch = require('node-fetch');

// Test dettagliato dell'invio email in produzione
async function testEmailProduction() {
  console.log('📧 Test Dettagliato Email in Produzione');
  console.log('=======================================\n');
  
  const productionUrl = 'https://connectiamo-website.vercel.app';
  const cronSecret = 'connectiamo_cron_secret_2024';
  
  try {
    console.log('🔍 Test 1: Verifica se ci sono messaggi non letti...');
    
    // Test con metodo POST per simulare meglio il cron job
    const response = await fetch(`${productionUrl}/api/cron-check-messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cronSecret}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('\n📊 Risposta API:');
      console.log('Success:', data.success);
      console.log('Message:', data.message);
      console.log('Total Unread Messages:', data.totalUnreadMessages);
      
      if (data.notifications && data.notifications.length > 0) {
        console.log('\n📬 Dettagli Notifiche:');
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
      
      // Test 2: Verifica se l'endpoint di invio email funziona
      console.log('\n🔍 Test 2: Verifica endpoint invio email...');
      await testEmailEndpoint();
      
    } else {
      const errorText = await response.text();
      console.log('❌ Errore API:', errorText);
    }
    
  } catch (error) {
    console.error('💥 Errore durante il test:', error.message);
  }
}

async function testEmailEndpoint() {
  const productionUrl = 'https://connectiamo-website.vercel.app';
  
  try {
    // Test dell'endpoint di invio email
    const response = await fetch(`${productionUrl}/api/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: 'test@example.com',
        subject: 'Test Email',
        html: '<p>Test email per verificare la configurazione SMTP</p>'
      })
    });
    
    console.log('Status endpoint email:', response.status);
    const responseText = await response.text();
    console.log('Risposta:', responseText);
    
  } catch (error) {
    console.log('Errore endpoint email:', error.message);
  }
}

// Test 3: Verifica configurazione SMTP
async function testSMTPConfig() {
  console.log('\n🔍 Test 3: Verifica configurazione SMTP...');
  console.log('💡 Controlla in Vercel:');
  console.log('   - Variabile SMTP_USER');
  console.log('   - Variabile SMTP_PASS');
  console.log('   - Se le credenziali sono corrette');
  console.log('   - Se il provider SMTP non ha bloccato l\'invio');
}

// Test 4: Verifica database
async function testDatabase() {
  console.log('\n🔍 Test 4: Verifica stato database...');
  console.log('💡 Controlla in Supabase:');
  console.log('   - Tabella messages: messaggi con read_at = NULL');
  console.log('   - Tabella profiles: utenti con notify_on_message = true');
  console.log('   - Se ci sono errori nei log di Supabase');
}

async function runFullDiagnosis() {
  await testEmailProduction();
  await testSMTPConfig();
  await testDatabase();
  
  console.log('\n🎯 Piano d\'Azione:');
  console.log('1. ✅ Controlla i log dettagliati di Vercel per errori SMTP');
  console.log('2. ✅ Verifica le variabili d\'ambiente SMTP in Vercel');
  console.log('3. ✅ Controlla se il provider SMTP ha bloccato l\'invio');
  console.log('4. ✅ Verifica i log di Supabase per errori database');
  console.log('5. ✅ Testa manualmente l\'endpoint /api/send-email');
}

runFullDiagnosis();

