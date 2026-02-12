const EnergyModelPlant2 = require('../models/EnergyModelPlant2');

class EnergyController {
    static async getDashboardData(req, res) {
        try {
            const summary = await EnergyModelPlant2.getSummary();
            const reports = await EnergyModelPlant2.getLatestReport();

            // Format data untuk frontend
            const formattedData = reports.map(r => ({
                date: r.shift_date,
                shift: r.shift === '1' ? 'Shift 1' : 'Shift 2',
                wh: parseFloat(r.wh) || 0,
                delta_wh: r.delta_wh || 0,
                datetime: r.record_datetime
            }));

            // Hitung total cost (contoh: Rp 1.300 per kWh)
            const costPerKwh = 1300;
            const totalCost = Math.round(summary.total_energy * costPerKwh);

            // Hitung CO2 (contoh: 0.5 kg/kWh)
            const co2PerKwh = 0.5;
            const totalCo2 = parseFloat((summary.total_energy * co2PerKwh).toFixed(1));
            const avgCo2 = parseFloat((summary.avg_daily * co2PerKwh).toFixed(1));

            res.json({
                success: true,
                data: {
                    totalEnergy: Math.round(summary.total_energy),
                    totalCost: totalCost,
                    avgDaily: Math.round(summary.avg_daily),
                    maxShiftValue: Math.round(summary.max_shift_value),
                    totalCO2: totalCo2,
                    avgDailyCO2: avgCo2,
                    shiftUsage: formattedData
                }
            });

        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
}

module.exports = EnergyController;