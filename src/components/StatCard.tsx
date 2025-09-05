import { useSpring, animated } from '@react-spring/web'
import { useInView } from 'react-intersection-observer'
import classNames from 'classnames'

interface StatCardProps {
  icon: React.ReactNode
  value: string | number
  label: string
  className?: string
  trend?: number
}

export const StatCard = ({ icon, value, label, className, trend }: StatCardProps) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  const springProps = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0px)' : 'translateY(40px)',
    config: { mass: 1, tension: 120, friction: 14 }
  })

  return (
    <animated.div
      ref={ref}
      style={springProps}
      className={classNames(
        'glass rounded-2xl p-6 hover:shadow-xl transition-shadow duration-300',
        'border border-white/10 hover:border-white/20',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="p-3 rounded-xl bg-gradient-to-br from-brand-400/20 to-brand-600/20">
          {icon}
        </div>
        {trend !== undefined && (
          <span className={classNames(
            'px-2 py-1 rounded-full text-sm font-semibold',
            trend > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          )}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <div className="text-3xl font-display font-bold bg-gradient-to-r from-white to-brand-200 bg-clip-text text-transparent">
          {value}
        </div>
        <div className="mt-1 text-sm text-brand-200">{label}</div>
      </div>
    </animated.div>
  )
}
