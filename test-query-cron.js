const fetch = require('node-fetch');

// Test diretto della query SQL del cron job
async function testQueryCron() {
  console.log('🔍 Test Diretto della Query SQL del Cron Job');
  console.log('============================================\n');
  
  const productionUrl = 'https://connectiamo-website.vercel.app';
  const cronSecret = 'connectiamo_cron_secret_2024';
  
  try {
    console.log('📊 Test 1: Query base senza filtri...');
    
    // Test 1: Solo messaggi non letti (senza filtri temporali)
    const response1 = await fetch(`${productionUrl}/api/cron-check-messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cronSecret}`,
        'Content-Type': 'application/json',
        'X-Test-Mode': 'basic' // Per testare senza filtri temporali
      }
    });
    
    if (response1.ok) {
      const data1 = await response1.json();
      console.log('✅ Test 1 - Messaggi non letti (senza filtri):');
      console.log('   Total Unread Messages:', data1.totalUnreadMessages);
      console.log('   Message:', data1.message);
    }
    
    console.log('\n📊 Test 2: Query con filtri completi...');
    
    // Test 2: Query completa del cron job
    const response2 = await fetch(`${productionUrl}/api/cron-check-messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cronSecret}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response2.ok) {
      const data2 = await response2.json();
      console.log('✅ Test 2 - Query completa del cron job:');
      console.log('   Total Unread Messages:', data2.totalUnreadMessages);
      console.log('   Message:', data2.message);
      console.log('   Notifications:', data2.notifications?.length || 0);
    }
    
    console.log('\n🔍 Analisi del Problema:');
    console.log('   - Se Test 1 trova messaggi ma Test 2 no: problema filtri temporali');
    console.log('   - Se entrambi trovano 0: problema join o dati');
    console.log('   - Se Test 2 ha errori: problema nel codice corretto');
    
  } catch (error) {
    console.error('\n💥 Errore durante il test:', error.message);
  }
}

// Test aggiuntivo: verifica se il problema è nel timezone
async function testTimezone() {
  console.log('\n⏰ Test Timezone e Intervalli...');
  console.log('💡 Possibili problemi:');
  console.log('   1. Timezone del server diverso da quello locale');
  console.log('   2. Intervallo "2 days" calcolato in modo diverso');
  console.log('   3. Problemi con i timestamp nel database');
  console.log('   4. Join tra tabelle non funzionante');
}

async function runTests() {
  await testQueryCron();
  await testTimezone();
  
  console.log('\n🎯 Prossimi Passi:');
  console.log('1. ✅ Se Test 1 trova messaggi: problema filtri temporali');
  console.log('2. ✅ Se entrambi 0: problema join o dati');
  console.log('3. ✅ Controlla i log di Vercel per errori specifici');
  console.log('4. ✅ Verifica se i timestamp nel database sono corretti');
}

runTests();
