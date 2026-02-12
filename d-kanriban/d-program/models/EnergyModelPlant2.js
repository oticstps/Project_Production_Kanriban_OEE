const pool = require('../config/db_core');

class EnergyModelPlant2 {
    static async getLatestReport() {
        const [rows] = await pool.execute(`
            SELECT 
                shift,
                shift_date,
                wh,
                delta_wh,
                record_datetime
            FROM tb_kub_plant2_report
            ORDER BY shift_date DESC, shift ASC
            LIMIT 20; -- Ambil 20 hari terakhir untuk grafik
        `);
        return rows;
    }

    static async getSummary() {
        const [rows] = await pool.execute(`
            SELECT 
                SUM(delta_wh) AS total_energy,
                COUNT(*) AS total_days,
                AVG(delta_wh) AS avg_daily,
                MAX(delta_wh) AS max_shift_value
            FROM tb_kub_plant2_report
            WHERE delta_wh IS NOT NULL;
        `);
        return rows[0];
    }
}

module.exports = EnergyModelPlant2;