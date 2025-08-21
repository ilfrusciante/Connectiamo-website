// pages/_app.js
import Head from 'next/head';
import '../styles/globals.css';
import Navbar from '../components/Navbar';
import CookieBanner from '../components/CookieBanner';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* Meta tags base */}
        <title>Connectiamo - Connetti professionisti e opportunità</title>
        <meta name="description" content="Connectiamo è la piattaforma che unisce professionisti e connector per creare opportunità di crescita e collaborazione." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        
        {/* Favicon e icone */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon1.png" />
        <link rel="icon" type="image/svg+xml" href="/icon0.svg" />
        
        {/* Apple Touch Icon */}
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        
        {/* Web App Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Meta tags per social media */}
        <meta property="og:title" content="Connectiamo - Connetti professionisti e opportunità" />
        <meta property="og:description" content="Connectiamo è la piattaforma che unisce professionisti e connector per creare opportunità di crescita e collaborazione." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://connectiamo.com" />
        <meta property="og:image" content="/web-app-manifest-512x512.png" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Connectiamo - Connetti professionisti e opportunità" />
        <meta name="twitter:description" content="Connectiamo è la piattaforma che unisce professionisti e connector per creare opportunità di crescita e collaborazione." />
        <meta name="twitter:image" content="/web-app-manifest-512x512.png" />
        
        {/* Meta tags per SEO */}
        <meta name="keywords" content="connectiamo, professionisti, connector, networking, collaborazione, opportunità, servizi, business" />
        <meta name="author" content="Connectiamo" />
        <meta name="robots" content="index, follow" />
        
        {/* Preconnect per performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>
      
      <Navbar />
      <Component {...pageProps} />
      <CookieBanner />
    </>
  );
}
