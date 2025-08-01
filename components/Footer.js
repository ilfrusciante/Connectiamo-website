import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 py-6 text-center text-gray-300">
      <div className="space-x-4">
        <Link href="/faq" className="hover:underline">FAQ</Link>
        <Link href="/contatti" className="hover:underline">Contatti</Link>
        <Link href="/termini-e-condizioni" className="hover:underline">Termini e condizioni</Link>
        <Link href="/cookie-settings" className="hover:underline">Impostazioni Cookie</Link>
      </div>
      <p className="mt-2 text-sm">&copy; {new Date().getFullYear()} Connectiamo</p>
    </footer>
  );
}
