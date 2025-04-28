import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'
import MessageList from '../components/MessageList'
import { useRouter } from 'next/router'

export default function Messages() {
  const [user, setUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const router = useRouter()
  const { to } = router.query  // Prendiamo il destinatario dalla URL

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
  }, [router])

  useEffect(() => {
    if (!user || !to) return

    const fetchMessages = async () => {
      let { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${to}),and(sender_id.eq.${to},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true })

      if (!error) setMessages(data)
    }

    fetchMessages()
  }, [user, to])

  const handleSend = async () => {
    if (newMessage.trim() === '' || !to) return

    const { data, error } = await supabase
      .from('messages')
      .insert([{ sender_id: user.id, receiver_id: to, content: newMessage }])

    if (!error) {
      setMessages([...messages, ...data])
      setNewMessage('')
    }
  }

  if (!user) return <p className="text-center mt-10">Caricamento...</p>
  if (!to) return <p className="text-center mt-10 text-red-500">Nessun destinatario selezionato.</p>

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-6">
      <h1 className="text-2xl font-bold text-center mb-4">Chat privata</h1>
      <div className="max-w-3xl mx-auto bg-gray-50 dark:bg-gray-800 p-4 rounded shadow">
        <MessageList messages={messages} userId={user.id} />
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="Scrivi un messaggio..."
            className="flex-1 p-2 rounded bg-white dark:bg-gray-700 border dark:border-gray-600"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Invia
          </button>
        </div>
      </div>
    </div>
  )
}
