import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { VideoIcon } from './Icons'
import classNames from 'classnames'

interface ShortCardProps {
  id: string
  title: string
  thumbnail: string
  views: number
  className?: string
  index?: number
}

export const ShortCard = ({ id, title, thumbnail, views, className, index = 0 }: ShortCardProps) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  const variants = {
    hidden: { 
      opacity: 0,
      scale: 0.8,
      y: 50
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  }

  return (
    <motion.a
      ref={ref}
      href={`https://www.youtube.com/watch?v=${id}`}
      target="_blank"
      rel="noopener noreferrer"
      variants={variants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      whileHover={{ scale: 1.05, y: -5 }}
      className={classNames(
        'block relative overflow-hidden rounded-2xl bg-black/20',
        'transform transition-shadow duration-300',
        'hover:shadow-xl hover:shadow-brand-500/20',
        'focus:outline-none focus:ring-2 focus:ring-brand-500',
        className
      )}
    >
      <div className="relative aspect-[9/16]">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white text-sm font-semibold line-clamp-2">
            {title}
          </h3>
          <div className="mt-2 flex items-center text-xs text-gray-300">
            <VideoIcon className="w-4 h-4 mr-1" />
            {views.toLocaleString()} views
          </div>
        </div>
      </div>

      <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
      
      <motion.div
        className="absolute inset-0 bg-brand-500/20 opacity-0"
        whileHover={{ opacity: 1 }}
      />
    </motion.a>
  )
}
