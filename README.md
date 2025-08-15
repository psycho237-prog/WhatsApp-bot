# WhatsApp Bot for Railway

A Node.js WhatsApp bot using **whatsapp-web.js**, hosted on **Railway**, with:
- Persistent session storage (no need to scan QR every restart)
- `!save` command to save "View Once" or any media
- `!sticker` command to turn a tagged image into a WhatsApp sticker

---

## 🚀 Deployment on Railway

### 1. Fork or Clone This Repo
You can fork this repo on GitHub or upload the files manually.

### 2. Create a Railway Project
1. Go to [Railway.app](https://railway.app)
2. **New Project → Deploy from GitHub Repo**
3. Select your bot repository

### 3. Enable Persistent Storage
1. In Railway dashboard → Select your bot service
2. Go to **Settings → Volumes → Add Volume**
3. **Mount Path**: `/mnt/data`
4. Deploy the project

---

## 📲 Connecting to WhatsApp
1. Once deployed, go to **Logs** in Railway
2. Wait for the ASCII QR code to appear
3. On your phone:
   - Open **WhatsApp**
   - Go to **Linked Devices**
   - Tap **Link a Device**
   - Scan the QR code from Railway logs
4. Done! Your bot is connected

---

## 💡 Commands

| Command        | Description |
|----------------|-------------|
| `hi`           | Bot replies with a greeting |
| `!save`        | Save "View Once" or any media (send or reply to it) |
| `!sticker`     | Reply to an image and get it as a sticker |

---

## 📂 File Storage
- **Session data**: `/mnt/data/whatsapp_session` (persistent)
- **Saved media**: `/mnt/data/saved_media` (persistent)

---

## ⚠️ Notes
- Do not spam with your bot; WhatsApp may temporarily block your number.
- To reconnect, scan the QR code again if you log out from WhatsApp or delete the Railway volume.
- Saved media stays on Railway unless you delete the volume.

---

## 📜 License
MIT License
