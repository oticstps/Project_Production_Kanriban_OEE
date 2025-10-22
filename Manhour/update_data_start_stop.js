const pool = require("./config/db");

async function syncOneTable(index) {
  const sourceTable = `common_rail_${index}`;
  const targetTable = `${sourceTable}_transit_manhour`;

  const connection = await pool.getConnection();
  try {
    console.log(`\n🚀 Mulai sinkronisasi data dari ${sourceTable}...`);


    const [rows] = await connection.query(`
      SELECT *
      FROM ${sourceTable}
      WHERE status IN ('START', 'STOP')
    `);

    if (rows.length === 0) {
      console.log(`✅ Tidak ada data START/STOP pada ${sourceTable}.`);
      return;
    }

    console.log(`📦 ${sourceTable}: ditemukan ${rows.length} data.`);


    await connection
      .query(`
        ALTER TABLE ${targetTable}
        ADD UNIQUE INDEX IF NOT EXISTS uniq_transit (line_id, status, created_at)
      `)
      .catch(() => {});

    let inserted = 0;

    // --- Loop insert dengan INSERT IGNORE
    for (const row of rows) {
      await connection.query(
        `
        INSERT IGNORE INTO ${targetTable} (
          line_id, pg, line_name, name_product, target, actual,
          loading_time, efficiency, delay, cycle_time, status,
          time_trouble, time_trouble_quality, andon, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [
          row.line_id,
          row.pg,
          row.line_name,
          row.name_product,
          row.target,
          row.actual,
          row.loading_time,
          row.efficiency,
          row.delay,
          row.cycle_time,
          row.status,
          row.time_trouble,
          row.time_trouble_quality,
          row.andon,
          row.created_at,
        ]
      );
      inserted++;
    }

    console.log(`✅ ${sourceTable} selesai — ${inserted} data disalin tanpa duplikat.`);
  } catch (err) {
    console.error(`❌ Gagal sinkronisasi ${sourceTable}:`, err.message);
  } finally {
    connection.release();
  }
}

async function syncAllTables() {
  console.log("=== 🚀 Mulai sinkronisasi semua common_rail_X ===");
  for (let i = 1; i <= 12; i++) {
    await syncOneTable(i);
  }
  console.log("\n✅ Semua tabel sudah disinkronisasi dengan aman.");
}




syncAllTables();
