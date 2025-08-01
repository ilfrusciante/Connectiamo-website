import { useState, useEffect } from 'react';

export function useCookieConsent() {
  const [consent, setConsent] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedConsent = localStorage.getItem('cookieConsent');
    setConsent(savedConsent);
    setIsLoaded(true);
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setConsent('accepted');
  };

  const rejectCookies = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    setConsent('rejected');
  };

  const clearConsent = () => {
    localStorage.removeItem('cookieConsent');
    setConsent(null);
  };

  return {
    consent,
    isLoaded,
    acceptCookies,
    rejectCookies,
    clearConsent,
    hasConsent: consent === 'accepted',
    hasRejected: consent === 'rejected',
    needsConsent: consent === null
  };
} 