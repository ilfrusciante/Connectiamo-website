import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-6 text-center text-gray-700 mt-10">
      <div className="space-x-4">
        <Link href="/faq" className="hover:underline">FAQ</Link>
        <Link href="/contatti" className="hover:underline">Contatti</Link>
      </div>
      <p className="mt-2 text-sm">&copy; {new Date().getFullYear()} Connectiamo</p>
    </footer>
  );
}
