'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"
import Image from 'next/image'

const headshots = [
  { id: 'halloween2024', name: 'Halloween 2024', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202024-10-07%20194431-sNo1GpgXeWKWGA8zksIhtQWtusGgOM.png' },
  { id: 'corporate', name: 'Corporate Headshots', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202024-10-07%20194431-sNo1GpgXeWKWGA8zksIhtQWtusGgOM.png' },
  { id: 'dating', name: 'Dating', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202024-10-07%20194431-sNo1GpgXeWKWGA8zksIhtQWtusGgOM.png' },
  { id: 'jcrew', name: 'J. Crew', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202024-10-07%20194431-sNo1GpgXeWKWGA8zksIhtQWtusGgOM.png' },
  { id: 'boldcolors', name: 'Bold colors', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202024-10-07%20194431-sNo1GpgXeWKWGA8zksIhtQWtusGgOM.png' },
  { id: 'glamour', name: 'Glamour shot', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202024-10-07%20194431-sNo1GpgXeWKWGA8zksIhtQWtusGgOM.png' },
  { id: 'artistic', name: 'Generative artistic filters', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202024-10-07%20194431-sNo1GpgXeWKWGA8zksIhtQWtusGgOM.png' },
  { id: 'mythical', name: 'Mythical Creatures', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202024-10-07%20194431-sNo1GpgXeWKWGA8zksIhtQWtusGgOM.png' },
  { id: 'youtube', name: 'YouTube thumbnail reaction', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202024-10-07%20194431-sNo1GpgXeWKWGA8zksIhtQWtusGgOM.png' },
  { id: 'halloween', name: 'Halloween', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202024-10-07%20194431-sNo1GpgXeWKWGA8zksIhtQWtusGgOM.png' },
  { id: 'annieleibovitz', name: 'Annie Leibovitz', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202024-10-07%20194431-sNo1GpgXeWKWGA8zksIhtQWtusGgOM.png' },
  { id: 'barbie', name: 'Barbie', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202024-10-07%20194431-sNo1GpgXeWKWGA8zksIhtQWtusGgOM.png' },
  { id: 'americana', name: 'Americana', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202024-10-07%20194431-sNo1GpgXeWKWGA8zksIhtQWtusGgOM.png' },
  { id: 'botanical', name: 'Botanical illustration', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202024-10-07%20194431-sNo1GpgXeWKWGA8zksIhtQWtusGgOM.png' },
]

export default function OrderForm() {
  const [email, setEmail] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [style, setStyle] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [isPaid, setIsPaid] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [supabase, setSupabase] = useState<any>(null)

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (supabaseUrl && supabaseAnonKey) {
      const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
      setSupabase(supabaseClient)
    } else {
      console.error('Missing Supabase environment variables')
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !style || files.length === 0 || !isPaid || !supabase) {
      alert('Please fill in all fields, complete payment, and ensure Supabase is initialized')
      return
    }

    setIsSubmitting(true)

    try {
      // Upload images
      const uploadPromises = files.map(async (file) => {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const { data, error } = await supabase.storage
          .from('headshots')
          .upload(fileName, file)

        if (error) throw error
        return data?.path
      })

      const imagePaths = await Promise.all(uploadPromises)

      // Save order details
      const { error: orderError } = await supabase
        .from('orders')
        .insert({
          user_email: email,
          style,
          quantity,
          image_urls: imagePaths,
          status: 'paid'
        })

      if (orderError) {
        throw new Error('Error saving order: ' + orderError.message)
      }

      alert('Order submitted successfully!')
      // Reset form
      setEmail('')
      setQuantity(1)
      setStyle('')
      setFiles([])
      setIsPaid(false)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  return (
    <PayPalScriptProvider options={{ "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '' }}>
      <form onSubmit={handleSubmit} style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email</label>
          <input 
            type="email" 
            id="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Headshot Style</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px', maxHeight: '400px', overflowY: 'auto', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
            {headshots.map((headshot) => (
              <div 
                key={headshot.id} 
                onClick={() => setStyle(headshot.id)}
                style={{ 
                  cursor: 'pointer', 
                  border: style === headshot.id ? '2px solid blue' : '1px solid #ccc',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}
              >
                <Image 
                  src={headshot.image} 
                  alt={headshot.name} 
                  width={150} 
                  height={150} 
                  style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                />
                <p style={{ textAlign: 'center', fontSize: '14px', padding: '5px' }}>{headshot.name}</p>
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="quantity" style={{ display: 'block', marginBottom: '5px' }}>Quantity</label>
          <input 
            type="number" 
            id="quantity" 
            value={quantity} 
            onChange={(e) => setQuantity(parseInt(e.target.value))} 
            min={1}
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="reference" style={{ display: 'block', marginBottom: '5px' }}>Reference Images</label>
          <input 
            type="file" 
            id="reference" 
            onChange={handleFileChange} 
            accept="image/*"
            multiple
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>
        <PayPalButtons 
          createOrder={(data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: (quantity * 10).toString() // Assuming $10 per headshot
                }
              }]
            });
          }}
          onApprove={(data: any, actions: any) => {
            return actions.order.capture().then((details: any) => {
              setIsPaid(true);
              alert('Payment completed. Thank you, ' + details.payer.name.given_name);
            });
          }}
        />
        <button 
          type="submit" 
          disabled={!isPaid || isSubmitting || !email || !style || files.length === 0}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: isPaid && !isSubmitting && email && style && files.length > 0 ? '#4CAF50' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isPaid && !isSubmitting && email && style && files.length > 0 ? 'pointer' : 'not-allowed',
            marginTop: '20px'
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Order'}
        </button>
      </form>
    </PayPalScriptProvider>
  )
}
