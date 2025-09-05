import React from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useInView } from 'react-intersection-observer';
import classNames from 'classnames';

interface FloatingElementProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export const FloatingElement = ({ children, delay = 0, className }: FloatingElementProps) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const { y } = useSpring({
    from: { y: 0 },
    to: async (next) => {
      await new Promise(resolve => setTimeout(resolve, delay));
      while (1) {
        await next({ y: -20 });
        await next({ y: 0 });
      }
    },
    config: {
      mass: 1,
      tension: 170,
      friction: 26
    }
  });

  const fadeIn = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0px)' : 'translateY(40px)',
    config: { mass: 1, tension: 120, friction: 14 },
    delay
  });

  return (
    <animated.div
      ref={ref}
      style={{
        ...fadeIn,
        transform: y.to(value => `translate3d(0,${value}px,0)`)
      }}
      className={classNames('will-change-transform', className)}
    >
      {children}
    </animated.div>
  );
};
