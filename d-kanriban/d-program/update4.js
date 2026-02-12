const pool = require('./config/db_core');

async function getBaseDataCommonRail12(sourceTable) {
    const targetTable = `${sourceTable}_core`;
    const connection = await pool.getConnection();

    try {
        console.log(`\n🚀 Ambil data dari ${targetTable}...`);

        const [rows] = await connection.query(
            `
            SELECT *
            FROM \`${targetTable}\`
            WHERE created_at BETWEEN ? AND ?
            ORDER BY created_at DESC
            `,
            ['2025-12-24 00:00:00', '2025-12-26 23:59:59']
        );



        if (rows.length === 0) {
            console.log(`✅ Tidak ada data pada ${targetTable}.`);
            return;
        }
        console.log(`📦 Total data: ${rows.length}\n`);
        console.table(rows);
    } catch (err) {
        console.error(`❌ Error:`, err.message);
    } finally {
        connection.release();
    }
}

getBaseDataCommonRail12('common_rail_12');
