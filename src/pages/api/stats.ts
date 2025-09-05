// API endpoint to fetch YouTube channel stats
import type { NextApiRequest, NextApiResponse } from 'next'

type ChannelStats = {
  id: string
  title: string
  thumbnail: string
  subs: number
  views: number
  videos: number
  hiddenSubs: boolean
}

type StatsResponse = {
  ok: boolean
  stats?: ChannelStats
  goal?: number
  delta?: number
  history?: Array<{ t: number; subs: number }>
  error?: string
}

// Simple in-memory history
const history: Array<{ t: number; subs: number }> = []
let lastSubs: number | null = null

async function fetchChannelStats(): Promise<ChannelStats> {
  const YT_API_KEY = process.env.YT_API_KEY
  const CHANNEL_ID = process.env.CHANNEL_ID
  
  if (!YT_API_KEY || !CHANNEL_ID) {
    throw new Error('Missing YT_API_KEY or CHANNEL_ID in environment variables')
  }

  const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${CHANNEL_ID}&key=${YT_API_KEY}`
  
  const response = await fetch(url)
  const data = await response.json()
  
  if (!data.items || !data.items.length) {
    throw new Error('Channel not found')
  }
  
  const channel = data.items[0]
  
  return {
    id: channel.id,
    title: channel.snippet?.title || 'Unknown Channel',
    thumbnail: channel.snippet?.thumbnails?.high?.url || channel.snippet?.thumbnails?.default?.url || '',
    subs: Number(channel.statistics?.subscriberCount || 0),
    views: Number(channel.statistics?.viewCount || 0),
    videos: Number(channel.statistics?.videoCount || 0),
    hiddenSubs: Boolean(channel.statistics?.hiddenSubscriberCount),
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StatsResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  try {
    const stats = await fetchChannelStats()
    const now = Date.now()
    const goal = Number(process.env.SUB_GOAL || 500)
    
    // Add to history
    history.push({ t: now, subs: stats.subs })
    if (history.length > 500) history.shift()
    
    // Calculate delta
    const delta = lastSubs === null ? 0 : stats.subs - lastSubs
    lastSubs = stats.subs
    
    res.status(200).json({
      ok: true,
      stats,
      goal,
      delta,
      history: history.slice(-50) // Return last 50 points
    })
  } catch (error) {
    console.error('Stats API Error:', error)
    res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : 'Failed to fetch stats'
    })
  }
}
