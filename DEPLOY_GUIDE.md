# PixAI — Deploy Guide
## Your Complete Step-by-Step Deployment

---

## STEP 1 — Add Your Firebase Config

Open `index.html` and find this section (around line 200):

```js
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

Replace with your actual Firebase config from:
> Firebase Console → Project Settings → Your Apps → Firebase SDK snippet

---

## STEP 2 — Set Up Firestore

In Firebase Console:
1. Go to **Firestore Database** → Create database
2. Choose **Production mode**
3. Add this security rule:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /usage/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## STEP 3 — Push to GitHub

1. Go to **github.com** → New repository → Name it `pixai`
2. Run these commands in your terminal:

```bash
cd pixai
git init
git add .
git commit -m "Initial PixAI deploy"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/pixai.git
git push -u origin main
```

---

## STEP 4 — Deploy on Vercel

1. Go to **vercel.com** → Sign up with GitHub
2. Click **"Add New Project"**
3. Import your `pixai` repository
4. Click **"Deploy"** (leave all settings default)

---

## STEP 5 — Add Your Anthropic API Key

In Vercel dashboard:
1. Go to your project → **Settings** → **Environment Variables**
2. Add:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** `sk-ant-...` (your key from console.anthropic.com)
3. Click **Save**
4. Go to **Deployments** → **Redeploy**

---

## STEP 6 — Link Your Login Page

Make sure your existing login page redirects to `/index.html` after
successful Firebase login. PixAI will automatically detect the logged-in
user and redirect to `/login.html` if not authenticated.

---

## DONE! 🚀

Your PixAI is now live at: `your-project.vercel.app`

- ✅ API key hidden safely on Vercel
- ✅ 30 messages/day per user (resets at midnight)
- ✅ Tracked per user via Firebase
- ✅ Upgrade screen shown when limit is hit
- ✅ Sessions saved per user in localStorage

---

## How the Limit System Works

```
User sends message
      ↓
Check Firestore: has user sent 30 messages today?
      ↓ YES                    ↓ NO
Show limit screen         Increment count in Firestore
"Free trial ended"        Send message to AI
Countdown to midnight     
```

Firestore document per user:
```json
{
  "count": 12,
  "date": "2025-02-28"
}
```

Every midnight, the date changes → count auto-resets on next message.

---

## To Add Stripe Later (Phase 2)

When you're ready to charge $29/mo:
1. Create Stripe account at stripe.com
2. Add a `paid_until` field to Firestore
3. Skip the limit check if `paid_until > today`
4. Create a `/api/checkout.js` Vercel function for Stripe

---

## File Structure

```
pixai/
├── index.html        ← Main app (edit Firebase config here)
├── api/
│   ├── chat.js       ← AI chat proxy
│   ├── moderate.js   ← Content moderation proxy
│   ├── insights.js   ← Idea insights proxy
│   └── title.js      ← Chat title generator proxy
├── vercel.json       ← Vercel routing config
└── DEPLOY_GUIDE.md   ← This file
```

---

## Need Help?

Common issues:
- **"Not authorized"** → Check Firestore security rules
- **"API error"** → Check ANTHROPIC_API_KEY in Vercel env vars
- **Login redirect loop** → Make sure Firebase Auth is enabled in console
