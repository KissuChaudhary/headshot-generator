'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"
import Image from 'next/image'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
  const [file, setFile] = useState<File | null>(null)
  const [isPaid, setIsPaid] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !style || !file || !isPaid) {
      alert('Please fill in all fields and complete payment')
      return
    }

    // Upload image
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const { data: imageData, error: uploadError } = await supabase.storage
      .from('headshots')
      .upload(fileName, file)

    if (uploadError) {
      alert('Error uploading image: ' + uploadError.message)
      return
    }

    // Save order details
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_email: email,
        style,
        quantity,
        image_url: imageData?.path,
        status: 'paid'
      })

    if (orderError) {
      alert('Error saving order: ' + orderError.message)
    } else {
      alert('Order submitted successfully!')
      // Reset form
      setEmail('')
      setQuantity(1)
      setStyle('')
      setFile(null)
      setIsPaid(false)
    }
  }

  return (
    <PayPalScriptProvider options={{ "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID! }}>
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
          <label htmlFor="reference" style={{ display: 'block', marginBottom: '5px' }}>Reference Image</label>
          <input 
            type="file" 
            id="reference" 
            onChange={(e) => setFile(e.target.files?.[0] || null)} 
            accept="image/*"
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>
        <PayPalButtons 
          createOrder={(data: any, actions: {
              order: {
                create: (arg0: {
                  purchase_units: {
                    amount: {
                      value: string // Assuming $10 per headshot
                    }
                  }[]
                }) => any
              }
            }) => {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: (quantity * 10).toString() // Assuming $10 per headshot
                }
              }]
            });
          }}
          onApprove={(_data: any, actions: { order: any }) => {
            return actions.order!.capture().then((details: { payer: { name: any } }) => {
              setIsPaid(true);
              alert('Payment completed. Thank you, ' + details.payer.name!.given_name);
            });
          }}
        />
        <button 
          type="submit" 
          disabled={!isPaid}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: isPaid ? '#4CAF50' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isPaid ? 'pointer' : 'not-allowed',
            marginTop: '20px'
          }}
        >
          Submit Order
        </button>
      </form>
    </PayPalScriptProvider>
  )
}