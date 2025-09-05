import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWindowSize } from 'react-use'
import Confetti from 'react-confetti'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { StatCard } from '@/components/StatCard'
import { ProgressBar } from '@/components/ProgressBar'
import { SubscribeButton } from '@/components/SubscribeButton'
import { NewSubAlert } from '@/components/NewSubAlert'
import { ShortCard } from '@/components/ShortCard'
import { FloatingElement } from '@/components/FloatingElement'
import { 
  YouTubeIcon, 
  HeartIcon, 
  ChartIcon, 
  VideoIcon, 
  StarIcon,
  PlayIcon,
  ExternalLinkIcon,
  UsersIcon,
  TrendingUpIcon,
  EyeIcon
} from '@/components/Icons'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts'

// Dynamic import for animated chart to reduce initial bundle size
const AnimatedChart = dynamic(() => import('@/components/AnimatedChart'), { ssr: false })

type ChannelStats = {
  id: string
  title: string
  thumbnail: string
  subs: number
  views: number
  videos: number
  hiddenSubs: boolean
}

type Short = {
  id: string
  title: string
  thumbnail: string
  views: number
}

type ApiResponse = {
  ok: boolean
  stats?: ChannelStats
  goal?: number
  delta?: number
  history?: Array<{ t: number; subs: number }>
  error?: string
}

export default function Home() {
  const [stats, setStats] = useState<ChannelStats | null>(null)
  const [shorts, setShorts] = useState<Short[]>([])
  const [goal, setGoal] = useState(500)
  const [delta, setDelta] = useState(0)
  const [history, setHistory] = useState<Array<{ t: number; subs: number }>>([])
  const [showConfetti, setShowConfetti] = useState(false)
  const [loading, setLoading] = useState(true)
  const [newSubNotification, setNewSubNotification] = useState(false)

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats')
      const data: ApiResponse = await response.json()
      
      if (data.ok && data.stats) {
        const previousSubs = stats?.subs || 0
        setStats(data.stats)
        setGoal(data.goal || 500)
        setDelta(data.delta || 0)
        setHistory(data.history || [])
        
        // Check for new subscribers
        if (previousSubs > 0 && data.stats.subs > previousSubs) {
          setShowConfetti(true)
          setNewSubNotification(true)
          setTimeout(() => {
            setShowConfetti(false)
            setNewSubNotification(false)
          }, 5000)
        }
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchShorts = async () => {
    try {
      const response = await fetch('/api/shorts')
      const data = await response.json()
      if (data.ok) {
        setShorts(data.items || [])
      }
    } catch (error) {
      console.error('Failed to fetch shorts:', error)
    }
  }

  useEffect(() => {
    fetchStats()
    fetchShorts()
    const interval = setInterval(fetchStats, 10000) // Poll every 10 seconds
    return () => clearInterval(interval)
  }, [])

  const progressPercentage = stats ? Math.min(100, (stats.subs / goal) * 100) : 0
  const subscribersToGo = Math.max(0, goal - (stats?.subs || 0))

  const chartData = history.map(point => ({
    time: new Date(point.t).toLocaleTimeString(),
    subscribers: point.subs
  }))

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-white border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 -top-48 -left-48 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute w-96 h-96 -bottom-48 -right-48 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute w-96 h-96 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {showConfetti && <Confetti numberOfPieces={200} recycle={false} />}
      
      {/* New Subscriber Notification */}
      <AnimatePresence>
        {newSubNotification && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg"
          >
            🎉 New Subscriber! Welcome to the family! 🎉
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            {stats?.thumbnail && (
              <img
                src={stats.thumbnail}
                alt={stats.title}
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg mr-6"
              />
            )}
            <div>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                {stats?.title || 'Loading...'}
              </h1>
              <p className="text-xl text-gray-300 mt-2">
                Join our amazing community! 🚀
              </p>
            </div>
          </div>

          {/* Subscribe Button */}
          <motion.a
            href={`https://www.youtube.com/channel/${process.env.NEXT_PUBLIC_CHANNEL_ID || 'UCnc_hj_ZGl4vu5GHLOTOf5g'}?sub_confirmation=1`}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg transition-all duration-300 animate-pulse-slow"
          >
            <PlayIcon className="mr-3 w-6 h-6" />
            Subscribe Now!
            <ExternalLinkIcon className="ml-3 w-5 h-5" />
          </motion.a>
        </motion.div>

        {/* Main Stats Section - Focused on Subscriber Progress */}
        <div className="max-w-4xl mx-auto mb-12">
          {/* Subscriber Counter & Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-3xl p-12 backdrop-blur-lg bg-white/10 shadow-2xl border border-white/20"
          >
  <h2 className="text-3xl font-bold mb-8 flex items-center justify-center">
    <UsersIcon className="mr-4 w-10 h-10 text-purple-400" />
    Subscriber Progress
  </h2>
            <div className="text-center mb-10">
              <motion.div
                key={stats?.subs}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-7xl md:text-9xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
              >
                {stats?.subs.toLocaleString() || '0'}
              </motion.div>
              <p className="text-xl text-gray-300">Current Subscribers</p>
              
              {delta > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-green-400 text-lg font-semibold mt-2"
                >
                  +{delta} new since last check! 🎉
                </motion.div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Progress to {goal.toLocaleString()} subscribers</span>
                <span>{progressPercentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-6 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-gradient"
                />
              </div>
              <p className="text-center text-sm text-gray-300 mt-2">
                Only {subscribersToGo.toLocaleString()} subscribers to go! 🎯
              </p>
            </div>

          </motion.div>

          {/* Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-3xl p-8"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <TrendingUpIcon className="mr-3 w-8 h-8 text-green-400" />
              Growth Chart
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="time" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="subscribers"
                    stroke="#8B5CF6"
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Additional Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
        >
          <div className="glass rounded-3xl p-6 text-center">
            <EyeIcon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <div className="text-3xl font-bold">{stats?.views.toLocaleString()}</div>
            <div className="text-gray-300">Total Views</div>
          </div>
          <div className="glass rounded-3xl p-6 text-center">
            <VideoIcon className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <div className="text-3xl font-bold">{stats?.videos.toLocaleString()}</div>
            <div className="text-gray-300">Videos</div>
          </div>
        </motion.div>

        {/* Latest Shorts */}
        {shorts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-3xl p-8"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <PlayIcon className="mr-3 w-8 h-8 text-red-400" />
              Latest Shorts
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {shorts.map((short) => (
                <motion.a
                  key={short.id}
                  href={`https://www.youtube.com/watch?v=${short.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="glass rounded-2xl overflow-hidden"
                >
                  <img
                    src={short.thumbnail}
                    alt={short.title}
                    className="w-full aspect-[9/16] object-cover"
                  />
                  <div className="p-3">
                    <h3 className="text-sm font-semibold line-clamp-2 mb-2">
                      {short.title}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {short.views.toLocaleString()} views
                    </p>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-gray-400">
          <p>Updates every 10 seconds • Made with ❤️ for our amazing community</p>
        </div>
      </div>
    </div>
  )
}
