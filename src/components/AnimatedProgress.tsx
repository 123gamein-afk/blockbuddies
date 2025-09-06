import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface AnimatedProgressProps {
  currentSubs: number
  goal: number
  duration?: number
}

export const AnimatedProgress: React.FC<AnimatedProgressProps> = ({ 
  currentSubs, 
  goal, 
  duration = 2000
}) => {
  const [displaySubs, setDisplaySubs] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const targetProgress = Math.min(100, (currentSubs / goal) * 100)
    let start = 0
    const startTime = Date.now()
    
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progressPercent = Math.min(elapsed / duration, 1)
      
      // Easing function (ease-out-quart)
      const easeOutQuart = 1 - Math.pow(1 - progressPercent, 4)
      
      const currentDisplaySubs = Math.floor(start + (currentSubs - start) * easeOutQuart)
      const currentProgress = start + (targetProgress - start) * easeOutQuart
      
      setDisplaySubs(currentDisplaySubs)
      setProgress(currentProgress)
      
      if (progressPercent < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }, [currentSubs, goal, duration])

  return (
    <div className="space-y-4">
      {/* Animated subscriber count */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="text-6xl md:text-8xl font-bold text-white font-mono">
          {displaySubs.toLocaleString()}
        </div>
        <div className="text-xl text-gray-300 mt-2">Current Subscribers</div>
      </motion.div>

      {/* Animated progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-300">
          <span>Progress to {goal.toLocaleString()} subscribers</span>
          <span>{progress.toFixed(1)}%</span>
        </div>
        
        <div className="relative w-full bg-gray-800 rounded-full h-6 overflow-hidden border border-gray-700">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-700" />
          
          {/* Animated progress fill */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
            className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 rounded-full relative overflow-hidden"
          >
            {/* Shimmer effect */}
            <motion.div
              animate={{ x: [-100, 400] }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                ease: "linear",
                repeatDelay: 0.5
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
              style={{ width: '100px' }}
            />
            
            {/* Pulse effect */}
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-white opacity-20"
            />
          </motion.div>
          
          {/* Progress indicators */}
          <div className="absolute inset-0 flex items-center">
            {[25, 50, 75].map((mark) => (
              <div
                key={mark}
                className="absolute w-0.5 h-full bg-gray-600"
                style={{ left: `${mark}%` }}
              />
            ))}
          </div>
        </div>
        
        <div className="text-center text-sm text-gray-400">
          {currentSubs < goal ? (
            <>Only {(goal - currentSubs).toLocaleString()} subscribers to go! 🎯</>
          ) : (
            <>Goal reached! 🎉 Time to set a new target! 🚀</>
          )}
        </div>
      </div>
    </div>
  )
}
