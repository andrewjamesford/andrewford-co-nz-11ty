# Andrew Ford 11ty blog

This is my personal blog built with [11ty](https://www.11ty.dev/). It features articles on various topics related to web development, programming, and technology.

## Getting Started

To get started with this project, you'll need to clone the repository and install the dependencies:

```bash
git clone https://github.com/andrewjamesford/andrewford-co-nz-11ty
cd andrewford-co-nz-11ty
npm install
```

## Env variables

```env
API_URL=
LASTFM_API_KEY=
SITE_URL=
YOUTUBE_API_KEY=
YOUTUBE_CHANNEL_ID=
OPENAI_API_KEY=
OPENROUTER_API_KEY=
OPENROUTER_MODEL=
```

Ensure you have the following dependencies installed:

```sh
npm run start
```

This will start a local development server at [http://localhost:3000/](http://localhost:3000/) where you can preview your blog.

## Deployment

This blog is deployed using Docker containers on a self-hosted VPS through [Coolify](https://coolify.io/). The deployment includes:

- **11ty static site generation** with build-time API calls for content
- **Express.js API server** providing REST endpoints for dynamic data
- **Docker containerization** for consistent deployments
- **Self-hosted infrastructure** on VPS for full control and flexibility

The application runs in two containers:

1. **Web container**: Serves the static 11ty-generated site
2. **API container**: Provides dynamic endpoints for Last.fm, YouTube, and ChatRAG functionality

## License

This project is licensed under the [GPL3 License](https://github.com/andrewjamesford/andrewford-co-nz-11ty/main/LICENSE).
