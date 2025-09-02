const fetch = require('node-fetch');

// Test invio email con indirizzo reale
async function testEmailReale() {
  console.log('📧 Test Invio Email con Indirizzo Reale');
  console.log('=======================================\n');
  
  const productionUrl = 'https://connectiamo-website.vercel.app';
  const testEmail = 'artisgrafica@gmail.com';
  
  try {
    console.log('🔍 Test endpoint invio email...');
    console.log('📬 Email di destinazione:', testEmail);
    console.log('🌐 URL:', `${productionUrl}/api/send-email`);
    
    const response = await fetch(`${productionUrl}/api/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: testEmail,
        subject: '🧪 Test Email Connectiamo - Configurazione SMTP',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1e40af;">🧪 Test Email Connectiamo</h2>
            <p>Questa è una email di test per verificare la configurazione SMTP.</p>
            <p><strong>Timestamp:</strong> ${new Date().toLocaleString('it-IT')}</p>
            <p><strong>Status:</strong> Test configurazione email</p>
            <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #6b7280; font-size: 12px;">
              Se ricevi questa email, la configurazione SMTP funziona correttamente!
            </p>
          </div>
        `
      })
    });
    
    console.log('\n📊 Risposta API:');
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    if (response.ok) {
      const responseText = await response.text();
      console.log('✅ Successo! Email inviata correttamente');
      console.log('Risposta:', responseText);
      console.log('\n📬 Controlla la tua email (anche nella cartella spam)');
    } else {
      const errorText = await response.text();
      console.log('❌ Errore nell\'invio email');
      console.log('Risposta errore:', errorText);
      
      // Analisi dell'errore
      try {
        const errorData = JSON.parse(errorText);
        console.log('\n🔍 Analisi Errore:');
        console.log('Codice:', errorData.code);
        console.log('Dettagli:', errorData.details);
        
        if (errorData.code === 'EENVELOPE') {
          console.log('\n💡 Possibili cause:');
          console.log('   - Problemi con le credenziali SMTP');
          console.log('   - Provider SMTP ha bloccato l\'invio');
          console.log('   - Configurazione SMTP errata');
        }
      } catch (e) {
        console.log('Impossibile parsare la risposta di errore');
      }
    }
    
  } catch (error) {
    console.error('\n💥 Errore durante il test:', error.message);
    
    if (error.code === 'ENOTFOUND') {
      console.log('💡 Verifica che l\'URL sia corretto');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('💡 Verifica che l\'app sia online');
    }
  }
}

// Test anche il cron job per vedere se processa correttamente
async function testCronJob() {
  console.log('\n🔍 Test Cron Job con Email Reale...');
  
  const productionUrl = 'https://connectiamo-website.vercel.app';
  const cronSecret = 'connectiamo_cron_secret_2024';
  
  try {
    const response = await fetch(`${productionUrl}/api/cron-check-messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cronSecret}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Cron job funziona');
      console.log('Messaggi non letti:', data.totalUnreadMessages);
      console.log('Destinatari processati:', data.message);
    } else {
      console.log('❌ Cron job ha problemi');
    }
    
  } catch (error) {
    console.log('Errore cron job:', error.message);
  }
}

async function runTests() {
  await testEmailReale();
  await testCronJob();
  
  console.log('\n🎯 Prossimi Passi:');
  console.log('1. ✅ Se l\'email arriva: SMTP funziona, problema nel cron job');
  console.log('2. ✅ Se l\'email NON arriva: Problema configurazione SMTP');
  console.log('3. ✅ Controlla variabili d\'ambiente SMTP in Vercel');
  console.log('4. ✅ Verifica log di Vercel per errori dettagliati');
}

runTests();

