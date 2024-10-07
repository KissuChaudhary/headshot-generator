'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto mt-10 px-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input 
            type="email" 
            id="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required
          />
        </div>
        <div>
          <Label>Headshot Style</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-2 max-h-96 overflow-y-auto p-2">
            {headshots.map((headshot) => (
              <div 
                key={headshot.id} 
                className={`cursor-pointer rounded-lg overflow-hidden border-2 ${style === headshot.id ? 'border-primary' : 'border-transparent'}`}
                onClick={() => setStyle(headshot.id)}
              >
                <Image 
                  src={headshot.image} 
                  alt={headshot.name} 
                  width={200} 
                  height={200} 
                  className="w-full h-auto object-cover"
                />
                <p className="text-center text-sm mt-1 p-1">{headshot.name}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <Label htmlFor="quantity">Quantity</Label>
          <Input 
            type="number" 
            id="quantity" 
            value={quantity} 
            onChange={(e) => setQuantity(parseInt(e.target.value))} 
            min={1}
          />
        </div>
        <div>
          <Label htmlFor="reference">Reference Image</Label>
          <Input 
            type="file" 
            id="reference" 
            onChange={(e) => setFile(e.target.files?.[0] || null)} 
            accept="image/*"
          />
        </div>
        <PayPalButtons 
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: (quantity * 10).toString() // Assuming $10 per headshot
                }
              }]
            });
          }}
          onApprove={(data, actions) => {
            return actions.order!.capture().then((details) => {
              setIsPaid(true);
              alert('Payment completed. Thank you, ' + details.payer.name!.given_name);
            });
          }}
        />
        <Button type="submit" disabled={!isPaid} className="w-full">Submit Order</Button>
      </form>
    </PayPalScriptProvider>
  )
}