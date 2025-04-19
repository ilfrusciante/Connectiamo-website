// pages/index.js
import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import SearchBar from '../components/SearchBar';
import ContactModal from '../components/ContactModal';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white min-h-screen">
      <Navbar />

      <main className="px-4 md:px-16 py-8">
        <Hero />

        <section className="my-10">
          <SearchBar />
        </section>

        <section className="my-10 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Chi siamo</h2>
          <p>
            Connectiamo è una piattaforma che crea connessioni tra segnalatori e professionisti. Aiutiamo figure
            come guide turistiche, portieri o receptionist a trovare pittori, ristoratori, parrucchieri e altri
            professionisti per referral e collaborazioni.
          </p>
        </section>

        <section className="my-10 bg-gray-100 dark:bg-gray-800 p-6 rounded-lg max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-center">Come funziona</h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <img src="/images/register.svg" alt="Registrati" className="mx-auto h-16" />
              <h3 className="font-bold mt-2">1. Registrati</h3>
              <p>Crea un profilo come segnalatore o professionista.</p>
            </div>
            <div>
              <img src="/images/search.svg" alt="Trova contatti" className="mx-auto h-16" />
              <h3 className="font-bold mt-2">2. Trova contatti</h3>
              <p>Usa la ricerca per trovare persone nella tua zona e categoria.</p>
            </div>
            <div>
              <img src="/images/connect.svg" alt="Connettiti" className="mx-auto h-16" />
              <h3 className="font-bold mt-2">3. Connettiti</h3>
              <p>Metti in contatto tramite messaggistica privata.</p>
            </div>
          </div>
        </section>

        <section className="my-10 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Contattaci</h2>
          <ContactModal />
        </section>
      </main>

      <Footer />
    </div>
  );
}
