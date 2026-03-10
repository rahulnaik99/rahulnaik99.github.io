# Rahul Naik — AI/ML Portfolio

Personal portfolio website showcasing AI & financial systems projects. Built as a static site — deploy on **GitHub Pages** and point your GoDaddy domain.

## 🗂️ Structure

```
portfolio/
├── index.html                   ← Main portfolio (homepage)
├── assets/
│   ├── css/theme.css            ← Shared dark/light theme
│   └── js/main.js               ← Theme toggle, nav, animations
└── projects/
    ├── loaniq.html              ← LoanIQ wrapper page
    ├── loaniq-original.html     ← LoanIQ architecture content
    ├── findocqa.html            ← FinDoc QA wrapper page
    ├── findocqa-original.html   ← FinDoc QA content
    ├── finbot.html              ← FinBot wrapper page
    ├── finbot-original.html     ← FinBot content
    ├── wfo-risk.html            ← WFO Risk wrapper page
    ├── wfo-risk-original.html   ← WFO Risk content
    ├── project-evolution.html   ← Journey wrapper page
    └── evolution-original.html  ← Project evolution content
```

## 🚀 Deploy to GitHub Pages

### Step 1: Create GitHub Repo

```bash
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/rahulnaik99/rahulnaik.github.io
git push -u origin main
```

> Your repo is already named `rahulnaik.github.io` so it will be live at `https://rahulnaik.github.io` automatically.

### Step 2: Enable GitHub Pages

1. Go to your repo → **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: `main` / `/ (root)`
4. Click **Save**

Your site will be live at `https://YOUR_USERNAME.github.io` within a few minutes.

---

## 🌐 Connect GoDaddy Domain

### In GitHub (repo Settings → Pages):
- Custom domain is already set to `rahulnaik.info`

### In GoDaddy DNS Manager for `rahulnaik.info`:
Add these **A Records** pointing to GitHub Pages IPs:

| Type | Name | Value |
|------|------|-------|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |

And a **CNAME Record**:

| Type | Name | Value |
|------|------|-------|
| CNAME | www | rahulnaik99.github.io |

### CNAME file (already set):
The `CNAME` file in this repo already contains `rahulnaik.info`. Just push it as-is.

DNS propagation takes 10–30 minutes. GitHub auto-provisions HTTPS/SSL via Let's Encrypt.

---

## ✏️ Customise

- **Contact links**: Edit `index.html` → search for `mailto:rahul@example.com`, `github.com/rahulnaik`, `linkedin.com/in/rahulnaik`
- **Your name / bio**: Edit the about section in `index.html`
- **Stats**: Update the numbers in the stats bar in `index.html`
- **Theme colours**: All in `assets/css/theme.css` CSS variables

## 🎨 Features

- ✅ Dark / Light theme toggle (persists via localStorage)
- ✅ Animated hero with floating particles
- ✅ Project cards with hover effects and colour accents
- ✅ Dedicated pages for each project with shared nav
- ✅ Breadcrumb + project-to-project navigation
- ✅ Fully responsive / mobile-first
- ✅ Zero dependencies — pure HTML/CSS/JS
- ✅ GitHub Pages ready (static, no build step)
