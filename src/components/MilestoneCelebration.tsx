import { motion } from 'framer-motion'

interface MilestoneCelebrationProps {
  milestone: number
  isVisible: boolean
  onClose: () => void
}

export const MilestoneCelebration: React.FC<MilestoneCelebrationProps> = ({ 
  milestone, 
  isVisible, 
  onClose 
}) => {
  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.3, rotateY: -180 }}
        animate={{ 
          scale: 1, 
          rotateY: 0,
          transition: {
            type: "spring",
            damping: 15,
            stiffness: 300
          }
        }}
        exit={{ scale: 0.3, rotateY: 180 }}
        className="text-center p-8 max-w-lg mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated rings */}
        <div className="relative mb-8">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 border-4 border-purple-500 rounded-full"
              initial={{ scale: 0, opacity: 1 }}
              animate={{ 
                scale: [0, 1.5, 2],
                opacity: [1, 0.5, 0]
              }}
              transition={{
                duration: 2,
                delay: i * 0.3,
                repeat: Infinity,
                repeatDelay: 1
              }}
              style={{ 
                width: '200px', 
                height: '200px',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}
          
          {/* Main celebration content */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="relative z-10 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 rounded-full w-48 h-48 mx-auto flex items-center justify-center border-4 border-white shadow-2xl"
          >
            <div className="text-center">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-6xl mb-2"
              >
                🎉
              </motion.div>
              <div className="text-white font-bold text-xl">
                {milestone}
              </div>
              <div className="text-white text-sm opacity-90">
                SUBS!
              </div>
            </div>
          </motion.div>
        </div>

        {/* Milestone text */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-6xl font-bold text-white mb-4 text-shadow"
        >
          MILESTONE REACHED!
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="text-2xl text-gray-200 mb-8"
        >
          Congratulations on reaching {milestone} subscribers! 🚀
        </motion.p>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-3 h-3 rounded-full ${
                ['bg-yellow-400', 'bg-pink-400', 'bg-blue-400', 'bg-green-400'][i % 4]
              }`}
              initial={{ 
                opacity: 0,
                x: Math.random() * window.innerWidth,
                y: window.innerHeight + 20
              }}
              animate={{ 
                opacity: [0, 1, 0],
                y: -100,
                x: `+=${(Math.random() - 0.5) * 200}`,
                rotate: 360
              }}
              transition={{ 
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 2,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
          ))}
        </div>

        {/* Close button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="bg-white text-black font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors duration-300"
        >
          Continue Celebrating! 🎊
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
