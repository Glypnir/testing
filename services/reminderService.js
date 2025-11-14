const fs = require("fs");
const path = require("path");
const schedule = require("node-schedule");
const { sendReminderEmail } = require("./gmailService");

const usersFile = path.join(__dirname, "../data/users.json");

/**
 * Load semua user dari JSON
 */
function loadUsers() {
  const data = fs.readFileSync(usersFile, "utf-8");
  return JSON.parse(data);
}

/**
 * Cek apakah target aktif minggu ini
 */
function isTargetActive(weekDate) {
  const today = new Date();
  const targetDate = new Date(weekDate);

  // Minggu ini dari Minggu–Sabtu
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  return targetDate >= weekStart && targetDate <= weekEnd;
}

/**
 * Kirim reminder ke user
 */
function sendReminders() {
  const users = loadUsers();

  users.forEach(user => {
    const activeTargets = user.targets?.filter(t => isTargetActive(t.week)) || [];

    if (activeTargets.length > 0) {
      const targetList = activeTargets.map(t => `- ${t.title}`).join("\n");
      const message = `Hai ${user.name}!\nIni pengingat untuk target belajar minggu ini:\n${targetList}`;
      sendReminderEmail(user.email, "Pengingat Belajar Mingguan", message);
    }
  });
}

/**
 * Start scheduler job
 */
function start() {
  console.log("Reminder service started.");

  // Schedule setiap hari jam 09:00
  schedule.scheduleJob("0 9 * * *", () => {
    console.log("Mengirim reminder belajar mingguan...");
    sendReminders();
  });
}

module.exports = { start, sendReminders };
