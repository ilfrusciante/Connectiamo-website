// Test per verificare l'invio email
// Esegui questo file per testare la connessione SMTP

import { sendEmail } from './utils/emailService.js';

async function testEmail() {
  try {
    console.log('🧪 Test invio email...');
    
    const testEmailContent = {
      to: 'test@example.com', // Cambia con la tua email per il test
      subject: 'Test Email Connectiamo',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #0f1e3c; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">Connectiamo</h1>
          </div>
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px;">
            <h2 style="color: #0f1e3c; margin-bottom: 20px;">Test Email</h2>
            <p style="color: #333; line-height: 1.6;">
              Questa è un'email di test per verificare che il sistema SMTP funzioni correttamente.
            </p>
            <p style="color: #333; line-height: 1.6;">
              Se ricevi questa email, significa che la configurazione SMTP è corretta!
            </p>
          </div>
        </div>
      `
    };

    const result = await sendEmail(testEmailContent);
    console.log('✅ Email inviata con successo!', result);
    
  } catch (error) {
    console.error('❌ Errore nell\'invio email:', error);
    console.error('Dettagli errore:', error.message);
  }
}

// Esegui il test
testEmail();
