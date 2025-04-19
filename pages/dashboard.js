import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabaseClient'
import { useRouter } from 'next/router'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        setUser(user)
      }
    }

    fetchUser()
  }, [])

  if (!user) return <p className="text-center mt-10">Caricamento...</p>

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Benvenuto, {user.email}</h1>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Il tuo profilo</h2>
            <p>Gestisci le informazioni del tuo profilo.</p>
            <a href="/profile" className="inline-block mt-4 text-blue-500 underline">Vai al profilo</a>
          </div>
          <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">I tuoi messaggi</h2>
            <p>Visualizza e invia messaggi privati.</p>
            <a href="/messages" className="inline-block mt-4 text-blue-500 underline">Apri chat</a>
          </div>
        </div>
      </div>
    </div>
  )
}
