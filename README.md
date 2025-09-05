# BlockBuddies Live Subscriber Counter 🚀

A modern, responsive React app that displays real-time YouTube subscriber statistics with beautiful animations, confetti celebrations, and channel promotion features.

## ✨ Features

- **Real-time Subscriber Count** - Updates every 10 seconds
- **Progress Bar to Goal** - Visual progress toward subscriber milestones
- **Confetti Celebrations** - Animated celebrations for new subscribers
- **Channel Promotion** - Prominent subscribe button linking to YouTube
- **Latest Shorts** - Showcase recent YouTube Shorts
- **Growth Chart** - Visual subscriber history
- **Responsive Design** - Works perfectly on mobile and desktop
- **Modern UI** - Beautiful gradients, glass morphism, and smooth animations

## 🛠️ Tech Stack

- **Next.js 14** - React framework with API routes
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Modern styling
- **Framer Motion** - Smooth animations
- **Recharts** - Beautiful charts
- **React Confetti** - Celebration animations
- **YouTube Data API v3** - Real subscriber data

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd BlockBuddies
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file:
   ```env
   YT_API_KEY=your_youtube_api_key_here
   CHANNEL_ID=UCnc_hj_ZGl4vu5GHLOTOf5g
   SUB_GOAL=500
   NEXT_PUBLIC_CHANNEL_ID=UCnc_hj_ZGl4vu5GHLOTOf5g
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

## 🌐 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/BlockBuddies)

1. **Connect your GitHub repository to Vercel**
2. **Add environment variables in Vercel dashboard:**
   - `YT_API_KEY`
   - `CHANNEL_ID`
   - `SUB_GOAL`
   - `NEXT_PUBLIC_CHANNEL_ID`
3. **Deploy automatically with each push**

## 📊 How It Works

1. **YouTube Data API** - Fetches real-time subscriber count and channel info
2. **Automatic Updates** - Polls YouTube API every 10 seconds
3. **Smart Shorts Detection** - Identifies YouTube Shorts by duration (≤60s) and #shorts tags
4. **Growth Tracking** - Maintains subscriber history for charting
5. **Celebration System** - Triggers confetti and notifications for new subscribers

## 🎯 Key Components

- **Progress Bar** - Shows progress toward subscriber goal with smooth animations
- **Subscribe Button** - Direct link to YouTube channel with subscription confirmation
- **Stats Dashboard** - Real-time display of subscribers, views, and video count
- **Growth Chart** - Line chart showing subscriber growth over time
- **Shorts Grid** - Grid layout of latest YouTube Shorts with view counts

## 🔧 Configuration

Customize the app by modifying:

- **Subscriber Goal**: Change `SUB_GOAL` in environment variables
- **Update Frequency**: Modify the interval in `useEffect` (default: 10 seconds)
- **Colors & Styling**: Update Tailwind classes in components
- **Chart Settings**: Customize chart appearance in the Recharts component

## 📱 Mobile Responsive

The app is fully responsive with:
- **Mobile-first design**
- **Touch-friendly buttons**
- **Optimized layouts for small screens**
- **Fast loading on mobile networks**

## 🎨 Design Features

- **Glass Morphism** - Semi-transparent cards with backdrop blur
- **Gradient Animations** - Animated background gradients
- **Smooth Transitions** - Framer Motion animations throughout
- **Modern Typography** - Inter font for clean readability
- **Color Psychology** - Purple/blue theme for trust and creativity

## 📈 Performance

- **API Caching** - Efficient YouTube API usage
- **Optimized Images** - Next.js Image optimization
- **Minimal Bundle** - Tree-shaking and code splitting
- **Fast Hydration** - Optimized React rendering

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this for your own YouTube channel promotion!

---

**Made with ❤️ for content creators who want to grow their YouTube channels!**
