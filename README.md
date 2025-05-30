# VibeOps Website

A lean, automation-powered site for founders, consultants, and small businesses who need to move fast, systematize smarter, and launch with swagger.

---

## 🌐 What VibeOps Delivers

- 🚀 Rapid web builds (1-week turnaround standard)  
- 🤖 Built-in automation + AI campaign integrations  
- 📊 CRM syncs, Google Calendar logic, custom dashboards  
- 💬 On-site chatbot powered by **VibeOpsPresidentAI** — your automated sales closer  
- 🔐 Supabase backend for real-time logic and secure data  
- 📱 Fully responsive, mobile-first dark mode design  

---

## 💰 Pricing Structure

### 💻 Website Packages

| Tier               | Price                | Includes                                                                 |
|--------------------|----------------------|--------------------------------------------------------------------------|
| Base Site          | $250–$500 (one-time) | 5 pages, mobile-friendly, domain/hosting, basic SEO                      |
| High-Visual Add-ons| +$150                | Animated menus, custom visuals                                          |
| CRM + Automations  | $800 setup + $30/mo  | Gmail/Calendar sync, follow-ups                                         |
| AI Email Campaigns | $800 setup + $50/mo  | 3 automated campaigns, analytics                                        |

### 🤝 Retainer Options (Software Team-as-a-Service)

| Tier        | Price/Month  | Includes                                                           |
|-------------|--------------|--------------------------------------------------------------------|
| Starter     | $3,000       | 40 hours/mo, 1 dev, coordination                                   |
| Core        | $6,000       | 80 hours/mo, 2 devs, full-stack                                   |
| Full Squad  | $12,000      | 160+ hours/mo, 3–4 specialists, product team & project management |

### 📈 Revenue Share Model

- Minimum $500/month retainer  
- + 20% of net revenue from VibeOps-developed tools  
- *Net revenue = gross receipts minus refunds, fees, chargebacks*

---

## 🤖 VibeOpsPresidentAI

Your embedded AI sales agent that:

- Matches needs to services in real-time  
- Responds with dynamic pricing logic  
- Schedules consults, closes leads  
- Explains automation like a pro — clear, sharp, human  

👉 Book now: [https://calendly.com/vibeops-info/30min](https://calendly.com/vibeops-info/30min)

---

## 🧠 The Team

| Name     | Role                        |
|----------|-----------------------------|
| Zander   | CEO, Client Strategy        |
| Arian    | Engineering CEO             |
| Gabe     | CMO, Brand & Growth         |
| Eric     | CTO, Tech Stack Lead        |
| Felix    | CSO, Biz Dev & Partnerships |
| Sarth    | CFO, Finance Ops            |
| Juan, Johnnie, Hrudai | Programming Team |
| Nolan, Joshua, Kevin | Vancouver Canvassing |
| Carter, Elijah | Minneapolis Canvassing |

---

## 🛠 Tech Stack

- **Frontend**: HTML, CSS, JavaScript  
- **Backend**: Flask, Supabase  
- **Automation**: Google Apps Script, OpenAI API, Make.com  
- **Integrations**: Airtable, Notion, Webflow, Wix Studio  

---

## 📁 Project Structure

site-v1/
├── app.py  
├── static/  
├── templates/  
├── requirements.txt  
└── vercel.json  

---

## 🧪 Setup (Local Dev)

1. **Clone repository and initialize project**
   ```bash
   git clone https://github.com/ZanderDent/vibeops-testing.git
   cd vibeops-testing/site-v1
   ```

2. **Initialize virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # Use ./venv/Scripts/activate on Windows
   ```

3. **Create `.env` file with the following values:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://umonmulcfbtanigsmwsz.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-public-key>

   DATABASE_URL="postgresql://postgres:<password>@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://postgres:<password>@db.umonmulcfbtanigsmwsz.supabase.co:5432/postgres"

   OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   OPENAI_ASSISTANT_ID=asst_k9dUl9nqVgifGntUOdSrEBbN

   FLASK_SECRET_KEY=your-secret-key

   SUPABASE_GOOGLE_CLIENT_ID=your-google-client-id
   SUPABASE_GOOGLE_CLIENT_SECRET=your-google-client-secret
   SUPABASE_GOOGLE_CALLBACK_URL=https://umonmulcfbtanigsmwsz.supabase.co/auth/v1/callback

   SUPABASE_URL=https://umonmulcfbtanigsmwsz.supabase.co
   SUPABASE_KEY=<your-service-role-key>
   ```

4. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

5. **Run the app**
   ```bash
   python app.py
   ```

   App will be available at: http://127.0.0.1:8800

---

## 📝 License

MIT — use freely, vibe responsibly.
