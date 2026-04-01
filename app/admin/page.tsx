'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

const supabase = createClient()

const GENRES = ['Trap', 'Drill', 'R&B', 'Hip-Hop', 'Afrobeats', 'Boom Bap']

export default function AdminPage() {
  const [title, setTitle] = useState('')
  const [bpm, setBpm] = useState('')
  const [key, setKey] = useState('')
  const [genre, setGenre] = useState('')
  const [mood, setMood] = useState('')
  const [tags, setTags] = useState('')
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [previewFile, setPreviewFile] = useState<File | null>(null)
  const [beatFile, setBeatFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [hasVocals, setHasVocals] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    // ✅ getUser() validates with Supabase servers — not just local cookie
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) window.location.href = '/admin/login'
    })
  }, [])

  const slugify = (text: string) => {
    const base = text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    return `${base}-${Date.now()}`
  }

  const handleUpload = async () => {
    if (!title || !bpm || !key || !genre || !beatFile || !coverFile || !previewFile) {
      setMessage('Please fill in all fields and upload all files')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const createRes = await fetch('/api/admin/beats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug: slugify(title),
          bpm: parseInt(bpm),
          key,
          genre,
          mood: mood.split(',').map((m) => m.trim()).filter(Boolean),
          tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
          has_vocals: hasVocals,
        }),
      })

      const createData = await createRes.json()
      if (!createRes.ok) throw new Error(createData.error)

      const beatId = createData.beatId

      const coverExt = coverFile.name.split('.').pop()
      const { error: coverError } = await supabase.storage
        .from('previews')
        .upload(`${beatId}/cover.${coverExt}`, coverFile)
      if (coverError) throw coverError

      const { data: coverUrl } = supabase.storage
        .from('previews')
        .getPublicUrl(`${beatId}/cover.${coverExt}`)

      const { error: previewError } = await supabase.storage
        .from('previews')
        .upload(`${beatId}/preview.mp3`, previewFile)
      if (previewError) throw previewError

      const { data: previewUrl } = supabase.storage
        .from('previews')
        .getPublicUrl(`${beatId}/preview.mp3`)

      const { error: beatError } = await supabase.storage
        .from('beats')
        .upload(`${beatId}/mp3_lease.mp3`, beatFile)
      if (beatError) throw beatError

      const updateRes = await fetch('/api/admin/beats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          beatId,
          coverUrl: coverUrl.publicUrl,
          previewUrl: previewUrl.publicUrl,
        }),
      })

      const updateData = await updateRes.json()
      if (!updateRes.ok) throw new Error(updateData.error)

      setMessage(`✅ "${title}" uploaded successfully!`)
      setTitle('')
      setBpm('')
      setKey('')
      setGenre('')
      setMood('')
      setTags('')
      setCoverFile(null)
      setPreviewFile(null)
      setBeatFile(null)

    } catch (err: any) {
      setMessage(`❌ Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/admin/login'
  }

  return (
    <main className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-4xl text-accent">Upload Beat</h1>
          <button onClick={handleSignOut} className="text-sm text-muted hover:text-text">
            Sign out
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-muted mb-1">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-surface border border-border rounded px-3 py-2 text-sm text-text focus:outline-none focus:border-accent"
              placeholder="e.g. Midnight Flex"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-muted mb-1">BPM</label>
              <input
                type="number"
                value={bpm}
                onChange={(e) => setBpm(e.target.value)}
                className="w-full bg-surface border border-border rounded px-3 py-2 text-sm text-text focus:outline-none focus:border-accent"
                placeholder="140"
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Key</label>
              <input
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="w-full bg-surface border border-border rounded px-3 py-2 text-sm text-text focus:outline-none focus:border-accent"
                placeholder="F# Minor"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-muted mb-1">Genre</label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full bg-surface border border-border rounded px-3 py-2 text-sm text-text focus:outline-none focus:border-accent"
            >
              <option value="">Select genre</option>
              {GENRES.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-muted mb-1">
              Mood <span className="text-muted">(comma separated)</span>
            </label>
            <input
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="w-full bg-surface border border-border rounded px-3 py-2 text-sm text-text focus:outline-none focus:border-accent"
              placeholder="Dark, Hard"
            />
          </div>

          <div>
            <label className="block text-sm text-muted mb-1">
              Tags <span className="text-muted">(comma separated)</span>
            </label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full bg-surface border border-border rounded px-3 py-2 text-sm text-text focus:outline-none focus:border-accent"
              placeholder="trap, 808, dark"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="has-vocals"
              checked={hasVocals}
              onChange={(e) => setHasVocals(e.target.checked)}
              className="accent-[var(--accent)]"
            />
            <label htmlFor="has-vocals" className="text-sm text-muted">
              Beat has vocals
            </label>
          </div>

          <div>
            <label className="block text-sm text-muted mb-1">Cover Art (JPG/PNG)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
              className="w-full text-sm text-muted"
            />
          </div>

          <div>
            <label className="block text-sm text-muted mb-1">Watermarked Preview (MP3)</label>
            <input
              type="file"
              accept="audio/mp3,audio/mpeg"
              onChange={(e) => setPreviewFile(e.target.files?.[0] ?? null)}
              className="w-full text-sm text-muted"
            />
          </div>

          <div>
            <label className="block text-sm text-muted mb-1">Full Beat (MP3)</label>
            <input
              type="file"
              accept="audio/mp3,audio/mpeg"
              onChange={(e) => setBeatFile(e.target.files?.[0] ?? null)}
              className="w-full text-sm text-muted"
            />
          </div>

          {message && (
            <p className={`text-sm ${message.startsWith('✅') ? 'text-green-400' : 'text-red-400'}`}>
              {message}
            </p>
          )}

          <button
            onClick={handleUpload}
            disabled={loading}
            className="w-full btn-primary py-3"
          >
            {loading ? 'Uploading...' : 'Upload Beat'}
          </button>
        </div>
      </div>
    </main>
  )
}