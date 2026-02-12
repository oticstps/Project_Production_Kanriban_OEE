const pool = require("./config/db_core");

async function cleanDatabase() {
  const connection = await pool.getConnection();

  // daftar kategori tabel
  const categories = [
    "transit_manhour",
    "core",
  ];

  // jumlah line common rail
  const TOTAL_LINE = 12;

  try {
    console.log("🚀 Mulai proses clean database...");
    await connection.beginTransaction();

    for (const category of categories) {
      for (let i = 1; i <= TOTAL_LINE; i++) {
        const tableName = `common_rail_${i}_${category}`;
        const query = `TRUNCATE TABLE ${tableName};`;

        console.log(`🧹 Cleaning: ${tableName}`);
        await connection.query(query);
      }
    }

    await connection.commit();
    console.log("✅ Semua tabel berhasil di-TRUNCATE!");
  } catch (error) {
    await connection.rollback();
    console.error("❌ Gagal membersihkan database:", error.message);
  } finally {
    connection.release();
    process.exit();
  }
}

cleanDatabase();


