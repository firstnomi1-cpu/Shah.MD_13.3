/**
 * ULRIC-X MD v13.2.1 - Main entry point
 */
require('dotenv').config();
const chalk = require('chalk');
const config = require('./config');
const utils  = require('./lib/utils');
const handler= require('./handler');
const pairMgr= require('./pair');
const { startServer } = require('./server');

// ─── CRASH PROTECTION ───────────────────────────────────────────
process.on('unhandledRejection', (reason, promise) => {
  const ignored = ['Socket connection timeout','EKEYTYPE','item-not-found','rate-overlimit','Connection Closed','Timed Out','Value not found','ECONNRESET','ETIMEDOUT'];
  if (ignored.some(s => String(reason).includes(s))) return;
  console.error(chalk.red('[unhandledRejection]'), reason);
});

process.on('uncaughtException', (error) => {
  const ignored = ['Socket connection timeout','EKEYTYPE','item-not-found','rate-overlimit','Connection Closed','Timed Out','Value not found','ECONNRESET','ETIMEDOUT'];
  if (ignored.some(s => String(error?.message || error).includes(s))) return;
  console.error(chalk.red('[uncaughtException]'), error);
  // Do NOT exit the process for non-fatal errors. Keep the bot running.
});

(async () => {
  try {
    console.clear();
    try { console.log(chalk.cyan(utils.banner())); } catch {}
    console.log(chalk.yellow('═══════════════════════════════════════════════'));
    console.log(chalk.green(`   ${config.BOT_NAME}  -  v${config.BOT_VERSION} (Final Stable)`));
    console.log(chalk.green(`   Owner  : ${config.BOT_OWNER}`));
    console.log(chalk.green(`   Number : ${config.BOT_OWNER_NUM}`));
    console.log(chalk.yellow('═══════════════════════════════════════════════\n'));

    // 1) Load all commands
    const { total, categories } = handler.loadCommands();
    console.log(chalk.green(`[BOOT] ${total} commands loaded in ${categories} categories.`));

    // 2) Start web panel (reads PORT from env automatically)
    startServer();

    // 3) Auto-load all paired sessions (after small delay)
    setTimeout(async () => {
      try {
        console.log(chalk.cyan('[BOOT] Waiting 3s for network to stabilize before loading sessions...'));
        await new Promise(r => setTimeout(r, 3000));
        await pairMgr.autoLoadAllPaired((i, n, jid) => {
          console.log(chalk.blue(`[AUTOLOAD] ${i}/${n}  ${jid}`));
        });
      } catch (e) {
        console.error(chalk.red('[AUTOLOAD] ' + e.message));
      }
    }, 2000);

    // 4) Start watchdog (stability monitor)
    const watchdog = require('./lib/watchdog');
    watchdog.startWatchdog(pairMgr);
    console.log(chalk.green('[BOOT] Watchdog started.'));

    // 5) Periodic keep-alive log
    setInterval(() => {
      const mem = process.memoryUsage();
      console.log(chalk.gray(`[PING] ${new Date().toISOString()} | rss=${utils.formatBytes(mem.rss)} | conns=${pairMgr.getAllConnections().length} | cmds=${handler.getTotalCommands()}`));
    }, 5 * 60 * 1000);

    console.log(chalk.green(`\n[BOOT] ${config.BOT_NAME} v${config.BOT_VERSION} is up. Web panel → http://0.0.0.0:${process.env.PORT || 3000}\n`));
  } catch (e) {
    console.error(chalk.red('[BOOT FATAL] ' + e.message));
    console.error(e.stack);
    process.exit(1);
  }
})();
