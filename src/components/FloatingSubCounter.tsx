import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

interface FloatingText {
  id: number
  x: number
  y: number
  delay: number
}

interface FloatingSubCounterProps {
  triggerAnimation: boolean
  onAnimationComplete?: () => void
  showOnLoad?: boolean
}

export const FloatingSubCounter: React.FC<FloatingSubCounterProps> = ({ 
  triggerAnimation, 
  onAnimationComplete,
  showOnLoad = false
}) => {
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([])

  useEffect(() => {
    if (triggerAnimation || showOnLoad) {
      // Generate 3-5 random floating texts
      const count = Math.floor(Math.random() * 3) + 3 // 3 to 5 items
      const newTexts: FloatingText[] = []

      for (let i = 0; i < count; i++) {
        newTexts.push({
          id: Date.now() + i,
          x: Math.random() * 400 - 200, // Random position around center (-200 to 200)
          y: Math.random() * 300 - 150, // Random position around center (-150 to 150)
          delay: i * 0.2 // Stagger the animations
        })
      }

      setFloatingTexts(newTexts)

      // Clear after animation completes
      setTimeout(() => {
        setFloatingTexts([])
        onAnimationComplete?.()
      }, 3000)
    }
  }, [triggerAnimation, showOnLoad, onAnimationComplete])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {floatingTexts.map((text) => (
          <motion.div
            key={text.id}
            initial={{ 
              opacity: 0, 
              scale: 0.5,
              x: 0,
              y: 0,
              rotate: 0
            }}
            animate={{ 
              opacity: [0, 1, 1, 0],
              scale: [0.5, 1.2, 1, 0.8],
              x: [0, text.x * 0.5, text.x, text.x * 1.5],
              y: [0, text.y * 0.3, text.y, text.y - 100],
              rotate: [0, 15, -10, 5]
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.3,
              y: text.y - 150
            }}
            transition={{ 
              duration: 2.5,
              delay: text.delay,
              times: [0, 0.3, 0.7, 1],
              ease: "easeOut"
            }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            style={{ zIndex: 10 }}
          >
            {/* Text only - no background */}
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotateZ: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 0.5,
                repeat: 2,
                delay: text.delay + 0.3
              }}
              className="text-white font-bold text-lg text-shadow-strong"
            >
              <div className="flex items-center space-x-2">
                <motion.span
                  animate={{ 
                    scale: [1, 1.3, 1],
                    rotate: [0, 360]
                  }}
                  transition={{ 
                    duration: 1,
                    delay: text.delay + 0.1
                  }}
                  className="text-yellow-300 text-2xl"
                >
                  ✨
                </motion.span>
                <span className="font-extrabold text-2xl bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  +1 SUB
                </span>
                <motion.span
                  animate={{ 
                    scale: [1, 1.4, 1],
                    rotate: [0, -360]
                  }}
                  transition={{ 
                    duration: 1,
                    delay: text.delay + 0.2
                  }}
                  className="text-yellow-300 text-2xl"
                >
                  🎉
                </motion.span>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
      
      {/* Simplified particle effects */}
      <AnimatePresence>
        {(triggerAnimation || showOnLoad) && (
          <>
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                initial={{ 
                  opacity: 0,
                  scale: 0,
                  x: 0,
                  y: 0
                }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: (Math.random() - 0.5) * 400,
                  y: (Math.random() - 0.5) * 300,
                  rotate: Math.random() * 360
                }}
                exit={{ opacity: 0 }}
                transition={{ 
                  duration: 2,
                  delay: Math.random() * 0.5,
                  ease: "easeOut"
                }}
                className={`absolute top-1/2 left-1/2 w-2 h-2 rounded-full ${
                  ['bg-yellow-400', 'bg-green-400', 'bg-blue-400', 'bg-pink-400'][i % 4]
                }`}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
