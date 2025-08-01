import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../utils/supabaseClient'
import AvatarUpload from '../components/AvatarUpload'
import Footer from '../components/Footer'

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
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        setUser(user)
        // Carica dati profilo
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        if (profile) {
          setFormData({
            nickname: profile.nickname || '',
            ruolo: profile.ruolo || '',
            città: profile.città || '',
            zona: profile.zona || '',
            categoria: profile.categoria || ''
          })
          setAvatarUrl(profile.avatar_url || null)
          setAvatarPreview(profile.avatar_url || null)
        }
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleAvatarUpload = (file) => {
    setAvatarFile(file)
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setAvatarPreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')
    let newAvatarUrl = avatarUrl
    if (avatarFile && user) {
      const fileExt = avatarFile.name.split('.').pop()
      const filePath = `${user.id}.${fileExt}`
      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, avatarFile, { upsert: true })
      if (uploadError) {
        setError('Errore durante il caricamento dell\'immagine profilo: ' + uploadError.message)
        setSaving(false)
        return
      }
      const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath)
      newAvatarUrl = publicUrlData.publicUrl
      setAvatarUrl(newAvatarUrl)
    }
    // Aggiorna profilo
    const { error: updateError } = await supabase.from('profiles').update({
      ...formData,
      avatar_url: newAvatarUrl
    }).eq('id', user.id)
    if (updateError) {
      setError('Errore durante il salvataggio del profilo: ' + updateError.message)
    } else {
      setSuccess('Profilo aggiornato con successo!')
    }
    setSaving(false)
  }

  if (loading) return <p className="text-center mt-10">Caricamento...</p>

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <form onSubmit={handleSubmit} className="bg-gray-100 dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Profilo utente</h2>
        <div className="flex justify-center mb-6">
          <AvatarUpload onUpload={handleAvatarUpload} previewUrl={avatarPreview} />
        </div>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-2">{success}</p>}
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
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded" disabled={saving}>
          {saving ? 'Salvataggio...' : 'Salva'}
        </button>
      </form>
      </div>
      <Footer />
    </>
  )
}
