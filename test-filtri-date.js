const fetch = require('node-fetch');

// Test diverse condizioni di filtro per le date
async function testFiltriDate() {
  console.log('🔍 Test Filtri Date per Identificare il Problema');
  console.log('================================================\n');
  
  const productionUrl = 'https://connectiamo-website.vercel.app';
  const cronSecret = 'connectiamo_cron_secret_2024';
  
  try {
    console.log('📊 Test 1: Query senza filtri temporali...');
    
    // Test 1: Solo messaggi non letti (senza filtri temporali)
    const response1 = await fetch(`${productionUrl}/api/cron-check-messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cronSecret}`,
        'Content-Type': 'application/json',
        'X-Test-Mode': 'no-time-filter'
      }
    });
    
    if (response1.ok) {
      const data1 = await response1.json();
      console.log('✅ Test 1 - Senza filtri temporali:');
      console.log('   Total Unread Messages:', data1.totalUnreadMessages);
      console.log('   Message:', data1.message);
    }
    
    console.log('\n📊 Test 2: Query con margine 3 giorni...');
    
    // Test 2: Query con margine 3 giorni (quella attuale)
    const response2 = await fetch(`${productionUrl}/api/cron-check-messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cronSecret}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response2.ok) {
      const data2 = await response2.json();
      console.log('✅ Test 2 - Con margine 3 giorni:');
      console.log('   Total Unread Messages:', data2.totalUnreadMessages);
      console.log('   Message:', data2.message);
    }
    
    console.log('\n📊 Test 3: Query con margine 7 giorni...');
    
    // Test 3: Query con margine 7 giorni per vedere se trova messaggi
    const response3 = await fetch(`${productionUrl}/api/cron-check-messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cronSecret}`,
        'Content-Type': 'application/json',
        'X-Test-Mode': '7-days'
      }
    });
    
    if (response3.ok) {
      const data3 = await response3.json();
      console.log('✅ Test 3 - Con margine 7 giorni:');
      console.log('   Total Unread Messages:', data3.totalUnreadMessages);
      console.log('   Message:', data3.message);
    }
    
    console.log('\n🔍 Analisi del Problema:');
    console.log('   - Se Test 1 trova messaggi: problema nei filtri temporali');
    console.log('   - Se Test 3 trova messaggi: problema nel margine troppo piccolo');
    console.log('   - Se tutti 0: problema nel codice o nel database');
    
  } catch (error) {
    console.error('\n💥 Errore durante il test:', error.message);
  }
}

async function runTest() {
  await testFiltriDate();
  
  console.log('\n🎯 Prossimi Passi:');
  console.log('1. ✅ Se Test 1 trova messaggi: problema nei filtri temporali');
  console.log('2. ✅ Se Test 3 trova messaggi: problema nel margine troppo piccolo');
  console.log('3. ✅ Se tutti 0: problema nel codice o nel database');
  console.log('4. ✅ Controlla se i timestamp nel database sono corretti');
}

runTest();
