import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../utils/supabaseClient';

const BadgeContext = createContext();

export function BadgeProvider({ children }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [userId, setUserId] = useState(null);

  // Funzione per aggiornare il badge (può essere richiamata da ovunque)
  const refreshBadge = useCallback(async () => {
    if (!userId) return;
    const { data: contacts, error } = await supabase.rpc('get_conversations', {
      current_user_id: userId,
    });
    if (!error && contacts) {
      const totalUnread = contacts.reduce((sum, c) => sum + (c.unread_count || 0), 0);
      setUnreadCount(totalUnread);
    }
  }, [userId]);

  // Recupera userId all'avvio
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id);
    });
  }, []);

  // Listener realtime per badge
  useEffect(() => {
    if (!userId) return;
    const badgeChannel = supabase
      .channel('badge-unread-messages-global')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${userId}`
      }, (payload) => {
        console.log('BadgeContext realtime event:', payload);
        refreshBadge();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(badgeChannel);
    };
  }, [userId, refreshBadge]);

  // Aggiorna badge all'avvio e quando cambia userId
  useEffect(() => {
    if (userId) refreshBadge();
  }, [userId, refreshBadge]);

  return (
    <BadgeContext.Provider value={{ unreadCount, refreshBadge }}>
      {children}
    </BadgeContext.Provider>
  );
}

export function useBadge() {
  return useContext(BadgeContext);
} 