# Smart Wealth Guide

AI-powered financial education advisor using OpenRouter LLM and React.

## OpenRouter LLM Integration (.env)

This app uses OpenRouter for LLM-based financial advice.

### Local Setup

1. Get an API key from [OpenRouter](https://openrouter.ai)
2. Create a `.env` file in the project root:

```env
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
```

3. Restart the dev server after editing `.env`.

If `VITE_OPENROUTER_API_KEY` is missing or the API call fails, the app displays an error message.

## Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) (or the port shown in terminal).

---

## Deploy to Vercel

### Quick Deploy (Recommended)

1. **Push to GitHub** (if not already):
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Click **"New Project"**
   - Import your GitHub repository
   - Vercel auto-detects Vite config

3. **Set Environment Variables**:
   - In Vercel Project Settings → **Environment Variables**
   - Add: `VITE_OPENROUTER_API_KEY` = your OpenRouter API key
   - Click **Save**

4. **Deploy**:
   - Click **Deploy**
   - Your app will be live at `your-project.vercel.app`

### Manual Deployment (CLI)

If you prefer the command line:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project root
vercel

# Follow prompts to:
# - Link to your Vercel account
# - Choose/create a project
# - Set environment variables when prompted
```

### Environment Variables in Vercel

After deployment, add your API key:

```bash
vercel env add VITE_OPENROUTER_API_KEY
# Enter: your_openrouter_api_key_here
# Select: Production, Preview, Development (or all)
```

Then redeploy:
```bash
vercel --prod
```

---

## Security Note

- Vite env vars prefixed with `VITE_` are exposed in the browser bundle
- For production-grade security, move LLM calls to a backend API and keep the key server-side
- Consider creating a backend using Node.js/Express that proxies requests to OpenRouter

---

## Available Scripts

- `npm run dev` — Start dev server (http://localhost:8080)
- `npm run build` — Build for production (`dist/` folder)
- `npm run preview` — Preview production build locally
- `npm run lint` — Run ESLint
- `npm test` — Run tests
- `npm run test:watch` — Run tests in watch mode

---

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **UI**: shadcn/ui + Tailwind CSS
- **Build**: Vite
- **LLM**: OpenRouter (NVIDIA Nemotron 3 Super 120B)
- **Deployment**: Vercel
