# 𝐔𝐥𝐫𝐢𝐜 𝐗 𝐌𝐃

## Version: 13.2.1 (Final Stable Release)

## Features

- ✅ WhatsApp Bot with Web Panel
- ✅ Multi-User Pairing (Pair Code System)
- ✅ Real WhatsApp Push Notifications
- ✅ Enterprise Session Persistence (No Re-Login)
- ✅ 1659+ Commands
- ✅ Verified WhatsApp ✅ Tick on All Replies
- ✅ Anti-Delete + Anti-Edit System
- ✅ Pre-Defined Instant Menus
- ✅ Dual Prefix Support (. and /)
- ✅ Connected SMS with Image
- ✅ Channel Integration
- ✅ Admin Panel with Live Data
- ✅ Auto-Reconnect System (Exponential Backoff)
- ✅ Robust 515 Stream Error Recovery
- ✅ Complete Crash Protection

## Installation

```bash
npm install
node index.js
```

## Pairing

1. Open web panel (`http://localhost:3000`)
2. Enter WhatsApp number with country code
3. Click "Get Pair Code"
4. Enter code in WhatsApp → Linked Devices → Link with phone number

## Session Management

- Sessions auto-save to `sessions/` directory
- Auto-restore on bot restart
- Session integrity verification
- Prevents corrupted sessions
- 515 Stream Error recovery without session loss

## Commands

```
.menu       → Main Menu
.allmenu    → All Commands
.test       → Test Commands Work
.ping       → Speed Test
.alive      → Bot Status
.owner      → Owner Info
.channel    → Channel Info
.anti mode on → Enable Anti-Delete + Anti-Edit
```

## Deployment

### Railway (Recommended)

1. Push to GitHub
2. Go to https://railway.app → Login with GitHub
3. New Project → Deploy from GitHub repo
4. Add Variables:
   ```
   ADMIN_PASS=ulricx_admin_2024
   SESSION_SECRET=random_string
   MAX_PAIR_USERS=1000
   ```
5. Settings → Volumes → Add Volume at `/app/sessions` (1 GB)
6. Settings → Networking → Generate Domain
7. Open URL → Pair WhatsApp → Send `.menu`

### Docker

```bash
docker-compose up -d
```

### PM2

```bash
npm install
pm2 start ecosystem.config.js
```

## Troubleshooting

- **Bot not responding?** Check if `.menu` works. If not, check logs for `[RAW] messages.upsert`.
- **Login stuck?** The 515 recovery system will automatically retry. Wait 1-2 minutes.
- **Dashboard shows Offline?** Ensure `connection.update` fires `open` event. Check logs for `[PAIR] ✅ CONNECTED`.

## Requirements

- Node.js 18+
- npm
- Persistent Storage (for sessions)

## Update Notes (v13.2.1)

- Fixed "Logging In..." stuck issue with robust 515 Stream Error recovery
- Implemented shared state object for all event handlers
- Added exponential backoff for reconnects (5s, 10s, 20s, 40s)
- Enhanced crash protection (uncaughtException, unhandledRejection)
- Improved dashboard status sync
- Optimized memory usage and GC
- Cleaned up dead code and race conditions

## Stable Release Notes

This version represents the most stable release of ULRIC-X MD. All known connection issues, session persistence bugs, and command execution failures have been resolved. The bot is now production-ready with enterprise-level reliability.

## Credit

Credit goes to Ulric-X Mister Shah
