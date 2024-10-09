'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Image from 'next/image'

const QUANTITY = 4;
const MAX_FILES = 10;
const MAX_TOTAL_SIZE = 10 * 1024 * 1024; // 10MB in bytes


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
  const [style, setStyle] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [supabase, setSupabase] = useState<any>(null)
  const [fileError, setFileError] = useState('')

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
    
    if (!email || !style || files.length < 4 || !supabase) {
      alert('Please fill in all fields, upload at least 4 images, and ensure Supabase is initialized')
      return
    }

    setIsSubmitting(true)

    try {
      // Upload reference images
      const uploadPromises = files.map(async (file, index) => {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}_${index}.${fileExt}`
        console.log(`Attempting to upload file: ${fileName}`)
        
        const { data, error } = await supabase.storage
          .from('headshots')
          .upload(fileName, file)

        if (error) {
          console.error(`Error uploading file ${fileName}:`, error)
          throw error
        }
        console.log(`Successfully uploaded file: ${fileName}`)
        return data?.path
      })

      const imagePaths = await Promise.all(uploadPromises)

      console.log('All files uploaded successfully. Paths:', imagePaths)

      // Save order details
      const { data, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_email: email,
          style,
          quantity: QUANTITY,
          reference_image_urls: imagePaths,
          status: 'submitted',
        })
        .select()

      if (orderError) {
        console.error('Error saving order:', orderError)
        throw new Error('Error saving order: ' + orderError.message)
      }

      console.log('Order saved successfully:', data)

      alert('Order submitted successfully!')
      // Reset form
      setEmail('')
      setStyle('')
      setFiles([])
    } catch (error) {
      console.error('Submission error:', error)
      alert(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      if (selectedFiles.length < 4 || selectedFiles.length > MAX_FILES) {
        setFileError(`Please select 4-${MAX_FILES} images.`)
        return
      }

      const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0)
      if (totalSize > MAX_TOTAL_SIZE) {
        setFileError('Total file size exceeds 10MB limit.')
        return
      }

      setFiles(selectedFiles)
      setFileError('')
    }
  }

  const isFormValid = email && style && files.length >= 4 && files.length <= MAX_FILES

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-2xl font-bold mb-6 text-center">Order Your AI Headshots</h1>
      <div className="mb-6">
        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email</label>
        <input 
          type="email" 
          id="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        />
      </div>
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-900">Headshot Style (Choose one)</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {headshots.map((headshot) => (
            <div 
              key={headshot.id} 
              onClick={() => setStyle(headshot.id)}
              className={`cursor-pointer rounded-lg overflow-hidden border-2 ${style === headshot.id ? 'border-blue-500' : 'border-transparent'}`}
            >
              <Image 
                src={headshot.image} 
                alt={headshot.name} 
                width={100} 
                height={100} 
                className="w-full h-auto object-cover"
              />
              <p className="text-center text-sm mt-1 p-1">{headshot.name}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-6">
        <p className="text-lg font-semibold">Quantity: {QUANTITY} headshots</p>
        <p className="text-sm text-gray-600">You will receive 4 unique AI-generated headshots</p>
      </div>
      <div className="mb-6">
        <label htmlFor="reference" className="block mb-2 text-sm font-medium text-gray-900">
          Reference Images (4-10 images, max 10MB total)
        </label>
        <input 
          type="file" 
          id="reference" 
          onChange={handleFileChange} 
          accept="image/*"
          multiple
          required
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
        />
        {fileError && <p className="mt-2 text-sm text-red-600">{fileError}</p>}
      </div>
      <button 
        type="submit" 
        disabled={!isFormValid || isSubmitting}
        className={`w-full text-white font-bold py-2 px-4 rounded ${
          isFormValid && !isSubmitting
            ? 'bg-blue-500 hover:bg-blue-700'
            : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Order'}
      </button>
    </form>
  )
}
