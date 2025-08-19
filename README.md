# Andrew Ford's Personal Blog

[![CI](https://github.com/andrewjamesford/andrewford-co-nz-11ty/actions/workflows/ci.yml/badge.svg)](https://github.com/andrewjamesford/andrewford-co-nz-11ty/actions/workflows/ci.yml)

A modern, fast personal blog built with [11ty](https://www.11ty.dev/) featuring AI-powered chat functionality, dynamic content integration, and comprehensive testing.

## 🚀 Features

- **Static Site Generation** with 11ty for lightning-fast performance
- **AI-Powered Chatbot** using RAG (Retrieval-Augmented Generation) with OpenAI
- **Dynamic Content Integration** with Last.fm and YouTube APIs
- **Modern Development Stack** with Docker, Node.js 20+, and automated testing
- **SEO Optimized** with structured data, meta tags, and performance optimization
- **Responsive Design** with modern CSS and image optimization
- **Automated Testing** with Playwright for E2E testing and CI/CD

## 🏗️ Architecture

### Frontend (Static Site)

- **11ty**: Static site generator with Nunjucks templates
- **Content Management**: Markdown files with frontmatter
- **Image Processing**: Automated WebP/AVIF conversion with multiple sizes
- **Styling**: Custom CSS with responsive design

### Backend (API Server)

- **Express.js**: REST API server for dynamic functionality
- **Vector Search**: FAISS-based vector store for content search
- **External APIs**: Last.fm music data, YouTube video feeds
- **AI Integration**: OpenAI GPT for chatbot responses

### Infrastructure

- **Docker**: Containerized deployment with docker-compose
- **Coolify**: Self-hosted deployment platform
- **CI/CD**: GitHub Actions for automated testing
- **Monitoring**: Winston logging with structured logs

## 🛠️ Getting Started

### Prerequisites

- **Node.js 20+** (required)
- **npm** (comes with Node.js)
- **Docker** (optional, for containerized development)

### Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/andrewjamesford/andrewford-co-nz-11ty.git
   cd andrewford-co-nz-11ty
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your API keys (see Environment Variables section)
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

   This starts both the 11ty site and API server:

   - **Website**: http://localhost:8080
   - **API**: http://localhost:3000

### Development Commands

```bash
# Start development with live reload
npm run dev

# Build static site only
npm run build

# Start API server only
npm run api:dev

# Run tests
npm test                    # Quick E2E tests
npm run test:all           # Essential E2E tests
npm run test:e2e           # Full Playwright test suite

# Code quality
npm run prettier           # Format code
npm run markdownlint       # Lint markdown files

# Docker development
npm run docker:dev         # Start with docker-compose
npm run docker:build       # Build production containers
```

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# Site Configuration
SITE_URL=http://localhost:8080
API_URL=http://localhost:3000

# AI Chatbot (Required for chat functionality)
OPENAI_API_KEY=your_openai_api_key_here
OPENROUTER_API_KEY=your_openrouter_key_here
OPENROUTER_MODEL=openai/gpt-4

# External APIs (Optional - for dynamic content)
LASTFM_API_KEY=your_lastfm_api_key_here
YOUTUBE_API_KEY=your_youtube_api_key_here
YOUTUBE_CHANNEL_ID=your_youtube_channel_id_here

# CORS Configuration (Production)
ALLOWED_ORIGINS=["https://andrewford.co.nz"]
```

### API Key Setup

**OpenAI API Key** (Required for chatbot):

1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create an account and generate an API key
3. Add to `.env` as `OPENAI_API_KEY`

**Last.fm API Key** (Optional - for music integration):

1. Visit [Last.fm API](https://www.last.fm/api)
2. Create an application to get an API key
3. Add to `.env` as `LASTFM_API_KEY`

**YouTube API Key** (Optional - for video integration):

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Enable YouTube Data API v3
3. Create credentials and get API key
4. Add to `.env` as `YOUTUBE_API_KEY`

## 📁 Project Structure

```
andrewford-co-nz-11ty/
├── _data/              # 11ty global data files
├── _includes/          # 11ty templates and layouts
│   ├── layouts/        # Page layouts (base, article, home)
│   └── components/     # Reusable template components
├── api/                # Express.js API server
│   ├── routes/         # API endpoint handlers
│   └── utils/          # Utilities (logging, vector search)
├── content/            # Markdown content files
├── public/             # Static assets (images, icons, robots.txt)
├── tests/              # Playwright E2E tests
│   └── e2e/            # End-to-end test suites
├── tools/              # Build and utility scripts
├── vector_store/       # AI chatbot knowledge base
├── _site/              # Generated static site (build output)
└── docs/               # Project documentation
```

## 🧪 Testing

The project includes comprehensive testing with Playwright:

```bash
# Run essential tests (CI-friendly)
npm test

# Run all E2E tests
npm run test:e2e

# Run tests with UI for debugging
npm run test:e2e:ui

# Run specific test file
npx playwright test tests/e2e/basic.spec.js
```

### Test Coverage

- **Basic functionality**: Page loading, navigation, SEO
- **Chatbot UI**: Interface interactions, validation
- **API endpoints**: Input validation, error handling
- **Accessibility**: ARIA compliance, keyboard navigation

## 🚢 Deployment

### Docker (Recommended)

```bash
# Build and run production containers
docker-compose up --build

# Or use npm scripts
npm run docker:prod
```

### Manual Deployment

```bash
# Build static site
npm run build

# Start API server
npm run api

# Serve static files with any web server
npm run serve  # or use nginx, apache, etc.
```

### Coolify Deployment

The project includes `coolify.yaml` for automated deployment on Coolify:

1. Connect your repository to Coolify
2. Set environment variables in Coolify dashboard
3. Deploy automatically on git push

## 🔍 API Endpoints

### Chatbot

- `POST /api/chatrag` - AI chat with RAG search
  ```json
  {
    "question": "What does Andrew do professionally?"
  }
  ```

### Content APIs

- `GET /api/lastplayed` - Latest music from Last.fm
- `GET /api/latest-uploads` - Recent YouTube videos

### Health Check

- `GET /api/health` - API server status

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Commit changes (`git commit -m 'Add amazing feature'`)
6. Push to branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Workflow

- Follow the conventional commits format
- Ensure all tests pass before submitting PR
- Update documentation for new features
- Maintain code formatting with Prettier

## 📄 License

This project is licensed under the [GPL-3.0 License](LICENSE) - see the LICENSE file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/andrewjamesford/andrewford-co-nz-11ty/issues)
- **Documentation**: Check the `/docs` folder for detailed guides
- **Blog**: Visit [andrewford.co.nz](https://andrewford.co.nz) for articles and updates

## 🏗️ Built With

- [11ty](https://www.11ty.dev/) - Static Site Generator
- [Express.js](https://expressjs.com/) - Backend API Framework
- [OpenAI](https://openai.com/) - AI-Powered Chat
- [FAISS](https://github.com/facebookresearch/faiss) - Vector Search
- [Playwright](https://playwright.dev/) - End-to-End Testing
- [Docker](https://www.docker.com/) - Containerization
- [Coolify](https://coolify.io/) - Deployment Platform
