import { useEffect, useState, useCallback } from 'react'
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
import { MilestoneCelebration } from '@/components/MilestoneCelebration'
import { AnimatedProgress } from '@/components/AnimatedProgress'
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
  const [animatedProgress, setAnimatedProgress] = useState(0)
  const [milestoneReached, setMilestoneReached] = useState<number | null>(null)
  const [showNewSubAlert, setShowNewSubAlert] = useState(false)
  const { width, height } = useWindowSize()

  // Milestones array
  const milestones = [50, 100, 150, 200, 250, 300, 350, 400, 450, 500]

  // Check if current subscriber count hits a milestone
  const checkMilestone = useCallback((currentSubs: number, previousSubs: number) => {
    const reachedMilestone = milestones.find(milestone => 
      currentSubs >= milestone && previousSubs < milestone
    )
    
    if (reachedMilestone) {
      setMilestoneReached(reachedMilestone)
      setShowConfetti(true)
      setTimeout(() => {
        setMilestoneReached(null)
        setShowConfetti(false)
      }, 8000)
    }
  }, [])

  // Handle keyboard events
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'b') {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 5000)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

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
        
        // Check for new subscribers and milestones
        if (previousSubs > 0 && data.stats.subs > previousSubs) {
          checkMilestone(data.stats.subs, previousSubs)
          setNewSubNotification(true)
          setShowNewSubAlert(true)
          
          setTimeout(() => {
            setNewSubNotification(false)
            setShowNewSubAlert(false)
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

  const simulateNewSub = () => {
    if (!stats) return
    const previousSubs = stats.subs
    const newStats = { ...stats, subs: stats.subs + 1 }
    setStats(newStats)
    setDelta(1)
    checkMilestone(newStats.subs, previousSubs)
    setNewSubNotification(true)
    setShowNewSubAlert(true)
    
    setTimeout(() => {
      setNewSubNotification(false)
      setShowNewSubAlert(false)
    }, 5000)
  }

  useEffect(() => {
    fetchStats()
    fetchShorts()
    const interval = setInterval(fetchStats, 10000) // Poll every 10 seconds
    return () => clearInterval(interval)
  }, [])

  // Animate progress bar from 0 to current on mount
  useEffect(() => {
    if (stats && !loading) {
      const targetProgress = Math.min(100, (stats.subs / goal) * 100)
      let start = 0
      const duration = 2000 // 2 seconds
      const startTime = Date.now()
      
      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        setAnimatedProgress(start + (targetProgress - start) * easeOutQuart)
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      
      requestAnimationFrame(animate)
    }
  }, [stats, goal, loading])

  const progressPercentage = stats ? Math.min(100, (stats.subs / goal) * 100) : 0
  const subscribersToGo = Math.max(0, goal - (stats?.subs || 0))

  const chartData = history.map(point => ({
    time: new Date(point.t).toLocaleTimeString(),
    subscribers: point.subs
  }))

  // Get next milestone
  const nextMilestone = milestones.find(milestone => milestone > (stats?.subs || 0))
  const progressToNextMilestone = nextMilestone ? 
    Math.min(100, ((stats?.subs || 0) / nextMilestone) * 100) : 100

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white text-xl font-semibold"
          >
            Loading your amazing content...
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{stats?.title || 'BlockBuddies'} - Subscriber Dashboard</title>
        <meta name="description" content="Real-time subscriber dashboard with milestones and celebrations" />
      </Head>
      
      <div className="min-h-screen bg-black text-white overflow-hidden">
        {/* Confetti */}
        {showConfetti && <Confetti width={width} height={height} numberOfPieces={300} recycle={false} />}
        
        {/* Milestone Celebration */}
        <MilestoneCelebration
          milestone={milestoneReached || 0}
          isVisible={!!milestoneReached}
          onClose={() => {
            setMilestoneReached(null)
            setShowConfetti(false)
          }}
        />

        {/* Legacy New Subscriber Notification */}
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

        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-6">
              {stats?.thumbnail && (
                <motion.img
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 1, type: "spring" }}
                  src={stats.thumbnail}
                  alt={stats.title}
                  className="w-24 h-24 rounded-full border-4 border-white shadow-2xl mr-6"
                />
              )}
              <div>
                <motion.h1
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                >
                  {stats?.title || 'Loading...'}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-xl text-gray-300 mt-2"
                >
                  Join our amazing community! 🚀
                </motion.p>
              </div>
            </div>

            {/* Subscribe Button */}
            <motion.a
              href={`https://www.youtube.com/channel/${process.env.NEXT_PUBLIC_CHANNEL_ID || 'UCnc_hj_ZGl4vu5GHLOTOf5g'}?sub_confirmation=1`}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255,0,0,0.5)" }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-full text-xl shadow-2xl transition-all duration-300"
            >
              <PlayIcon className="mr-3 w-6 h-6" />
              Subscribe Now!
              <ExternalLinkIcon className="ml-3 w-5 h-5" />
            </motion.a>
            
            {/* Instructions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-4 text-sm text-gray-400 space-y-1"
            >
              <p>💡 Press 'B' for confetti celebration!</p>
              <p>🎮 Click "Simulate New Subscriber" to test the system!</p>
              <p>🎯 Watch for milestone celebrations at 50, 100, 150, 200, 250, 300, 350, 400, 450, 500 subs!</p>
            </motion.div>
          </motion.div>

          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Subscriber Counter & Progress */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-dark rounded-3xl p-8 border-2 border-gray-800"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center text-white">
                <UsersIcon className="mr-3 w-8 h-8 text-purple-400" />
                Subscriber Progress
              </h2>
              
              {/* Use AnimatedProgress component */}
              <AnimatedProgress 
                currentSubs={stats?.subs || 0}
                goal={goal}
                duration={2000}
              />
              
              {delta > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-green-400 text-lg font-semibold mt-4 text-center"
                >
                  +{delta} new since last check! 🎉
                </motion.div>
              )}

              {/* Next Milestone */}
              {nextMilestone && (
                <div className="mb-6 p-4 bg-gray-900 rounded-xl border border-gray-700">
                  <div className="flex justify-between text-sm mb-2 text-gray-300">
                    <span>Next Milestone: {nextMilestone} subs</span>
                    <span>{progressToNextMilestone.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressToNextMilestone}%` }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                    />
                  </div>
                </div>
              )}

              {/* Milestones Grid */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-white">Milestones</h3>
                <div className="grid grid-cols-5 gap-2">
                  {milestones.map((milestone) => {
                    const isReached = (stats?.subs || 0) >= milestone
                    const isCurrent = (stats?.subs || 0) < milestone && milestone === nextMilestone
                    
                    return (
                      <motion.div
                        key={milestone}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: milestone / 1000 }}
                        className={`
                          text-center p-2 rounded-lg border text-xs font-semibold
                          ${isReached 
                            ? 'bg-green-600 border-green-400 text-white' 
                            : isCurrent 
                            ? 'bg-yellow-600 border-yellow-400 text-white animate-pulse' 
                            : 'bg-gray-800 border-gray-600 text-gray-400'
                          }
                        `}
                      >
                        {milestone}
                        {isReached && <div className="text-xs">✓</div>}
                        {isCurrent && <div className="text-xs">🎯</div>}
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              {/* Demo Button */}
              <motion.button
                onClick={simulateNewSub}
                whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(34, 197, 94, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 border border-green-500 relative overflow-hidden"
              >
                <span className="relative z-10">🎉 Simulate New Subscriber (Demo)</span>
                <motion.div
                  animate={{ x: [-100, 300] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
                  style={{ width: '100px' }}
                />
              </motion.button>
            </motion.div>

            {/* Chart */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-dark rounded-3xl p-8 border-2 border-gray-800"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center text-white">
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
                        backgroundColor: 'rgba(0,0,0,0.9)',
                        border: '1px solid #374151',
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
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
          >
            <motion.div 
              whileHover={{ scale: 1.02, y: -5 }}
              className="glass-dark rounded-3xl p-6 text-center border-2 border-gray-800"
            >
              <EyeIcon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-white">{stats?.views.toLocaleString()}</div>
              <div className="text-gray-300">Total Views</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02, y: -5 }}
              className="glass-dark rounded-3xl p-6 text-center border-2 border-gray-800"
            >
              <VideoIcon className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-white">{stats?.videos.toLocaleString()}</div>
              <div className="text-gray-300">Videos</div>
            </motion.div>
          </motion.div>

          {/* Latest Shorts */}
          {shorts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="glass-dark rounded-3xl p-8 border-2 border-gray-800"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center text-white">
                <PlayIcon className="mr-3 w-8 h-8 text-red-400" />
                Latest Shorts
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {shorts.map((short, index) => (
                  <motion.a
                    key={short.id}
                    href={`https://www.youtube.com/watch?v=${short.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="glass-dark rounded-2xl overflow-hidden border border-gray-700"
                  >
                    <img
                      src={short.thumbnail}
                      alt={short.title}
                      className="w-full aspect-[9/16] object-cover"
                    />
                    <div className="p-3">
                      <h3 className="text-sm font-semibold line-clamp-2 mb-2 text-white">
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center mt-12 text-gray-400"
          >
            <p>Updates every 10 seconds • Made with ❤️ for our amazing community</p>
            <p className="text-sm mt-2">🎮 Press 'B' for confetti • 🚀 Celebrating every milestone</p>
          </motion.div>
        </div>
      </div>
    </>
  )
}
