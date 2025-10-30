// app/api/likes/route.js
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// GET - Fetch all likes
export async function GET() {
  console.log('=== GET LIKES API CALLED ===')
  
  try {
    // Test if environment variables are working
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error('Missing environment variables')
    }

    const apiUrl = `${SUPABASE_URL}/rest/v1/likes?select=*`
    console.log('API URL:', apiUrl)
    
    const response = await fetch(apiUrl, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
    })

    console.log('Response Status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.log('Error Response:', errorText)
      
      if (response.status === 404) {
        throw new Error('Likes table not found. Please create it in Supabase.')
      } else if (response.status === 401) {
        throw new Error('Invalid API key')
      } else {
        throw new Error(`Supabase error: ${response.status} - ${errorText}`)
      }
    }
    
    const data = await response.json()
    console.log('Success! Data:', data)
    return Response.json({ likes: data })
    
  } catch (error) {
    console.error('API Error:', error.message)
    return Response.json({ 
      error: error.message,
      help: 'Check if the likes table exists in Supabase Table Editor'
    }, { status: 500 })
  }
}

// POST - Add a new like
export async function POST() {
  console.log('=== POST LIKES API CALLED ===')
  
  try {
    const apiUrl = `${SUPABASE_URL}/rest/v1/likes`
    console.log('POST to:', apiUrl)
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({
        like_count: 1,
        // Don't send created_at - let Supabase use the default
      }),
    })

    console.log('POST Response Status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.log('POST Error:', errorText)
      throw new Error(`Failed to add like: ${response.status}`)
    }
    
    const data = await response.json()
    console.log('POST Success! Created like:', data)
    return Response.json({ like: data[0] })
    
  } catch (error) {
    console.error('POST API Error:', error.message)
    return Response.json({ error: error.message }, { status: 500 })
  }
}