# NPTEL Introduction to Internet of Things (IoT) — Interactive Exam & Study Portal

A high-performance, dark-mode quiz and exam preparation dashboard for the **NPTEL Online Certification Course: Introduction to Internet of Things** offered by **Indian Institute of Technology (IIT) Kharagpur**.

Designed with **Watermelon UI** minimalist dashboard aesthetics, crisp typography, and instant feedback.

![Preview](https://raw.githubusercontent.com/Harshith1702/nptel-iot/main/preview.png)

---

## ⚡ Features

- **724 Verified Questions**: Complete collection of assignments across 4 major offerings:
  - **Jan–Apr 2024** (Week 0 to Week 12)
  - **July–Dec 2023** (Week 0 to Week 12)
  - **Jan–Apr 2023** (Week 1 to Week 12)
  - **July–Dec 2022** (Week 1 to Week 12, including scanned submissions)
- **Instant Radio Feedback**:
  - Tap any radio option to immediately see **Green (Correct)** or **Red (Incorrect)**.
  - Automatically highlights the correct answer in emerald green.
  - Change answers on the fly without any hassle.
- **Dual Modes**:
  - **Instant / Practice Mode**: Immediate answer checking as you practice.
  - **Exam Simulation Mode**: Conceals answers until you finish and click **Submit & Review Exam**, generating a detailed scorecard with confetti celebrations.
- **Detailed Solutions**:
  - Expandable lecture citations and textbook solutions for every single question.
  - Global "Show All Solutions" toggle.
- **Watermelon UI Dashboard Metrics**:
  - Live completion progress bar.
  - Correct / Incorrect counts.
  - Accuracy percentage badge.
  - Week-by-week pill breakdown with completion status.
- **Search & Bookmarks**:
  - Real-time search for topics like `MQTT`, `CoAP`, `6LoWPAN`, `SDN`, `Raspberry Pi`, `PIR`, etc.
  - Star / Bookmark tricky questions for quick revision (stored locally in browser storage).
- **Zero Database / Server Overhead**: Blazing fast client-side performance that loads in milliseconds.

---

## 🚀 Running Locally

```bash
# Clone the repository
git clone https://github.com/Harshith1702/nptel-iot.git

# Navigate to project directory
cd nptel-iot

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 🌐 Deploy to Vercel

```bash
# Deploy with Vercel CLI
npx vercel --prod
```

Or connect the repository on [Vercel](https://vercel.com) and set the custom domain to `nptel-iot.vercel.app`.
