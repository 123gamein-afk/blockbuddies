import { motion } from 'framer-motion'
import classNames from 'classnames'
import { YouTubeIcon, PlayIcon, ExternalLinkIcon } from '@/components/Icons'

interface SubscribeButtonProps {
  channelId: string
  className?: string
}

export const SubscribeButton = ({ channelId, className }: SubscribeButtonProps) => {

  return (
    <motion.a
      href={`https://www.youtube.com/channel/${channelId}?sub_confirmation=1`}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.05, y: -4 }}
      className={classNames(
        'group flex items-center justify-center gap-3 px-8 py-4 text-xl font-bold',
        'bg-youtube-red hover:bg-red-700 text-white rounded-full shadow-xl',
        'transition-shadow duration-300 hover:shadow-red-600/25 hover:shadow-2xl',
        'focus:outline-none focus:ring-4 focus:ring-red-500/30',
        className
      )}
    >
      <PlayIcon className="w-6 h-6 mr-3" />
      <span className="relative">
        Subscribe Now
        <span className="absolute inset-0 animate-glow opacity-0 group-hover:opacity-100 transition-opacity" />
      </span>
      <ExternalLinkIcon className="w-5 h-5 ml-3" />
    </motion.a>
  )
}
