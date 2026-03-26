# Vercel Deployment Guide

## Prerequisites

- GitHub account with your project pushed
- OpenRouter API key (from https://openrouter.ai)
- Vercel account (free at https://vercel.com)

## Step-by-Step Deployment

### 1. Prepare Your Repository

```bash
# Make sure all changes are committed
git status
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 2. Connect to Vercel

**Option A: Web Dashboard (Easiest)**
1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Select your repository (GitHub/GitLab/Bitbucket)
5. Vercel auto-configures everything!
6. Click **"Deploy"**

**Option B: Vercel CLI**
```bash
npm install -g vercel
cd /path/to/smart-wealth-guide-main
vercel
```

### 3. Configure Environment Variables

After selecting the project, **before deploying**:

1. In the deploy screen, click **"Environment Variables"**
2. Add:
   - **Name**: `VITE_OPENROUTER_API_KEY`
   - **Value**: Paste your OpenRouter API key
   - **Scopes**: Select Production (or all)
3. Click **"Add"**
4. Click **"Deploy"**

### 4. Verify Deployment

Once deployed:
- ✅ Check the deployment log for any errors
- ✅ Visit your live URL (e.g., `https://smart-wealth-guide.vercel.app`)
- ✅ Test the chat with a message
- ✅ Check DevTools console (F12) for any errors

### 5. Update Environment Variables Later

If you need to update your API key after deployment:

```bash
# Using CLI
vercel env add VITE_OPENROUTER_API_KEY
# Enter your new API key
# Select: Production, Preview, or Development

# Then redeploy
vercel --prod
```

Or via dashboard:
1. Go to **Project Settings** → **Environment Variables**
2. Edit or delete the old key
3. Add the new one
4. Go to **Deployments** → Click the latest → **Redeploy**

## Troubleshooting

### "API key not configured" Error in Chat

**Solution**: Environment variable not set or server not reloaded
1. Check Vercel Project Settings → Environment Variables
2. Verify `VITE_OPENROUTER_API_KEY` is there
3. If added, redeploy with `vercel --prod`
4. Hard refresh browser (Ctrl+Shift+R)

### 400 Bad Request from OpenRouter API

**Solution**: API key might be invalid or model not available
1. Verify API key is correct in Vercel settings
2. Check OpenRouter dashboard that key is active
3. Check console logs for exact error message

### Build Fails on Vercel

**Solution**: Check the build logs
1. Go to Vercel Dashboard → Deployments
2. Click the failed deployment
3. Check **Build Logs** for error details
4. Common issues:
   - Missing dependencies: Run `npm install` locally and commit `package-lock.json`
   - TypeScript errors: Run `npm run build` locally to test

### Site Shows "Vercel Error" Page

**Solution**: Recheck configuration
1. Ensure `vercel.json` exists in project root
2. Run `npm run build` locally to verify it works
3. Check build output folder is `dist/`
4. Redeploy: `vercel --prod --force`

## Production Best Practices

### 1. Secure Your API Key

Currently, your API key is visible in browser code (Vite limitation).

**For production, create a backend proxy:**

Option A: Use Vercel Serverless Functions
```typescript
// api/chat.ts (in Vercel Functions dir)
import { OpenRouter } from '@openrouter/sdk';

export default async function handler(req, res) {
  const { message, ... } = req.body;
  
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ... }),
  });
  
  return res.json(await response.json());
}
```

Option B: Use a separate Node.js backend (Express, etc.)

### 2. Monitor Costs

- OpenRouter charges per API call
- Track usage in your OpenRouter dashboard
- Set usage limits or alerts

### 3. Add Analytics

Include Vercel Analytics to track performance:
```bash
npm install @vercel/analytics
```

Then in your app entry point:
```typescript
import { Analytics } from '@vercel/analytics/react';

<Analytics />
```

### 4. Enable Caching

Add cache headers in `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000" }
      ]
    }
  ]
}
```

## Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Vite on Vercel](https://vercel.com/docs/frameworks/vite)
- [Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [OpenRouter API Key](https://openrouter.ai/keys)
- [Serverless Functions](https://vercel.com/docs/concepts/functions/serverless-functions)

## Support

- [Vercel Support](https://vercel.com/support)
- [OpenRouter Support](https://openrouter.ai/support)
- Check deployment logs in Vercel dashboard
