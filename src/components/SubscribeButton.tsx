import { useSpring, animated } from '@react-spring/web'
import { useInView } from 'react-intersection-observer'
import classNames from 'classnames'
import { YouTubeIcon, PlayIcon, ExternalLinkIcon } from './Icons'

interface SubscribeButtonProps {
  channelId: string
  className?: string
}

export const SubscribeButton = ({ channelId, className }: SubscribeButtonProps) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  const [springs, api] = useSpring(() => ({
    scale: 1,
    y: 0,
    config: {
      mass: 1,
      tension: 400,
      friction: 20
    }
  }))

  const handleHover = () => {
    api.start({
      scale: 1.05,
      y: -4
    })
  }

  const handleHoverEnd = () => {
    api.start({
      scale: 1,
      y: 0
    })
  }

  return (
    <animated.a
      ref={ref}
      href={`https://www.youtube.com/channel/${channelId}?sub_confirmation=1`}
      target="_blank"
      rel="noopener noreferrer"
      style={springs}
      onMouseEnter={handleHover}
      onMouseLeave={handleHoverEnd}
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
    </animated.a>
  )
}
