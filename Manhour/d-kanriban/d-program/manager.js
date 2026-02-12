const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

class EnergyProgramManager {
  constructor() {
    this.basePath = path.join(__dirname, 'energy');
    this.programs = [
      { name: 'Daily Jetson', file: 'daily_jetson.js', schedule: 'daily' },
      { name: 'Hourly Jetson', file: 'hourly_jetson.js', schedule: 'hourly' },
      { name: 'Migrasi Jetson', file: 'migrasi_jetson.js', schedule: 'manual' },
      { name: 'Migrasi KUB JSON', file: 'migrasi_kub_json.js', schedule: 'manual' },
      { name: 'Shiftly Jetson', file: 'shiftly_jetson.js', schedule: 'shift' },
      { name: 'Weekly Jetson', file: 'weekly_jetson.js', schedule: 'weekly' }
    ];
    this.runningProcesses = new Map();
  }

  // Cek apakah file program ada
  checkProgramExists(filename) {
    const filepath = path.join(this.basePath, filename);
    return fs.existsSync(filepath);
  }

  // Jalankan program tertentu
  runProgram(programName) {
    return new Promise((resolve, reject) => {
      const program = this.programs.find(p => p.file === programName);
      
      if (!program) {
        reject(new Error(`Program ${programName} tidak ditemukan`));
        return;
      }

      if (!this.checkProgramExists(program.file)) {
        reject(new Error(`File ${program.file} tidak ada`));
        return;
      }

      const filepath = path.join(this.basePath, program.file);
      console.log(`[${new Date().toISOString()}] Menjalankan: ${program.name}`);

      const process = spawn('node', [filepath], {
        cwd: this.basePath,
        stdio: 'inherit'
      });

      this.runningProcesses.set(program.file, process);

      process.on('close', (code) => {
        this.runningProcesses.delete(program.file);
        if (code === 0) {
          console.log(`[${new Date().toISOString()}] ✓ ${program.name} selesai`);
          resolve({ success: true, program: program.name, code });
        } else {
          console.error(`[${new Date().toISOString()}] ✗ ${program.name} error (code: ${code})`);
          reject(new Error(`${program.name} exit dengan code ${code}`));
        }
      });

      process.on('error', (err) => {
        this.runningProcesses.delete(program.file);
        console.error(`[${new Date().toISOString()}] Error: ${program.name} - ${err.message}`);
        reject(err);
      });
    });
  }

  // Jalankan semua program secara sekuensial
  async runAll() {
    console.log('=== Memulai Semua Program ===\n');
    const results = [];

    for (const program of this.programs) {
      try {
        const result = await this.runProgram(program.file);
        results.push(result);
      } catch (error) {
        results.push({ success: false, program: program.name, error: error.message });
      }
    }

    console.log('\n=== Ringkasan Eksekusi ===');
    results.forEach(r => {
      const status = r.success ? '✓' : '✗';
      console.log(`${status} ${r.program}`);
    });

    return results;
  }

  // Jalankan program berdasarkan schedule
  async runBySchedule(schedule) {
    const programsToRun = this.programs.filter(p => p.schedule === schedule);
    
    if (programsToRun.length === 0) {
      console.log(`Tidak ada program dengan schedule: ${schedule}`);
      return;
    }

    console.log(`=== Menjalankan Program ${schedule.toUpperCase()} ===\n`);

    for (const program of programsToRun) {
      try {
        await this.runProgram(program.file);
      } catch (error) {
        console.error(`Error pada ${program.name}: ${error.message}`);
      }
    }
  }

  // Tampilkan daftar program
  listPrograms() {
    console.log('=== Daftar Program Energy ===\n');
    this.programs.forEach((prog, idx) => {
      const exists = this.checkProgramExists(prog.file) ? '✓' : '✗';
      console.log(`${idx + 1}. ${prog.name}`);
      console.log(`   File: ${prog.file} ${exists}`);
      console.log(`   Schedule: ${prog.schedule}\n`);
    });
  }

  // Hentikan semua proses yang berjalan
  stopAll() {
    console.log('Menghentikan semua proses...');
    this.runningProcesses.forEach((process, name) => {
      console.log(`Menghentikan: ${name}`);
      process.kill();
    });
    this.runningProcesses.clear();
  }
}

// Fungsi untuk membaca input dari user
function promptUser(question) {
  return new Promise((resolve) => {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    readline.question(question, (answer) => {
      readline.close();
      resolve(answer.trim());
    });
  });
}

// Menu Interaktif
async function showInteractiveMenu() {
  const manager = new EnergyProgramManager();
  
  console.clear();
  console.log('╔════════════════════════════════════════════════╗');
  console.log('║      ENERGY PROGRAM MANAGER - MENU UTAMA       ║');
  console.log('╚════════════════════════════════════════════════╝\n');
  
  console.log('Pilih Program yang akan dijalankan:\n');
  
  manager.programs.forEach((prog, idx) => {
    const exists = manager.checkProgramExists(prog.file) ? '✓' : '✗';
    console.log(`  ${idx + 1}. ${prog.name} ${exists}`);
    console.log(`     └─ ${prog.file} [${prog.schedule}]`);
  });
  
  console.log(`\n  ${manager.programs.length + 1}. Jalankan Semua Program (Sequential)`);
  console.log(`  ${manager.programs.length + 2}. Jalankan Program Harian`);
  console.log(`  ${manager.programs.length + 3}. Jalankan Program Per Jam`);
  console.log(`  ${manager.programs.length + 4}. Jalankan Program Mingguan`);
  console.log(`  ${manager.programs.length + 5}. Jalankan Program Per Shift`);
  console.log(`  0. Keluar`);
  
  console.log('\n' + '─'.repeat(50));
  const choice = await promptUser('Pilih nomor (0-' + (manager.programs.length + 5) + '): ');
  
  const choiceNum = parseInt(choice);
  
  if (isNaN(choiceNum)) {
    console.log('\n❌ Input tidak valid! Masukkan angka.\n');
    await promptUser('Tekan Enter untuk melanjutkan...');
    return showInteractiveMenu();
  }
  
  if (choiceNum === 0) {
    console.log('\n👋 Terima kasih! Program selesai.\n');
    process.exit(0);
  }
  
  console.log('\n' + '═'.repeat(50));
  
  try {
    if (choiceNum >= 1 && choiceNum <= manager.programs.length) {
      // Jalankan program individual
      const program = manager.programs[choiceNum - 1];
      console.log(`\n🚀 Menjalankan: ${program.name}\n`);
      await manager.runProgram(program.file);
      
    } else if (choiceNum === manager.programs.length + 1) {
      // Jalankan semua
      console.log('\n🚀 Menjalankan Semua Program...\n');
      await manager.runAll();
      
    } else if (choiceNum === manager.programs.length + 2) {
      // Harian
      console.log('\n🚀 Menjalankan Program Harian...\n');
      await manager.runBySchedule('daily');
      
    } else if (choiceNum === manager.programs.length + 3) {
      // Per Jam
      console.log('\n🚀 Menjalankan Program Per Jam...\n');
      await manager.runBySchedule('hourly');
      
    } else if (choiceNum === manager.programs.length + 4) {
      // Mingguan
      console.log('\n🚀 Menjalankan Program Mingguan...\n');
      await manager.runBySchedule('weekly');
      
    } else if (choiceNum === manager.programs.length + 5) {
      // Per Shift
      console.log('\n🚀 Menjalankan Program Per Shift...\n');
      await manager.runBySchedule('shift');
      
    } else {
      console.log('\n❌ Pilihan tidak valid!\n');
    }
    
    console.log('\n' + '═'.repeat(50));
    const continueChoice = await promptUser('\nJalankan program lain? (y/n): ');
    
    if (continueChoice.toLowerCase() === 'y' || continueChoice.toLowerCase() === 'yes') {
      return showInteractiveMenu();
    } else {
      console.log('\n👋 Terima kasih! Program selesai.\n');
      process.exit(0);
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    await promptUser('\nTekan Enter untuk kembali ke menu...');
    return showInteractiveMenu();
  }
}

// CLI Interface
async function main() {
  const manager = new EnergyProgramManager();
  const args = process.argv.slice(2);
  const command = args[0];

  // Jika tidak ada argument, tampilkan menu interaktif
  if (!command) {
    return showInteractiveMenu();
  }

  try {
    switch (command) {
      case 'list':
        manager.listPrograms();
        break;

      case 'run':
        const programFile = args[1];
        if (!programFile) {
          console.error('Usage: node manager.js run <program_file>');
          console.log('Contoh: node manager.js run daily_jetson.js');
          process.exit(1);
        }
        await manager.runProgram(programFile);
        break;

      case 'run-all':
        await manager.runAll();
        break;

      case 'schedule':
        const scheduleType = args[1];
        if (!scheduleType) {
          console.error('Usage: node manager.js schedule <daily|hourly|weekly|shift|manual>');
          process.exit(1);
        }
        await manager.runBySchedule(scheduleType);
        break;

      case 'daily':
        await manager.runBySchedule('daily');
        break;

      case 'hourly':
        await manager.runBySchedule('hourly');
        break;

      case 'weekly':
        await manager.runBySchedule('weekly');
        break;

      case 'shift':
        await manager.runBySchedule('shift');
        break;

      case 'menu':
        await showInteractiveMenu();
        break;

      default:
        console.log('Energy Program Manager');
        console.log('======================\n');
        console.log('Usage:');
        console.log('  node manager.js                         - Tampilkan menu interaktif');
        console.log('  node manager.js menu                    - Tampilkan menu interaktif');
        console.log('  node manager.js list                    - Tampilkan daftar program');
        console.log('  node manager.js run <file>              - Jalankan program tertentu');
        console.log('  node manager.js run-all                 - Jalankan semua program');
        console.log('  node manager.js schedule <type>         - Jalankan berdasarkan schedule');
        console.log('  node manager.js daily                   - Jalankan program harian');
        console.log('  node manager.js hourly                  - Jalankan program per jam');
        console.log('  node manager.js weekly                  - Jalankan program mingguan');
        console.log('  node manager.js shift                   - Jalankan program per shift');
        console.log('\nContoh:');
        console.log('  node manager.js');
        console.log('  node manager.js run daily_jetson.js');
        console.log('  node manager.js daily');
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\nMenghentikan program manager...');
  process.exit(0);
});

// Jalankan CLI jika dipanggil langsung
if (require.main === module) {
  main();
}

module.exports = EnergyProgramManager;