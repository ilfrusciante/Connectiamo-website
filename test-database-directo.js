const fetch = require('node-fetch');

// Test diretto della connessione al database
async function testDatabaseDirecto() {
  console.log('🔍 Test Diretto della Connessione Database');
  console.log('==========================================\n');
  
  const productionUrl = 'https://connectiamo-website.vercel.app';
  const cronSecret = 'connectiamo_cron_secret_2024';
  
  try {
    console.log('📊 Test 1: Connessione base al database...');
    
    // Test 1: Query semplice per verificare la connessione
    const response1 = await fetch(`${productionUrl}/api/cron-check-messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cronSecret}`,
        'Content-Type': 'application/json',
        'X-Test-Mode': 'database-connection'
      }
    });
    
    if (response1.ok) {
      const data1 = await response1.json();
      console.log('✅ Test 1 - Connessione database:');
      console.log('   Status:', response1.status);
      console.log('   Success:', data1.success);
      console.log('   Message:', data1.message);
    } else {
      console.log('❌ Test 1 - Errore connessione:', response1.status);
      const errorText = await response1.text();
      console.log('   Errore:', errorText);
    }
    
    console.log('\n📊 Test 2: Query messaggi base...');
    
    // Test 2: Query base per messaggi (senza filtri temporali)
    const response2 = await fetch(`${productionUrl}/api/cron-check-messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cronSecret}`,
        'Content-Type': 'application/json',
        'X-Test-Mode': 'basic-query'
      }
    });
    
    if (response2.ok) {
      const data2 = await response2.json();
      console.log('✅ Test 2 - Query base:');
      console.log('   Total Unread Messages:', data2.totalUnreadMessages);
      console.log('   Message:', data2.message);
    } else {
      console.log('❌ Test 2 - Errore query base:', response2.status);
    }
    
    console.log('\n🔍 Analisi del Problema:');
    console.log('   - Se entrambi 0: problema connessione database');
    console.log('   - Se Test 1 OK ma Test 2 0: problema query specifica');
    console.log('   - Se errori HTTP: problema endpoint o autenticazione');
    
  } catch (error) {
    console.error('\n💥 Errore durante il test:', error.message);
  }
}

async function runTest() {
  await testDatabaseDirecto();
  
  console.log('\n🎯 Prossimi Passi:');
  console.log('1. ✅ Se entrambi 0: problema connessione database');
  console.log('2. ✅ Se Test 1 OK ma Test 2 0: problema query specifica');
  console.log('3. ✅ Se errori HTTP: problema endpoint o autenticazione');
  console.log('4. ✅ Controlla se Supabase è raggiungibile');
  console.log('5. ✅ Verifica se ci sono problemi di RLS o permessi');
}

runTest();
