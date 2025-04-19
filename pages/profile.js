import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../utils/supabaseClient'

export default function Profile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    nickname: '',
    ruolo: '',
    città: '',
    zona: '',
    categoria: ''
  })

  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        setUser(user)
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Qui si potrebbe salvare il profilo nel DB Supabase
    console.log('Profilo aggiornato:', formData)
  }

  if (loading) return <p className="text-center mt-10">Caricamento...</p>

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <form onSubmit={handleSubmit} className="bg-gray-100 dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Profilo utente</h2>
        {['nickname', 'ruolo', 'città', 'zona', 'categoria'].map((field) => (
          <input
            key={field}
            type="text"
            name={field}
            placeholder={field}
            value={formData[field]}
            onChange={handleChange}
            required
            className="w-full p-2 mb-4 rounded border dark:bg-gray-700 dark:border-gray-600"
          />
        ))}
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
          Salva
        </button>
      </form>
    </div>
  )
}
