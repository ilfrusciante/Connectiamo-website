import { useState } from 'react';

export default function ContactModal() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(false);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded shadow"
      >
        Contattaci
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 px-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-white text-xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">Contattaci</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Il tuo nome"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-600 dark:text-white"
              />
              <input
                type="email"
                name="email"
                placeholder="La tua email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-600 dark:text-white"
              />
              <textarea
                name="message"
                placeholder="Messaggio"
                value={form.message}
                onChange={handleChange}
                required
                rows="4"
                className="w-full p-2 border rounded dark:bg-gray-900 dark:border-gray-600 dark:text-white"
              ></textarea>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
              >
                Invia
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
