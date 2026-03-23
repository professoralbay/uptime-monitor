# Uptime Monitor

![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

> Real-time website uptime monitor. Add any URL — it gets checked automatically at set intervals. Response time, uptime %, 30-check history, all in a dark terminal dashboard.

---

## 🔴 Live Demo

**[👉 View Live Demo](https://professoralbay.github.io/uptime-monitor)**

---

## 🎬 Demo

![Demo](screenshot.gif)

---

## ✨ Features

- 🌐 **Monitor any URL** — add with one click or Enter key
- ⚡ **Auto intervals** — every 30s, 1min, or 5min
- 📊 **Response time** — real latency in milliseconds
- 📈 **30-check history** — bar chart per site
- 💯 **Uptime %** — calculated from all checks
- 🔴 **Live indicators** — pulsing green/red dots
- 💾 **Persistent** — localStorage, survives refresh
- 📋 **Global status** — header shows all-systems view

---

## 🛠️ Tech Stack

| Technology | Usage |
|---|---|
| HTML5 | Structure |
| CSS3 | Dark dashboard, animations |
| JavaScript | Monitor logic, fetch, localStorage |
| Fetch API | HTTP HEAD requests (no-cors) |
| localStorage | Persistent site list |

---

## 📁 Project Structure

```
uptime-monitor/
├── index.html
├── style.css
├── script.js
├── screenshot.gif
└── README.md
```

---

## 🚀 Getting Started

```bash
git clone https://github.com/professoralbay/uptime-monitor.git
open index.html
```

---

## 🧩 Challenges & How I Solved Them

**1. CORS on fetch**
Used `mode:'no-cors'` — opaque response still means server responded. Rejected promise means down.

**2. Response time with no-cors**
`Date.now()` before/after fetch gives real round-trip time even with opaque responses.

**3. Persistent monitoring**
All data including history arrays stored in `localStorage` as JSON. Monitors restart on page load.

**4. Live updates without flicker**
`renderCard()` updates only changed DOM elements by ID instead of rebuilding the full list.

---

## 📄 License

MIT

*Made by [Akın Üner](https://github.com/professoralbay)*
