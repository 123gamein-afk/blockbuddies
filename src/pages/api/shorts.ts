// API endpoint to fetch latest YouTube Shorts
import type { NextApiRequest, NextApiResponse } from 'next'

type Short = {
  id: string
  title: string
  publishedAt: string
  thumbnail: string
  duration: string
  views: number
}

type ShortsResponse = {
  ok: boolean
  items?: Short[]
  error?: string
}

function iso8601ToSeconds(duration: string): number {
  const match = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/i.exec(duration || '')
  if (!match) return 0
  const hours = Number(match[1] || 0)
  const minutes = Number(match[2] || 0)
  const seconds = Number(match[3] || 0)
  return hours * 3600 + minutes * 60 + seconds
}

async function fetchLatestShorts(maxResults = 12): Promise<Short[]> {
  const YT_API_KEY = process.env.YT_API_KEY
  const CHANNEL_ID = process.env.CHANNEL_ID
  
  if (!YT_API_KEY || !CHANNEL_ID) {
    throw new Error('Missing YT_API_KEY or CHANNEL_ID in environment variables')
  }

  // Search for recent videos from the channel
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=${Math.min(maxResults, 50)}&order=date&type=video&key=${YT_API_KEY}`
  
  const searchResponse = await fetch(searchUrl)
  const searchData = await searchResponse.json()
  
  const items = searchData.items || []
  if (!items.length) return []

  // Get video details to check duration
  const videoIds = items.map((item: any) => item.id.videoId).filter(Boolean).join(',')
  if (!videoIds) return []
  
  const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics,snippet&id=${videoIds}&key=${YT_API_KEY}`
  const videosResponse = await fetch(videosUrl)
  const videosData = await videosResponse.json()
  
  const videos = (videosData.items || []).map((video: any) => {
    const duration = video.contentDetails?.duration || ''
    const seconds = iso8601ToSeconds(duration)
    const taggedShort = /#shorts/i.test(video.snippet?.title || '') || /#shorts/i.test(video.snippet?.description || '')
    const isShort = (seconds > 0 && seconds <= 60) || taggedShort
    
    return {
      id: video.id,
      title: video.snippet?.title || 'Untitled',
      publishedAt: video.snippet?.publishedAt || '',
      thumbnail: video.snippet?.thumbnails?.medium?.url || video.snippet?.thumbnails?.default?.url || '',
      duration,
      views: Number(video.statistics?.viewCount || 0),
      isShort
    }
  })

  return videos.filter((video: any) => video.isShort).slice(0, maxResults)
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ShortsResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  try {
    const items = await fetchLatestShorts(12)
    res.status(200).json({ ok: true, items })
  } catch (error) {
    console.error('Shorts API Error:', error)
    res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : 'Failed to fetch shorts'
    })
  }
}
