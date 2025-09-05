import { useSpring, animated } from '@react-spring/web'
import { useInView } from 'react-intersection-observer'
import classNames from 'classnames'

interface ProgressBarProps {
  current: number
  goal: number
  className?: string
}

export const ProgressBar = ({ current, goal, className }: ProgressBarProps) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  const percentage = Math.min(100, (current / goal) * 100)
  
  const props = useSpring({
    width: inView ? `${percentage}%` : '0%',
    config: { mass: 1, tension: 120, friction: 14 }
  })

  return (
    <div ref={ref} className={classNames('relative h-6 bg-black/20 rounded-full overflow-hidden', className)}>
      <animated.div 
        style={props}
        className="h-full bg-gradient-to-r from-brand-400 to-brand-600 rounded-full"
      />
      <div className="absolute inset-0 bg-noise opacity-10" />
    </div>
  )
}
