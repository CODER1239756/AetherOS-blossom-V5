# AetherOS 🌸 Blossom Edition v5.0

A personal digital universe — pink, white & red girly OS experience running entirely in the browser.

## 🚀 Deploy to GitHub Pages

1. Upload all files to a new GitHub repository (keep folder structure intact)
2. Go to **Settings → Pages**
3. Set Source to **Deploy from a branch → main → / (root)**
4. Your OS will be live at `https://yourusername.github.io/your-repo-name/`

## 📁 Project Structure

```
AetherOS/
├── index.html              ← Entry point
├── .nojekyll               ← Required for GitHub Pages
├── styles/
│   ├── base.css
│   ├── animations.css
│   ├── components.css
│   └── apps.css
└── js/
    ├── utils.js
    ├── dbmms.js
    ├── themes.js
    ├── aurora.js
    ├── core.js
    ├── wm.js
    ├── dock.js
    └── apps/
        ├── terminal.js     ← Shell + Kali Linux ethical security desktop
        ├── gallery.js      ← Upload-based photo gallery
        ├── profile.js      ← User auth + posts + cloud sync
        ├── settings.js     ← Themes, colour dial, wallpaper, cloud
        ├── music.js
        ├── files.js
        ├── misc.js
        └── main.js
```

## 🔐 Lock Screen
PIN: `1234` — or just click anywhere

## 🌸 Features
- **Pink / White / Red** girly theme with 5 presets + scroll colour dial
- **Liquid Glass Dock** — Apple-style frosted glass with magnification
- **Kali Linux Desktop** — Ethical security tools (Nmap, Wireshark, Metasploit, etc.)
- **Gallery** — Upload your own photos (drag & drop), no placeholder images
- **DBMMS Cloud Sync** — Posts and images sync across devices via your HTTPS server
- **Blossom AI** — Personal assistant panel
- **13 built-in apps** — Terminal, Notes, Music, Files, Browser, Calendar, Code Editor, and more

## ☁ Cloud Sync Setup
In **Settings → Cloud**, enter your server URL. Your server needs:
- `POST /sync` — receive and store records
- `GET /user/:uid` — return user data on login from a new device

## ⚖ Kali Linux Mode
Type `kali` in Terminal. All security tools are simulated for **ethical, educational use only**.
Always obtain written permission before testing any system you do not own.
