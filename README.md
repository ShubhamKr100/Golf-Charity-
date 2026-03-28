
# ⛳ Digital Heroes: Golf Charity Platform

**Digital Heroes** is a premium subscription-based web application that combines golf performance tracking, monthly prize draws, and charitable giving into a single ecosystem. The platform transforms a golfer's performance into real-world impact.

---

## 🚀 Core Features (PRD Compliant)

### 🏌️ Performance Score Engine

* **Rolling 5 System:** The platform maintains only the latest 5 Stableford scores for each user .
* **Automatic Rotation:** A new score entry automatically replaces the oldest stored score .
* **Strict Validation:** Only scores within the 1–45 range (Stableford format) are accepted .

### 🎗️ Charity & Impact System

* **Guaranteed Contribution:** A minimum of 10% of every subscription is donated to the user’s selected charity.
* **Flexible Control:** Users can voluntarily increase their donation percentage directly from the dashboard.
* **Charity Profiles:** Each charity has a dedicated page featuring descriptions and upcoming golf events .

### 🏆 Admin Draw & Reward Engine

* **Tiered Payouts:** Prize pool distribution follows a 40% (5-Match), 35% (4-Match), and 25% (3-Match) logic .
* **Workflow Tracking:** Winners move through a transparent verification process: Pending → Verified → Paid .
* **Admin Control:** Administrators manage draws and verify payout submissions.

---

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js 14 (App Router), TypeScript |
| **Styling** | Tailwind CSS (Custom Dark UI) |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth (JWT + Middleware) |
| **Deployment** | Vercel |

---

 