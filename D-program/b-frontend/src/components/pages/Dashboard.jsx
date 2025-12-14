import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import axios from 'axios';
import Header from './Header';
import SummaryCards from './SummaryCards';
import DailyConsumption from './DailyConsumption';
import YearlySummary from './YearlySummary';
import EmissionsAndCost from './EmissionsAndCost';

const Dashboard = () => {
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalConsumption, setTotalConsumption] = useState(0);
    const [averageDailyConsumption, setAverageDailyConsumption] = useState(0);
    const [totalShift1, setTotalShift1] = useState(0);
    const [totalShift2, setTotalShift2] = useState(0);
    const [avgShift1, setAvgShift1] = useState(0);
    const [avgShift2, setAvgShift2] = useState(0);
    const [maxShiftValue, setMaxShiftValue] = useState(0);
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [totalCost, setTotalCost] = useState(0);
    const [totalCO2, setTotalCO2] = useState(0);
    const [uniqueDays, setUniqueDays] = useState(0);
    const [monthlySummary, setMonthlySummary] = useState([]);
    const [loadingSummary, setLoadingSummary] = useState(true);
    const [yearlyTotal, setYearlyTotal] = useState(0);
    const [shiftDistribution, setShiftDistribution] = useState([]);
    const [shift1Percent, setShift1Percent] = useState(0);
    const [shift2Percent, setShift2Percent] = useState(0);
    const [efficiencyRatio, setEfficiencyRatio] = useState(0);

    const fetchData = async (month) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://172.27.6.191:3400/api/tb_pershift_kub/month/${month}?db=db_energy_area_compressor`);
            const data = response.data;

            if (!data || data.length === 0) {
                setChartData([]);
                setTotalConsumption(0);
                setAverageDailyConsumption(0);
                setTotalShift1(0);
                setTotalShift2(0);
                setAvgShift1(0);
                setAvgShift2(0);
                setMaxShiftValue(0);
                setTotalCost(0);
                setTotalCO2(0);
                setUniqueDays(0);
                return;
            }

            const groupedData = data.reduce((acc, entry) => {
                const dayKey = `${month.slice(0, 3)} ${entry.day}`;
                const existingEntry = acc.find(item => item.day === dayKey);

                if (existingEntry) {
                    existingEntry[entry.shift] = Number(entry.consumption_energy) || 0;
                } else {
                    acc.push({
                        day: dayKey,
                        shift_1: entry.shift === "shift_1" ? Number(entry.consumption_energy) || 0 : 0,
                        shift_2: entry.shift === "shift_2" ? Number(entry.consumption_energy) || 0 : 0,
                    });
                }
                return acc;
            }, []);

            setChartData(groupedData);

            // Calculate total for each shift
            const shift1Total = groupedData.reduce((sum, item) => sum + item.shift_1, 0);
            const shift2Total = groupedData.reduce((sum, item) => sum + item.shift_2, 0);
            setTotalShift1(shift1Total);
            setTotalShift2(shift2Total);

            // Calculate days with each shift
            const daysWithShift1 = groupedData.filter(item => item.shift_1 > 0).length;
            const daysWithShift2 = groupedData.filter(item => item.shift_2 > 0).length;

            // Calculate average per shift per day (in kWh)
            const avgS1 = daysWithShift1 > 0 ? Math.ceil(shift1Total / daysWithShift1 / 1000) : 0;
            const avgS2 = daysWithShift2 > 0 ? Math.ceil(shift2Total / daysWithShift2 / 1000) : 0;
            setAvgShift1(avgS1);
            setAvgShift2(avgS2);

            // Calculate efficiency ratio (lower is better)
            if (avgS1 > 0 && avgS2 > 0) {
                setEfficiencyRatio(Math.round((avgS1 / avgS2) * 100) / 100);
            }

            // Calculate shift percentages
            const totalShifts = shift1Total + shift2Total;
            if (totalShifts > 0) {
                const s1Percent = Math.round((shift1Total / totalShifts) * 100);
                const s2Percent = 100 - s1Percent;
                setShift1Percent(s1Percent);
                setShift2Percent(s2Percent);
                setShiftDistribution([
                    { name: 'Shift 1', value: shift1Total },
                    { name: 'Shift 2', value: shift2Total }
                ]);
            }

            // Total kWh
            const total = Math.ceil(
                data.reduce((sum, entry) => sum + (Number(entry.consumption_energy) || 0), 0) / 1000
            );
            setTotalConsumption(total);

            // Average daily consumption
            const uniqueDaysCount = new Set(data.map(entry => entry.day)).size;
            setUniqueDays(uniqueDaysCount);
            setAverageDailyConsumption(Math.ceil(total / uniqueDaysCount));

            // Max value
            const maxShift = Math.ceil(
                Math.max(...data.map(entry => (Number(entry.consumption_energy) || 0) / 1000))
            );
            setMaxShiftValue(maxShift);

            // Assuming the cost per kWh is 2092.94 IDR
            const costPerKWh = 2092.94;
            setTotalCost(Math.ceil(total * costPerKWh));

            // Assuming the CO2 emission factor is 0.92 kg CO2 per kWh
            const co2EmissionFactor = 0.92;
            setTotalCO2(total * co2EmissionFactor / 1000);

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllMonthsData = async () => {
        setLoadingSummary(true);
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        try {
            const summaryData = [];
            let total = 0;

            for (const month of months) {
                try {
                    const response = await axios.get(`http://172.27.6.191:3400/api/tb_pershift_kub/month/${month}?db=db_energy_area_compressor`);
                    const data = response.data;

                    // Calculate total consumption for month in kWh
                    const monthlyConsumption = Math.ceil(
                        data.reduce((sum, entry) => sum + (Number(entry.consumption_energy) || 0), 0) / 1000
                    );

                    // Calculate cost
                    const costPerKWh = 2092.94;
                    const monthlyCost = Math.ceil(monthlyConsumption * costPerKWh);

                    // Calculate CO2
                    const co2EmissionFactor = 0.92;
                    const monthlyCO2 = monthlyConsumption * co2EmissionFactor / 1000;

                    summaryData.push({
                        month: month,
                        consumption: monthlyConsumption,
                        cost: monthlyCost,
                        co2: monthlyCO2.toFixed(2)
                    });

                    total += monthlyConsumption;
                } catch (error) {
                    console.error(`Error fetching data for ${month}:`, error);
                    // Add placeholder data for months with errors
                    summaryData.push({
                        month: month,
                        consumption: 0,
                        cost: 0,
                        co2: "0.00"
                    });
                }
            }

            setMonthlySummary(summaryData);
            setYearlyTotal(total);
        } catch (error) {
            console.error('Error fetching monthly summary:', error);
        } finally {
            setLoadingSummary(false);
        }
    };

    useEffect(() => {
        fetchData(selectedMonth);
        fetchAllMonthsData();

        const interval = setInterval(() => {
            fetchData(selectedMonth);
        }, 3600000); // Refresh every hour

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, [selectedMonth]);

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    };

    return (
        <Container fluid className="p-1">
            <Header 
                selectedMonth={selectedMonth} 
                handleMonthChange={handleMonthChange} 
            />

            <SummaryCards 
                totalConsumption={totalConsumption}
                averageDailyConsumption={averageDailyConsumption}
                uniqueDays={uniqueDays}
                totalCO2={totalCO2}
                totalCost={totalCost}
                avgShift1={avgShift1}
                avgShift2={avgShift2}
                shift1Percent={shift1Percent}
                shift2Percent={shift2Percent}
                maxShiftValue={maxShiftValue}
                efficiencyRatio={efficiencyRatio}
                selectedMonth={selectedMonth}
            />

            <EmissionsAndCost 
                totalCO2={totalCO2}
                uniqueDays={uniqueDays}
                totalCost={totalCost}
            />

            <DailyConsumption 
                chartData={chartData}
                loading={loading}
                selectedMonth={selectedMonth}
                fetchData={fetchData}
                totalShift1={totalShift1}
                totalShift2={totalShift2}
            />

            <YearlySummary 
                monthlySummary={monthlySummary}
                loadingSummary={loadingSummary}
                yearlyTotal={yearlyTotal}
                fetchAllMonthsData={fetchAllMonthsData}
            />
        </Container>
    );
};

export default Dashboard;