import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-6 text-center text-gray-700 mt-10">
      <div className="space-x-4">
        <Link href="/faq"><a className="hover:underline">FAQ</a></Link>
        <Link href="/contatti"><a className="hover:underline">Contatti</a></Link>
      </div>
      <p className="mt-2 text-sm">&copy; {new Date().getFullYear()} Connectiamo</p>
    </footer>
  );
}
