# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Cogsec Arena** (also known as Truth or Bot) is a React-based web game that challenges users to distinguish between genuine Wikipedia articles and AI-generated fake articles. The project is designed to test "cognitive security" skills in the age of AI-generated content.

## Development Commands

```bash
# Start development server
npm run dev

# Production build
npm run build

# Development build (preserves source maps)
npm run build:dev

# Lint code
npm run lint

# Preview production build
npm run preview
```

## Technology Stack

- **Frontend**: React 18.3.1 with TypeScript, Vite build tool
- **Package Manager**: Bun (evidenced by `bun.lockb`)
- **UI Framework**: shadcn/ui components built on Radix UI
- **Styling**: Tailwind CSS with custom Wikipedia-inspired theme
- **State Management**: React Query (@tanstack/react-query) for server state
- **3D Graphics**: Three.js with @react-three/fiber for background effects
- **Forms**: React Hook Form with Zod validation
- **Routing**: React Router DOM

## Architecture Overview

### Core Game Flow
1. **Article Fetching**: `wikipediaService.ts` fetches random Wikipedia articles via Wikipedia API
2. **AI Generation**: `aiService.ts` creates fake articles based on real ones (currently using mock data, prepared for AI API integration)
3. **Game Logic**: `WikiGame.tsx` orchestrates the comparison game with scoring and timing
4. **UI Components**: Modular React components with consistent design system

### Key Services
- **`wikipediaService.ts`**: Wikipedia API integration, article fetching and cleaning
- **`aiService.ts`**: AI article generation with difficulty levels (Easy/Medium/Hard)

### Component Structure
- **`src/components/ui/`**: shadcn/ui component library
- **`src/components/WikiGame.tsx`**: Main game logic and state management
- **`src/components/ArticleCard.tsx`**: Article display component
- **`src/components/ThreeBackground.tsx`**: 3D animated background
- **`src/components/Homepage.tsx`**: Landing page and game entry point

## Game Features

- **Difficulty Levels**: Easy, Medium, Hard affecting AI generation sophistication
- **Scoring System**: Points based on correctness and response time
- **Configurable Settings**: Number of rounds, time limits per round
- **Real-time Feedback**: Toast notifications and visual indicators
- **Statistics Tracking**: Game performance metrics

## Deployment

- **Platform**: Configured for Vercel deployment
- **Build Output**: `dist/` directory
- **Configuration**: `vercel.json` specifies build commands and output directory
- **SPA Routing**: Client-side routing handled by React Router DOM

## Theme and Design

- **Color Scheme**: Wikipedia-inspired with custom CSS variables (wiki-blue, wiki-dark, etc.)
- **Dark Theme**: Primary interface theme with gradient backgrounds
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Typography**: Custom typography plugin for article content

## API Integration Notes

- **Wikipedia API**: Uses Wikipedia's REST API for fetching random articles
- **AI Services**: Currently uses mock data but structured to integrate with OpenAI/Claude APIs
- **Error Handling**: Fallback mechanisms for failed API requests
- **Rate Limiting**: Consider API rate limits when making requests

## Content Licensing

Content from Wikipedia is licensed under CC BY-SA 4.0. This project is not affiliated with Wikipedia or the Wikimedia Foundation.