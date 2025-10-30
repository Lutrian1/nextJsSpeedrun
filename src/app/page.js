// app/test-page/page.js
'use client'
import { useState, useEffect } from 'react'

export default function TestPage() {
  const [likes, setLikes] = useState([])
  const [loading, setLoading] = useState(false)

  // Fetch likes on component mount
  useEffect(() => {
    fetchLikes()
  }, [])

  const fetchLikes = async () => {
    try {
      const response = await fetch('/api/likes')
      const data = await response.json()
      setLikes(data.likes || [])
    } catch (error) {
      console.error('Error fetching likes:', error)
    }
  }

  const addLike = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()
      
      if (data.like) {
        // Refresh the likes list
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
    <main style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Like Counter Test</h1>
      
        <button 
          onClick={addLike} 
          disabled={loading}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
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
    </main>
  )
}