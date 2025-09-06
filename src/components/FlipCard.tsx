import { motion } from 'framer-motion'

interface FlipCardProps {
  isVisible: boolean
  onAnimationComplete?: () => void
}

export const FlipCard: React.FC<FlipCardProps> = ({ isVisible, onAnimationComplete }) => {
  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0, rotateY: -90, x: 100, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        rotateY: [0, 180, 360], 
        x: 0, 
        scale: [0.8, 1.1, 1],
        y: [0, -10, 0]
      }}
      exit={{ 
        opacity: 0, 
        rotateY: 90, 
        x: 100, 
        scale: 0.8,
        transition: { duration: 0.5 }
      }}
      transition={{ 
        type: "spring", 
        duration: 1.2,
        times: [0, 0.6, 1]
      }}
      onAnimationComplete={onAnimationComplete}
      className="fixed top-20 right-4 z-40"
      style={{ perspective: '1000px' }}
    >
      <motion.div
        className="bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 text-white px-6 py-4 rounded-2xl shadow-2xl border-2 border-white"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="flex items-center space-x-3">
          <motion.div
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [0, 15, -15, 0]
            }}
            transition={{ 
              duration: 0.8, 
              repeat: 2,
              ease: "easeInOut"
            }}
            className="text-2xl"
          >
            ✨
          </motion.div>
          <div>
            <motion.div 
              className="font-bold text-lg"
              animate={{ 
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 0.3, 
                delay: 0.2,
                repeat: 1,
                repeatType: "reverse"
              }}
            >
              +1 Sub Added!
            </motion.div>
            <motion.div 
              className="text-sm opacity-90"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Welcome to the family! 🎉
            </motion.div>
          </div>
        </div>
        
        {/* Confetti particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-yellow-300 rounded-full"
              initial={{ 
                opacity: 0,
                x: Math.random() * 100 - 50,
                y: Math.random() * 60 - 30
              }}
              animate={{ 
                opacity: [0, 1, 0],
                y: [0, -20, -40],
                x: [0, (Math.random() - 0.5) * 40],
                rotate: [0, 360]
              }}
              transition={{ 
                duration: 1.5,
                delay: i * 0.1,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
