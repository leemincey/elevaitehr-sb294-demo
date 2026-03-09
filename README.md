# ElevaiteHR — Demo Environment
## Sierra Pacific Builders Sales Demo

This is the **prospect-facing demo app** for ElevaiteHR. It lets prospects experience the full SB 294 compliance wizard as an employee of a fictional CA construction company.

---

## What This Is

- **Sierra Pacific Builders** branded compliance wizard (5 steps)
- Captures `?prospect=ID` from URL to track which prospect submitted
- On completion, shows an **ElevaiteHR pitch** with a Calendly booking link
- Data saves to a dedicated **demo Supabase project** (isolated from production)
- 25 pre-loaded fictitious employees for the gap analysis demo

---

## Setup Instructions

### 1. Create a Demo Supabase Project
1. Go to [supabase.com](https://supabase.com) → New Project
2. Name it `elevaitehr-demo`
3. Once created: Settings → API → copy URL, anon key, service role key

### 2. Run the Database Setup
1. In your demo Supabase project → SQL Editor
2. Paste and run the contents of `supabase/demo-setup.sql`
3. Confirm: 25 employees in `employer_roster`, empty `employee_records`

### 3. Configure Environment Variables
```bash
cp .env.local.example .env.local
# Fill in your demo Supabase credentials
```

### 4. Create GitHub Repo & Deploy to Vercel
```bash
# In the project root:
git init
git add .
git commit -m "Initial demo app"
gh repo create elevaitehr-demo --public --push
```
Then connect to Vercel → add env variables → deploy.

### 5. Connect domain
In Vercel → Domains → add `demo.elevaitehr.com`

---

## How to Use in Sales

### Sending to a Prospect
Generate a unique link per prospect:
```
https://demo.elevaitehr.com?prospect=PROSPECT_ID
```

Use something memorable as the prospect ID, e.g.:
- `?prospect=acme-roofing`
- `?prospect=bay-construction`
- `?prospect=john-smith-2026`

### On the Sales Call
1. Open your admin dashboard
2. Show the **roster** → 25 employees, all pending
3. Show the **gap analysis** → 100% compliance gap
4. Pull up **records** → find their submission by name
5. Show their signature, contact data, timestamp
6. 💥 *"This is exactly what your employees would see. Want your own version?"*

### Update the Calendly Link
In `components/steps/StepSuccess.tsx`, find:
```
href="https://calendly.com/elevaitehr"
```
Replace with your real Calendly link.

---

## Key Differences from Production
| | Demo | Production |
|---|---|---|
| Branding | Sierra Pacific Builders | Client's own company |
| Supabase | Demo project | Per-client project |
| `prospect_id` | ✅ Captured | ❌ Not needed |
| Success screen | ElevaiteHR pitch | Thank you only |
| Domain | demo.elevaitehr.com | client.elevaitehr.com |
