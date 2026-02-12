





// backup_database.js - Backup MySQL di Windows (satu file)


const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// === KONFIGURASI DATABASE - SESUAIKAN DENGAN SISTEM ANDA ===
const DB_CONFIG = {
  host: '169.254.33.24',
  user: 'otics_tps',
  password: 'sukatno_ali',       // Ganti dengan password Anda
  database: 'database_tps_core',    // Ganti dengan nama database Anda
  backupDir: './backups'        // Folder penyimpanan backup
};



// Buat folder backup
if (!fs.existsSync(DB_CONFIG.backupDir)) {
  fs.mkdirSync(DB_CONFIG.backupDir, { recursive: true });
}

// Format nama file backup
const now = new Date();
const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
const backupFile = path.join(DB_CONFIG.backupDir, `backup_${DB_CONFIG.database}_${timestamp}.sql`);

// Escape path untuk Windows (gunakan backslash atau raw string aman)
const escapedBackupFile = `"${backupFile}"`;

// Perintah mysqldump
const args = [
  `-h${DB_CONFIG.host}`,
  `-u${DB_CONFIG.user}`,
  `-p${DB_CONFIG.password}`,
  DB_CONFIG.database,
  `>`,
  escapedBackupFile
];

// Di Windows, kita jalankan via 'cmd /c'
const fullCommand = `mysqldump ${args.join(' ')}`;

console.log(`📆 ${now.toLocaleString('id-ID')} | Memulai backup...`);
console.log(`🛠️ Perintah: mysqldump -h${DB_CONFIG.host} -u${DB_CONFIG.user} -p****** ${DB_CONFIG.database} > ${backupFile}`);

// Jalankan di Windows menggunakan cmd
const child = spawn('cmd.exe', ['/c', fullCommand], {
  shell: false,
  windowsHide: false
});

child.on('error', (err) => {
  console.error('❌ Gagal menjalankan perintah:', err.message);
  process.exit(1);
});

child.on('close', (code) => {
  if (code === 0) {
    if (fs.existsSync(backupFile) && fs.statSync(backupFile).size > 0) {
      console.log(`✅ Backup berhasil! File: ${backupFile}`);
      console.log(`📦 Ukuran: ${(fs.statSync(backupFile).size / 1024).toFixed(2)} KB`);
    } else {
      console.error('❌ File backup kosong atau tidak terbentuk.');
      process.exit(1);
    }
  } else {
    console.error(`❌ Backup gagal. Exit code: ${code}`);
    // Jika file terbentuk tapi gagal, hapus file kosong/rusak
    if (fs.existsSync(backupFile)) fs.unlinkSync(backupFile);
    process.exit(1);
  }
});