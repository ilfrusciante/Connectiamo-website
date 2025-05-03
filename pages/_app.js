// pages/_app.js
import { useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const updateLastSeen = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('profiles')
          .update({ last_seen: new Date().toISOString() })
          .eq('id', user.id);
      }
    };

    // aggiorna subito
    updateLastSeen();

    // aggiorna ogni 30 secondi
    const interval = setInterval(updateLastSeen, 30000);
    return () => clearInterval(interval);
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
