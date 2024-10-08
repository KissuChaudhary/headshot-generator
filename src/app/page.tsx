import Link from 'next/link'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Welcome to Headshot Generator</h1>
      <p className="mb-4">Get professional headshots with our AI-powered generator.</p>
      <Link href="/order" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Order Now
      </Link>
    </div>
  )
}
