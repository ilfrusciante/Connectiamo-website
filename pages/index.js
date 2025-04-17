import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <div>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <h1>Benvenuto su Connectiamo</h1>
        <p>La piattaforma per connettere segnalatori e professionisti.</p>
      </div>
    </div>
  );
}
