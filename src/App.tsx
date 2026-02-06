import { useState } from 'react'
import { motion } from 'framer-motion'
import { Smile } from 'lucide-react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <Smile className="w-8 h-8 text-blue-500" />
          <h1 className="text-3xl font-bold text-gray-800">
            Vite + React + Tailwind
          </h1>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <button
            onClick={() => setCount((count) => count + 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            count is {count}
          </button>
          <p className="mt-4 text-gray-600">
            Edit <code className="bg-gray-100 px-1 rounded">src/App.tsx</code> and save to test HMR
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default App
