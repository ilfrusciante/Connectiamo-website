// pages/_app.js
import '../styles/globals.css';
import Navbar from '../components/Navbar';
import CookieBanner from '../components/CookieBanner';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <Component {...pageProps} />
      <CookieBanner />
    </>
  );
}
