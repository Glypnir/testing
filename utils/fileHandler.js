const fs = require("fs");
const path = require("path");

/**
 * Load data dari file JSON
 * @param {string} filePath - path ke file JSON
 * @returns {Array|Object} data JSON
 */
function readJSON(filePath) {
  try {
    const fullPath = path.resolve(filePath);
    if (!fs.existsSync(fullPath)) return [];
    const data = fs.readFileSync(fullPath, "utf-8");
    return JSON.parse(data || "[]");
  } catch (err) {
    console.error(`Gagal membaca file ${filePath}:`, err);
    return [];
  }
}

/**
 * Simpan data ke file JSON
 * @param {string} filePath - path ke file JSON
 * @param {Array|Object} data - data yang mau disimpan
 */
function writeJSON(filePath, data) {
  try {
    const fullPath = path.resolve(filePath);
    fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error(`Gagal menulis file ${filePath}:`, err);
  }
}

module.exports = { readJSON, writeJSON };
