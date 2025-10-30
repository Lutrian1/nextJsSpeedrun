// app/test-page/page.js
'use client'
import { useState, useEffect } from 'react'

export default function TestPage() {
  const [likes, setLikes] = useState([])
  const [loading, setLoading] = useState(false)

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  useEffect(() => {
    fetchLikes()
  }, [])

  const fetchLikes = async () => {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/likes?select=*`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()
      setLikes(data || [])
    } catch (error) {
      console.error('Error fetching likes:', error)
    }
  }

  const addLike = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/likes`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
        body: JSON.stringify({
          like_count: 1,
        }),
      })
      
      if (response.ok) {
        fetchLikes()
      }
    } catch (error) {
      console.error('Error adding like:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalLikes = likes.reduce((sum, like) => sum + like.like_count, 0)

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Like Counter Test</h1>
      <button onClick={addLike} disabled={loading}>
        {loading ? 'Adding Like...' : 'Add Like'}
      </button>
      <h2>Total Likes: {totalLikes}</h2>
      <h3>Like History:</h3>
      <ul>
        {likes.map((like) => (
          <li key={like.id}>
            {new Date(like.created_at).toLocaleString()} - {like.like_count} like(s)
          </li>
        ))}
      </ul>
    </div>
  )
}