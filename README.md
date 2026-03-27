# CareerWeave

CareerWeave is an AI-powered career path visualizer. Enter your current role and your dream job, and our AI will weave multiple optimal, actionable pathways to get you there. Built with modern SaaS design principles, it features a stunning glassmorphic UI, smooth animations, and interactive timelines.

## Features
- **AI-Powered Pathways**: Generates 3 distinct routes (Fast Track, Balanced, Expert).
- **Interactive Timelines**: Clickable step cards revealing skills, estimated time, and difficulty.
- **Stunning UI/UX**: Dark theme, mesh gradients, glassmorphism, and fluid Framer Motion animations.
- **Responsive Design**: Adapts seamlessly from mobile to desktop.

## Tech Stack
- **Frontend**: React 19, Tailwind CSS v4, Framer Motion, Lucide Icons
- **Backend**: Node.js, Express, Google GenAI SDK
- **Build Tool**: Vite

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- A Gemini API Key

### Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY="your_api_key_here"
   ```

3. **Run the Development Server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

### Building for Production
```bash
npm run build
npm run start
```
