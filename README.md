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
- ✕ **Remove sites** — clean up anytime

---

## 🛠️ Tech Stack

| Technology | Usage |
|---|---|
| HTML5 | Structure |
| CSS3 | Dark dashboard design, animations |
| JavaScript | Monitor logic, fetch, localStorage |
| Fetch API | HTTP HEAD requests with no-cors |
| localStorage | Persistent site list |

---

## 📁 Project Structure

```
uptime-monitor/
├── index.html
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

**1. CORS restrictions on fetch**
Browsers block cross-origin requests. Used `mode:'no-cors'` — a resolved promise means the server responded, rejected means it's down.

**2. Accurate response time**
Even with opaque no-cors responses, `Date.now()` before and after gives real round-trip latency.

**3. Persistent monitoring**
All site data including history arrays stored in `localStorage` as JSON. On load, saved sites are restored and monitors restart automatically.

**4. Live DOM updates without flicker**
Instead of rebuilding the full list on each check, only the changed elements are updated by ID — no flicker, smooth UI.

---

## 📄 License

MIT

*Made by [Akın Üner](https://github.com/professoralbay)*
