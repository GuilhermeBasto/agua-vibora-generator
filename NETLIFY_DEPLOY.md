# Deploying to Netlify

This guide explains how to deploy the Água Víbora Generator to Netlify.

## Prerequisites

1. A Netlify account (free tier works)
2. Git repository with your code

## Setup Steps

### 1. Install serverless-http

```bash
npm install serverless-http
```

### 2. Configuration Files

The following files have been created for Netlify deployment:

- `netlify.toml` - Netlify build configuration
- `netlify/functions/api.ts` - Serverless function wrapper
- `src/netlify.ts` - Serverless wrapper for local testing

### 3. Deploy to Netlify

#### Option A: Using Netlify CLI

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

#### Option B: Using Git Integration

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [Netlify](https://app.netlify.com/)
3. Click "Add new site" → "Import an existing project"
4. Connect your Git repository
5. Netlify will auto-detect the configuration from `netlify.toml`
6. Click "Deploy site"

### 4. Environment Variables

Add the following environment variables in Netlify dashboard:

- `NODE_ENV` = `production`
- `PORT` = `3000` (optional, defaults to 3000)

Go to: **Site settings → Environment variables → Add variable**

## How It Works

The app is wrapped with `serverless-http` which converts Express middleware into serverless functions that work on Netlify's platform. All routes are proxied through a single serverless function at `/.netlify/functions/api`.

## URLs After Deployment

Your endpoints will be available at:
- Home: `https://your-site.netlify.app/`
- API Docs: `https://your-site.netlify.app/api-docs`
- Endpoints: `https://your-site.netlify.app/irrigation/*`

## Troubleshooting

### Build Fails
- Check Node version matches `engines` in package.json
- Verify all dependencies are installed
- Check Netlify build logs for specific errors

### Functions Timeout
- Netlify free tier has 10s function timeout
- Consider optimizing large file generation
- May need to upgrade to Pro plan for longer timeouts

### PDF/Excel Generation Issues
- Large files might exceed function size limits
- Consider using streaming responses
- May need background processing for very large files

## Local Testing

Test the serverless setup locally:

```bash
netlify dev
```

This runs your app using Netlify's local development environment.
