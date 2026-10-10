<div align="center">

# 🏛️ NagarSeva — OneTap Civic

**A voice-first, bilingual (Tamil + English) civic complaint management system**

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Leaflet](https://img.shields.io/badge/Leaflet.js-199900?style=flat&logo=leaflet&logoColor=white)
![Status](https://img.shields.io/badge/status-in%20development-orange)

</div>

---

## 📌 Overview

Reporting civic problems like potholes, garbage and water leakage is often slow and difficult, especially for people who are more comfortable in their local language. **NagarSeva** lets citizens report issues by *speaking or typing in Tamil or English*. The system classifies each complaint, detects its urgency, flags duplicate reports, and presents everything to administrators on a dashboard.

This is my final-year B.E. CSE project, extending my earlier mini project **OneTap Civic**.

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🎙️ Voice-first input | Citizens speak their complaint using the Web Speech API |
| 🌐 Bilingual | Tamil and English support |
| 🧠 Smart classification | NLP-based categorisation of complaints |
| 🚨 Priority detection | Sentiment-driven urgency detection, so critical issues surface first |
| 📍 Duplicate detection | Haversine distance matching to catch repeated reports of the same issue |
| 🗺️ Map view | Complaints shown on a map with Leaflet.js |
| 📊 Admin dashboard | Charts (Chart.js) and PDF report export (jsPDF) |

## 🛠 Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript
- **Backend:** Node.js, Express.js
- **Libraries:** Leaflet.js, Chart.js, jsPDF
- **Browser APIs:** Web Speech API

## 📁 Project Structure

```
nagarseva/
├── public/
│   ├── index.html      # Citizen-facing interface
│   ├── admin.html      # Admin dashboard
│   ├── app.js          # Citizen-side logic
│   ├── admin.js        # Admin-side logic
│   └── style.css
├── data/               # Local data files (excluded from the repository)
├── uploads/            # User-uploaded files (excluded from the repository)
├── server.js           # Express server
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v16 or later
- A modern browser (Chrome recommended for voice input)

### Installation and run

```bash
# Clone the repository
git clone https://github.com/Dharshana-NEW/OneTap-civic.git
cd OneTap-civic

# Install dependencies
npm install

# Start the server
node server.js
```

Then open the local address shown in the terminal (usually `http://localhost:3000`) in your browser.

> **Note:** The `data/` and `uploads/` folders are excluded from this repository to protect user and admin information, so you may need to create them locally before the first run.

## 🗺 Roadmap

- [ ] AI-based root cause analysis of recurring complaints
- [ ] Before/after image verification to confirm resolution
- [ ] Python/Flask microservice for advanced NLP
- [ ] Google Cloud Speech-to-Text for improved Tamil voice recognition

## 👤 Author

**Dharshana**
Final-year B.E. CSE, Avinashilingam Institute for Home Science and Higher Education, Coimbatore

[GitHub](https://github.com/Dharshana-NEW)
