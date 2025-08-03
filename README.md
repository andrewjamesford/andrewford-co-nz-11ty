# Andrew Ford 11ty blog

[![Netlify Status](https://api.netlify.com/api/v1/badges/f4b1e9ee-d1f7-4070-9fe6-f865eb782feb/deploy-status)](https://app.netlify.com/sites/andrewford-co-nz/deploys)

This is my personal blog built with [11ty](https://www.11ty.dev/). It features articles on various topics related to web development, programming, and technology.

## Getting Started

To get started with this project, you'll need to clone the repository and install the dependencies:

```bash
git clone https://github.com/andrewjamesford/andrewford-co-nz-11ty
cd andrewford-co-nz-11ty
npm install
```

This project uses the ENV capabilities from the Netlify CLI. If you wish to create manually please add the following to an `.env` file.

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

- Netlify CLI

```sh
npm install netlify-cli -g
```

Once you've installed the dependencies, you can run the development server:

```sh
netlify dev
```

This will start a local development server at [http://localhost:8888/](http://localhost:8888/) where you can preview your blog.

## Deployment

This blog is deployed to Netlify using their continuous deployment feature. When changes are pushed to the main branch, Netlify will automatically build and deploy the site.

## License

This project is licensed under the [GPL3 License](https://github.com/andrewjamesford/andrewford-co-nz-11ty/main/LICENSE).
