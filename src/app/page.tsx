'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function Home() {
  const [currentImage, setCurrentImage] = useState(0)
  const images = [
    '/headshot1.jpg',
    '/headshot2.jpg',
    '/headshot3.jpg',
    '/headshot4.jpg',
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-16 flex flex-col lg:flex-row items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:w-1/2 mb-12 lg:mb-0"
        >
          <h1 className="text-5xl lg:text-7xl font-bold mb-6">
            AI-Powered Headshots
          </h1>
          <p className="text-xl lg:text-2xl mb-8">
            Get professional, stunning headshots in minutes with our cutting-edge AI technology.
          </p>
          <Link href="/order" className="bg-white text-purple-700 hover:bg-purple-100 transition-colors duration-300 font-bold py-3 px-8 rounded-full text-lg inline-block">
            Get Your Headshot Now
          </Link>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="lg:w-1/2 relative"
        >
          <div className="w-full h-[500px] relative overflow-hidden rounded-lg shadow-2xl">
            {images.map((src, index) => (
              <Image
                key={src}
                src={src}
                alt={`Headshot example ${index + 1}`}
                layout="fill"
                objectFit="cover"
                className={`absolute top-0 left-0 transition-opacity duration-1000 ${
                  index === currentImage ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
          </div>
          <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-yellow-400 rounded-full"></div>
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-pink-400 rounded-full"></div>
        </motion.div>
      </div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="container mx-auto px-4 py-16"
      >
        <h2 className="text-3xl lg:text-5xl font-bold mb-12 text-center">Why Choose Our AI Headshots?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: 'Lightning Fast', description: 'Get your headshots in minutes, not days.' },
            { title: 'Professional Quality', description: 'AI-generated images that look like they were taken by a pro.' },
            { title: 'Affordable', description: 'Save money on expensive photo shoots.' },
            { title: 'Customizable', description: 'Choose from a variety of styles and backgrounds.' },
            { title: 'Perfect for LinkedIn', description: 'Make a great first impression on your professional profile.' },
            { title: 'No Photographer Needed', description: 'Create stunning headshots from the comfort of your home.' },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white bg-opacity-10 p-6 rounded-lg"
            >
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
      <footer className="text-center py-8">
        <p>&copy; 2024 AI Headshot Generator. All rights reserved.</p>
      </footer>
    </div>
  )
}
