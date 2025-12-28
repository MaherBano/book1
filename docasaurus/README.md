# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## Features

This documentation site includes an AI-powered chatbot that provides contextual answers based on the documentation content using Retrieval-Augmented Generation (RAG).

## Installation

```bash
yarn
```

## Local Development

```bash
yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Backend API for Chatbot

The AI chatbot requires a backend API server to function. See `../backend/API.md` for setup instructions.

## Build

```bash
yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

Using SSH:

```bash
USE_SSH=true yarn deploy
```

Not using SSH:

```bash
GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
