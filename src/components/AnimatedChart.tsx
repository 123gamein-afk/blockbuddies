import { useEffect, useRef } from 'react'
import { useSpring, animated } from '@react-spring/web'
import { useInView } from 'react-intersection-observer'
import { Area, AreaChart, ResponsiveContainer } from 'recharts'
import { useWindowSize } from 'react-use'

interface AnimatedChartProps {
  data: number
}

const AnimatedChart = ({ data }: AnimatedChartProps) => {
  const prevDataRef = useRef(data)
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })
  const { width } = useWindowSize()

  useEffect(() => {
    prevDataRef.current = data
  }, [data])

  const { animatedData } = useSpring({
    from: { animatedData: prevDataRef.current },
    to: { animatedData: data },
    config: { mass: 1, tension: 120, friction: 14 }
  })

  // Generate chart data points
  const chartData = Array.from({ length: 50 }, (_, i) => ({
    value: animatedData.get() * (1 + Math.sin(i / 10) * 0.05)
  }))

  return (
    <div ref={ref} className="w-full h-full">
      <ResponsiveContainer>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(79, 103, 255)" stopOpacity={0.4} />
              <stop offset="100%" stopColor="rgb(79, 103, 255)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke="rgb(79, 103, 255)"
            strokeWidth={3}
            fill="url(#areaGradient)"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default AnimatedChart
