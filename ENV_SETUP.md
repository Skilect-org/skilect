# Setup Guide: Configure Environment Variables

## 🔐 Clerk Authentication Setup

### Step 1: Get Your Clerk Keys
1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Sign in or create an account
3. Create a new application (or select existing one)
4. Navigate to **API Keys** section
5. Copy your **Publishable Key** (starts with `pk_`)
6. Copy your **Secret Key** (starts with `sk_`)

### Step 2: Update `.env.local`
Replace the placeholder values in `.env.local`:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here
CLERK_SECRET_KEY=sk_test_your_actual_secret_key_here
```

### Step 3: Restart Development Server
After updating `.env.local`, restart your Next.js dev server:

```bash
npm run dev
```

---

## 📦 Other Services Setup (Optional)

### Supabase
- Go to [Supabase](https://supabase.com) → Your Project Settings
- Copy Project URL and Anon Key

### Neo4j
- Get connection string from [Neo4j Aura](https://aura.neo4j.io/)
- Format: `neo4j+s://INSTANCE_ID.databases.neo4j.io`

### Gemini AI
- Visit [Google AI Studio](https://aistudio.google.com/apikey)
- Create/copy your API key

### Sarvam AI
- Visit [Sarvam AI Dashboard](https://www.sarvam.ai/)
- Generate your API key

---

## ✅ Verify Setup
Once you've added valid keys, the app should:
- ✓ Load without "publishable key not valid" errors
- ✓ Display sign-in/sign-up pages
- ✓ Allow authentication flow

**Note:** Keep `.env.local` out of version control (it's already in `.gitignore`)
