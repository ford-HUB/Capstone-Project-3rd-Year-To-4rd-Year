# 🏥 UCLM CARES: AI-Enhanced Volunteer & Donation Management

**UCLM CARES** is a professional-grade digital ecosystem designed to revolutionize community service and financial transparency. By integrating AI-driven matching and real-time reporting, it bridges the gap between volunteers, donors, and organizations.

🚀 **Live Application:**  
👉 https://capstone-uclmcares-system.vercel.app

---

## 📝 Project Overview

Developed as a **Capstone Project** for the **University of Cebu Lapu-Lapu Mandaue (UCLM)**, this system automates the manual processes of volunteer coordination and donation tracking.

It ensures that:
- Every contribution is accounted for  
- Every volunteer is matched with meaningful opportunities  
- Organizations gain actionable insights for better decision-making  

---

## ⚡ Key Features

### 🤖 AI-Powered Intelligence
- **Smart Matching**  
  Recommends volunteer events based on user skills, interests, and participation history.

- **Feedback Analysis**  
  Performs sentiment analysis on participant feedback to improve future events.

---

### 📢 Event & Volunteer Management
- **Real-time Attendance**  
  Digital check-in system for live monitoring and verification.

- **Automated Certification**  
  Instantly generates digital certificates after event completion.

- **Volunteer Portal**  
  Personalized dashboard to track service hours, achievements, and impact.

---

### 💰 Donation & Financial Transparency
- **Secure Payment Integration**  
  Enables seamless online donations for community drives.

- **Automated Financial Reporting**  
  Generates real-time transparency reports for fund allocation.

- **Audit Trail**  
  Maintains a secure and traceable record of all transactions.

---

## 🛠️ Technical Stack

| Layer | Technology |
|------|----------|
| **Frontend** | React.js, Vite, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL / supabase (via sequalize ORM) |
| **AI/ML** |  Gemini APi |
| **DevOps** | Docker, Vercel, GitHub Actions |
| **State Management** | zustand |

---

## 📂 Project Structure

```bash
uclmcares/
├── backend/            # Express API, AI Logic, Database Schemas
├── frontend/           # React SPA (Vite), Components, UI
├── docker-compose.yml  # Container setup
├── vercel.json         # Deployment config
├── .env.example        # Environment template
└── package.json        # Root dependencies
