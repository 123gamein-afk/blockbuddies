import React from 'react'
import ConfettiExplosion from 'react-confetti-explosion'
import { useSpring, animated } from '@react-spring/web'
import { useInView } from 'react-intersection-observer'
import classNames from 'classnames'
import { HeartIcon } from './Icons'

interface NewSubAlertProps {
  className?: string
  onComplete?: () => void
}

export const NewSubAlert = ({ className, onComplete }: NewSubAlertProps) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  const springProps = useSpring({
    from: { scale: 0, opacity: 0 },
    to: { scale: 1, opacity: 1 },
    config: {
      mass: 1,
      tension: 280,
      friction: 20
    },
    onRest: onComplete
  })

  return (
    <animated.div
      ref={ref}
      style={springProps}
      className={classNames(
        'fixed top-4 left-1/2 transform -translate-x-1/2 z-50',
        'flex items-center gap-4 px-8 py-4 rounded-full',
        'bg-gradient-to-r from-green-500 to-emerald-600',
        'text-white shadow-xl shadow-green-500/25',
        className
      )}
    >
      <div className="absolute inset-0 rounded-full bg-noise opacity-10" />
      <HeartIcon className="w-6 h-6 animate-bounce-slow" />
      <div className="relative">
        <p className="text-xl font-bold">
          New Subscriber! 🎉
        </p>
        <p className="text-sm text-green-100">
          Welcome to the family!
        </p>
      </div>
      <div className="absolute -inset-1">
        <ConfettiExplosion
          force={0.6}
          duration={2500}
          particleCount={30}
          width={1600}
        />
      </div>
    </animated.div>
  )
}
