// components/LoginForm.tsx
import React, { useState } from 'react'
import login from '../services/login'
import { toast } from 'react-toastify'
import { Button } from '@chakra-ui/react' // added Chakra Button import

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { token } = await login(email, password)
      toast.success('Login successful!')
      console.log('Token:', token)
      window.location.href = '/'
    } catch {
      toast.error('Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#212121]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-black">
          Volunteer Login
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="
                w-full
                px-3 py-2
                border border-gray-300
                rounded-md
                focus:outline-none focus:ring-2 focus:ring-blue-500
                text-gray-900
                placeholder-gray-400
              "
            />
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="
                w-full
                px-3 py-2
                border border-gray-300
                rounded-md
                focus:outline-none focus:ring-2 focus:ring-blue-500
                text-gray-900
                placeholder-gray-400
              "
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            isLoading={loading}
            width="100%"
            colorScheme="blue"
            py={2}
            rounded="md"
            _hover={{ bg: "blue.600" }}
            transition="all 150ms"
          >
            {loading ? 'Logging in…' : 'Login'}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default LoginForm
