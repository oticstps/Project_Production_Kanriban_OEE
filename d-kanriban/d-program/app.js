// =============================================================================================================================
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pool = require('./config/db_core');
const authRoutes = require('./routes/auth');
const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());

// Middleware logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Route dasar
app.get('/', (req, res) => {
  res.json({ 
    message: 'API is running...',
    endpoints: {
      energy: '/api/energy/pm-monthly-report',
      test: '/api/test'
    }
  });
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Test route works!', 
    timestamp: new Date(),
    environment: process.env.NODE_ENV 
  });
});

// Import routes
const commonRailRoutesCr1 = require("./routes/commonRailRoutesCr1");
const commonRailRoutesCr2 = require("./routes/commonRailRoutesCr2");
const commonRailRoutesCr3 = require("./routes/commonRailRoutesCr3");
const commonRailRoutesCr4 = require("./routes/commonRailRoutesCr4");
const commonRailRoutesCr5 = require("./routes/commonRailRoutesCr5");
const commonRailRoutesCr6 = require("./routes/commonRailRoutesCr6");
const commonRailRoutesCr7 = require("./routes/commonRailRoutesCr7");
const commonRailRoutesCr8 = require("./routes/commonRailRoutesCr8");
const commonRailRoutesCr9 = require("./routes/commonRailRoutesCr9");
const commonRailRoutesCr10 = require("./routes/commonRailRoutesCr10");
const commonRailRoutesCr11 = require("./routes/commonRailRoutesCr11");
const commonRailRoutesCr12 = require("./routes/commonRailRoutesCr12");

const tableRoute = require('./routes/table.route');
const manhourRoutes = require('./routes/manhourRoutes');
const productionRoutes = require("./routes/productionRoutes");
const energyElectricalRoutesMonthly = require("./routes/energyElectricalRoutesMonthly");
const tb_kub1_active_power = require('./routes/tb_kub1_active_power');
const tb_kub1_total_kwh = require('./routes/tb_kub1_total_kwh');

const tb_pm_hourly_kwh = require('./routes/tb_pm_hourly_report');
const tb_pm_shiftly_kwh = require('./routes/tb_pm_shiftly_report');
const tb_pm_daily_kwh = require('./routes/tb_pm_daily_report');
const tb_pm_weekly_kwh = require('./routes/tb_pm_weekly_report');
const tb_pm_monthly_kwh = require('./routes/tb_pm_monthly_report');
const tb_pm_monthly_kub_kwh = require('./routes/tb_pm_monthly_kub_report');
const tb_pm_shiftly_kub_kwh = require('./routes/tb_pm_shiftly_kub_report');

const energyRoutesPlant2 = require('./routes/energyRoutesPlant2');
const manhourBreakdown = require('./routes/manhourBreakdown');
const trialCommonRail9 = require('./routes/trialCommonRail9Route')

const commonRail1FilteredRoutes = require('./routes/commonRail1FilteredRoutes');
const commonRail2FilteredRoutes = require('./routes/commonRail2FilteredRoutes');
const commonRail3FilteredRoutes = require('./routes/commonRail3FilteredRoutes');
const commonRail4FilteredRoutes = require('./routes/commonRail4FilteredRoutes');
const commonRail5FilteredRoutes = require('./routes/commonRail5FilteredRoutes');
const commonRail6FilteredRoutes = require('./routes/commonRail6FilteredRoutes');
const commonRail7FilteredRoutes = require('./routes/commonRail7FilteredRoutes');
const commonRail8FilteredRoutes = require('./routes/commonRail8FilteredRoutes');
const commonRail9FilteredRoutes = require('./routes/commonRail9FilteredRoutes');
const commonRail10FilteredRoutes = require('./routes/commonRail10FilteredRoutes');
const commonRail11FilteredRoutes = require('./routes/commonRail11FilteredRoutes');
const commonRail12FilteredRoutes = require('./routes/commonRail12FilteredRoutes');

// Use routes
app.use("/api/auth", authRoutes);
app.use("/apiCr1", commonRailRoutesCr1);
app.use("/apiCr2", commonRailRoutesCr2);
app.use("/apiCr3", commonRailRoutesCr3);
app.use("/apiCr4", commonRailRoutesCr4);
app.use("/apiCr5", commonRailRoutesCr5);
app.use("/apiCr6", commonRailRoutesCr6);
app.use("/apiCr7", commonRailRoutesCr7);
app.use("/apiCr8", commonRailRoutesCr8);
app.use("/apiCr9", commonRailRoutesCr9);
app.use("/apiCr10", commonRailRoutesCr10);
app.use("/apiCr11", commonRailRoutesCr11);
app.use("/apiCr12", commonRailRoutesCr12);

app.use('/all', tableRoute);
app.use('/api/manhour', manhourRoutes);
app.use("/api/productions", productionRoutes);
app.use("/api/energy", energyElectricalRoutesMonthly);
app.use("/api/kub1-active-power", tb_kub1_active_power);
app.use("/api/kub1-total-kwh", tb_kub1_total_kwh);

app.use("/api/pm-hourly-kwh", tb_pm_hourly_kwh);
app.use("/api/pm-shiftly-kwh", tb_pm_shiftly_kwh);
app.use("/api/pm-daily-kwh", tb_pm_daily_kwh);
app.use("/api/pm-weekly-kwh", tb_pm_weekly_kwh);
app.use("/api/pm-monthly-kwh", tb_pm_monthly_kwh);
app.use("/api/pm-monthly-kub-kwh", tb_pm_monthly_kub_kwh);
app.use("/api/pm-shiftly-kub-kwh", tb_pm_shiftly_kub_kwh);

app.use('/api', energyRoutesPlant2);
app.use('/api/common-rail', manhourBreakdown);
app.use("/api/trial", trialCommonRail9);

// PERBAIKAN: Rute yang salah di kode asli
app.use("/api/common-rail-1-filtered", commonRail1FilteredRoutes);
app.use("/api/common-rail-2-filtered", commonRail2FilteredRoutes);
app.use("/api/common-rail-3-filtered", commonRail3FilteredRoutes);
app.use("/api/common-rail-4-filtered", commonRail4FilteredRoutes);
app.use("/api/common-rail-5-filtered", commonRail5FilteredRoutes);
app.use("/api/common-rail-6-filtered", commonRail6FilteredRoutes);
app.use("/api/common-rail-7-filtered", commonRail7FilteredRoutes);
app.use("/api/common-rail-8-filtered", commonRail8FilteredRoutes);
app.use("/api/common-rail-9-filtered", commonRail9FilteredRoutes);
// PERBAIKAN: Rute 10, 11, 12 yang sebelumnya salah
app.use("/api/common-rail-10-filtered", commonRail10FilteredRoutes);
app.use("/api/common-rail-11-filtered", commonRail11FilteredRoutes);
app.use("/api/common-rail-12-filtered", commonRail12FilteredRoutes);

// 404 handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
    requestedUrl: req.originalUrl,
    availableEndpoints: [
      // Basic routes
      '/',
      '/api/test',
      'trial/trialcr9',

      // Auth routes
      '/api/auth/register',
      '/api/auth/login',
      '/api/auth/profile',

      // Common Rail routes (Cr1-Cr12) - PERBAIKAN: Semua menggunakan id_uuid sekarang
      '/apiCr1/cr1',
      '/apiCr1/cr1Stop',
      '/apiCr1/cr1/:id',
      '/apiCr2/cr2',
      '/apiCr2/cr2Stop',
      '/apiCr2/cr2/:id',
      '/apiCr3/cr3',
      '/apiCr3/cr3Stop',
      '/apiCr3/cr3/:id',
      '/apiCr4/cr4',
      '/apiCr4/cr4Stop',
      '/apiCr4/cr4/:id',
      '/apiCr5/cr5',
      '/apiCr5/cr5Stop',
      '/apiCr5/cr5/:id',
      '/apiCr6/cr6',
      '/apiCr6/cr6Stop',
      '/apiCr6/cr6/:id',
      '/apiCr7/cr7',
      '/apiCr7/cr7Stop',
      '/apiCr7/cr7/:id',
      '/apiCr8/cr8',
      '/apiCr8/cr8Stop',
      '/apiCr8/cr8/:id',
      '/apiCr9/cr9',
      '/apiCr9/cr9Stop',
      '/apiCr9/cr9/:id',
      '/apiCr10/cr10',
      '/apiCr10/cr10Stop',
      '/apiCr10/cr10/:id',
      '/apiCr11/cr11',
      '/apiCr11/cr11Stop',
      '/apiCr11/cr11/:id',
      '/apiCr12/cr12',
      '/apiCr12/cr12Stop',
      '/apiCr12/cr12/:id',

      // Table route
      '/all/table/:table',

      // Manhour routes
      '/api/manhour',
      '/api/manhour/:id',

      // Production routes
      '/api/productions',
      '/api/productions/:id',

      // Common Rail 1 Filtered routes
      '/api/common-rail-1-filtered',
      '/api/common-rail-1-filtered/latest',
      '/api/common-rail-1-filtered/date/:date',
      '/api/common-rail-1-filtered/datetime-range?startDateTime=YYYY-MM-DD HH:MM:SS&endDateTime=YYYY-MM-DD HH:MM:SS',
      '/api/common-rail-1-filtered/time-range?date=YYYY-MM-DD&startTime=HH:MM&endTime=HH:MM',
      '/api/common-rail-1-filtered/multi-days-time-range?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&startTime=HH:MM&endTime=HH:MM',
      '/api/common-rail-1-filtered/filter?startDateTime=&endDateTime=&date=&status=&line_id=&pg=&name_product=&limit=',
      '/api/common-rail-1-filtered/paginated?page=1&limit=50&startDateTime=&endDateTime=&status=',
      '/api/common-rail-1-filtered/hourly-stats/:date',

      // Common Rail 2 Filtered routes
      '/api/common-rail-2-filtered',
      '/api/common-rail-2-filtered/latest',
      '/api/common-rail-2-filtered/date/:date',
      '/api/common-rail-2-filtered/datetime-range?startDateTime=YYYY-MM-DD HH:MM:SS&endDateTime=YYYY-MM-DD HH:MM:SS',
      '/api/common-rail-2-filtered/time-range?date=YYYY-MM-DD&startTime=HH:MM&endTime=HH:MM',
      '/api/common-rail-2-filtered/multi-days-time-range?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&startTime=HH:MM&endTime=HH:MM',
      '/api/common-rail-2-filtered/filter?startDateTime=&endDateTime=&date=&status=&line_id=&pg=&name_product=&limit=',
      '/api/common-rail-2-filtered/paginated?page=1&limit=50&startDateTime=&endDateTime=&status=',
      '/api/common-rail-2-filtered/hourly-stats/:date',

      // Common Rail 3 Filtered routes
      '/api/common-rail-3-filtered',
      '/api/common-rail-3-filtered/latest',
      '/api/common-rail-3-filtered/date/:date',
      '/api/common-rail-3-filtered/datetime-range?startDateTime=YYYY-MM-DD HH:MM:SS&endDateTime=YYYY-MM-DD HH:MM:SS',
      '/api/common-rail-3-filtered/time-range?date=YYYY-MM-DD&startTime=HH:MM&endTime=HH:MM',
      '/api/common-rail-3-filtered/multi-days-time-range?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&startTime=HH:MM&endTime=HH:MM',
      '/api/common-rail-3-filtered/filter?startDateTime=&endDateTime=&date=&status=&line_id=&pg=&name_product=&limit=',
      '/api/common-rail-3-filtered/paginated?page=1&limit=50&startDateTime=&endDateTime=&status=',
      '/api/common-rail-3-filtered/hourly-stats/:date',

      // Common Rail 4 Filtered routes
      '/api/common-rail-4-filtered',
      '/api/common-rail-4-filtered/latest',
      '/api/common-rail-4-filtered/date/:date',
      '/api/common-rail-4-filtered/datetime-range?startDateTime=YYYY-MM-DD HH:MM:SS&endDateTime=YYYY-MM-DD HH:MM:SS',
      '/api/common-rail-4-filtered/time-range?date=YYYY-MM-DD&startTime=HH:MM&endTime=HH:MM',
      '/api/common-rail-4-filtered/multi-days-time-range?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&startTime=HH:MM&endTime=HH:MM',
      '/api/common-rail-4-filtered/filter?startDateTime=&endDateTime=&date=&status=&line_id=&pg=&name_product=&limit=',
      '/api/common-rail-4-filtered/paginated?page=1&limit=50&startDateTime=&endDateTime=&status=',
      '/api/common-rail-4-filtered/hourly-stats/:date',

      // Common Rail 5 Filtered routes
      '/api/common-rail-5-filtered',
      '/api/common-rail-5-filtered/latest',
      '/api/common-rail-5-filtered/date/:date',
      '/api/common-rail-5-filtered/datetime-range?startDateTime=YYYY-MM-DD HH:MM:SS&endDateTime=YYYY-MM-DD HH:MM:SS',
      '/api/common-rail-5-filtered/time-range?date=YYYY-MM-DD&startTime=HH:MM&endTime=HH:MM',
      '/api/common-rail-5-filtered/multi-days-time-range?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&startTime=HH:MM&endTime=HH:MM',
      '/api/common-rail-5-filtered/filter?startDateTime=&endDateTime=&date=&status=&line_id=&pg=&name_product=&limit=',
      '/api/common-rail-5-filtered/paginated?page=1&limit=50&startDateTime=&endDateTime=&status=',
      '/api/common-rail-5-filtered/hourly-stats/:date',

      // Common Rail 6 Filtered routes
      '/api/common-rail-6-filtered',
      '/api/common-rail-6-filtered/latest',
      '/api/common-rail-6-filtered/date/:date',
      '/api/common-rail-6-filtered/datetime-range?startDateTime=YYYY-MM-DD HH:MM:SS&endDateTime=YYYY-MM-DD HH:MM:SS',
      '/api/common-rail-6-filtered/time-range?date=YYYY-MM-DD&startTime=HH:MM&endTime=HH:MM',
      '/api/common-rail-6-filtered/multi-days-time-range?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&startTime=HH:MM&endTime=HH:MM',
      '/api/common-rail-6-filtered/filter?startDateTime=&endDateTime=&date=&status=&line_id=&pg=&name_product=&limit=',
      '/api/common-rail-6-filtered/paginated?page=1&limit=50&startDateTime=&endDateTime=&status=',
      '/api/common-rail-6-filtered/hourly-stats/:date',

      // Common Rail 7 Filtered routes
      '/api/common-rail-7-filtered',
      '/api/common-rail-7-filtered/latest',
      '/api/common-rail-7-filtered/date/:date',
      '/api/common-rail-7-filtered/datetime-range?startDateTime=YYYY-MM-DD HH:MM:SS&endDateTime=YYYY-MM-DD HH:MM:SS',
      '/api/common-rail-7-filtered/time-range?date=YYYY-MM-DD&startTime=HH:MM&endTime=HH:MM',
      '/api/common-rail-7-filtered/multi-days-time-range?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&startTime=HH:MM&endTime=HH:MM',
      '/api/common-rail-7-filtered/filter?startDateTime=&endDateTime=&date=&status=&line_id=&pg=&name_product=&limit=',
      '/api/common-rail-7-filtered/paginated?page=1&limit=50&startDateTime=&endDateTime=&status=',
      '/api/common-rail-7-filtered/hourly-stats/:date',

      // Common Rail 8 Filtered routes
      '/api/common-rail-8-filtered',
      '/api/common-rail-8-filtered/latest',
      '/api/common-rail-8-filtered/date/:date',
      '/api/common-rail-8-filtered/datetime-range?startDateTime=YYYY-MM-DD HH:MM:SS&endDateTime=YYYY-MM-DD HH:MM:SS',
      '/api/common-rail-8-filtered/time-range?date=YYYY-MM-DD&startTime=HH:MM&endTime=HH:MM',
      '/api/common-rail-8-filtered/multi-days-time-range?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&startTime=HH:MM&endTime=HH:MM',
      '/api/common-rail-8-filtered/filter?startDateTime=&endDateTime=&date=&status=&line_id=&pg=&name_product=&limit=',
      '/api/common-rail-8-filtered/paginated?page=1&limit=50&startDateTime=&endDateTime=&status=',
      '/api/common-rail-8-filtered/hourly-stats/:date',

      // Common Rail 9 Filtered routes
      '/api/common-rail-9-filtered',
      '/api/common-rail-9-filtered/latest',
      '/api/common-rail-9-filtered/date/:date',
      '/api/common-rail-9-filtered/datetime-range?startDateTime=YYYY-MM-DD HH:MM:SS&endDateTime=YYYY-MM-DD HH:MM:SS',
      '/api/common-rail-9-filtered/time-range?date=YYYY-MM-DD&startTime=HH:MM&endTime=HH:MM',
      '/api/common-rail-9-filtered/multi-days-time-range?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&startTime=HH:MM&endTime=HH:MM',
      '/api/common-rail-9-filtered/filter?startDateTime=&endDateTime=&date=&status=&line_id=&pg=&name_product=&limit=',
      '/api/common-rail-9-filtered/paginated?page=1&limit=50&startDateTime=&endDateTime=&status=',
      '/api/common-rail-9-filtered/hourly-stats/:date',

      // Common Rail 10 Filtered routes
      '/api/common-rail-10-filtered',
      '/api/common-rail-10-filtered/latest',
      '/api/common-rail-10-filtered/date/:date',
      '/api/common-rail-10-filtered/datetime-range?startDateTime=YYYY-MM-DD HH:MM:SS&endDateTime=YYYY-MM-DD HH:MM:SS',
      '/api/common-rail-10-filtered/time-range?date=YYYY-MM-DD&startTime=HH:MM&endTime=HH:MM',
      '/api/common-rail-10-filtered/multi-days-time-range?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&startTime=HH:MM&endTime=HH:MM',
      '/api/common-rail-10-filtered/filter?startDateTime=&endDateTime=&date=&status=&line_id=&pg=&name_product=&limit=',
      '/api/common-rail-10-filtered/paginated?page=1&limit=50&startDateTime=&endDateTime=&status=',
      '/api/common-rail-10-filtered/hourly-stats/:date',

      // Common Rail 11 Filtered routes
      '/api/common-rail-11-filtered',
      '/api/common-rail-11-filtered/latest',
      '/api/common-rail-11-filtered/date/:date',
      '/api/common-rail-11-filtered/datetime-range?startDateTime=YYYY-MM-DD HH:MM:SS&endDateTime=YYYY-MM-DD HH:MM:SS',
      '/api/common-rail-11-filtered/time-range?date=YYYY-MM-DD&startTime=HH:MM&endTime=HH:MM',
      '/api/common-rail-11-filtered/multi-days-time-range?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&startTime=HH:MM&endTime=HH:MM',
      '/api/common-rail-11-filtered/filter?startDateTime=&endDateTime=&date=&status=&line_id=&pg=&name_product=&limit=',
      '/api/common-rail-11-filtered/paginated?page=1&limit=50&startDateTime=&endDateTime=&status=',
      '/api/common-rail-11-filtered/hourly-stats/:date',

      // Common Rail 12 Filtered routes
      '/api/common-rail-12-filtered',
      '/api/common-rail-12-filtered/latest',
      '/api/common-rail-12-filtered/date/:date',
      '/api/common-rail-12-filtered/datetime-range?startDateTime=YYYY-MM-DD HH:MM:SS&endDateTime=YYYY-MM-DD HH:MM:SS',
      '/api/common-rail-12-filtered/time-range?date=YYYY-MM-DD&startTime=HH:MM&endTime=HH:MM',
      '/api/common-rail-12-filtered/multi-days-time-range?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&startTime=HH:MM&endTime=HH:MM',
      '/api/common-rail-12-filtered/filter?startDateTime=&endDateTime=&date=&status=&line_id=&pg=&name_product=&limit=',
      '/api/common-rail-12-filtered/paginated?page=1&limit=50&startDateTime=&endDateTime=&status=',
      '/api/common-rail-12-filtered/hourly-stats/:date',

      // Energy routes
      '/api/energy/pm-monthly-report',
      '/api/energy/pm-monthly-report/id/:id',
      '/api/energy/pm-monthly-report/type/:type',
      '/api/energy/pm-monthly-report/line/:line',
      '/api/energy/pm-monthly-report/month/:month/year/:year',
      '/api/energy/pm-monthly-report/date-range',

      // KUB1 Active Power routes
      '/api/kub1-active-power',
      '/api/kub1-active-power/:id',
      '/api/kub1-active-power/date-range',
      '/api/kub1-active-power/shift/:shift',
      '/api/kub1-active-power/power-meter/:power_meter',

      // KUB1 Total KWH routes
      '/api/kub1-total-kwh',
      '/api/kub1-total-kwh/:id',
      '/api/kub1-total-kwh/date-range',
      '/api/kub1-total-kwh/shift/:shift',
      '/api/kub1-total-kwh/power-meter/:power_meter',

      // PM Hourly KWH routes
      '/api/pm-hourly-kwh',
      '/api/pm-hourly-kwh/:id',
      '/api/pm-hourly-kwh/date-range',
      '/api/pm-hourly-kwh/shift/:shift',
      '/api/pm-hourly-kwh/power-meter/:power_meter',

      // PM Shiftly KWH routes
      '/api/pm-shiftly-kwh',
      '/api/pm-shiftly-kwh/:id',
      '/api/pm-shiftly-kwh/date-range',
      '/api/pm-shiftly-kwh/shift/:shift',
      '/api/pm-shiftly-kwh/power-meter/:power_meter',

      // PM Daily KWH routes
      '/api/pm-daily-kwh',
      '/api/pm-daily-kwh/:id',
      '/api/pm-daily-kwh/date-range',
      '/api/pm-daily-kwh/shift/:shift',
      '/api/pm-daily-kwh/power-meter/:power_meter',

      // PM Monthly KWH routes
      '/api/pm-monthly-kwh',
      '/api/pm-monthly-kwh/:id',
      '/api/pm-monthly-kwh/date-range',
      '/api/pm-monthly-kwh/shift/:shift',
      '/api/pm-monthly-kwh/power-meter/:power_meter',

      // PM Monthly kub KWH routes
      '/api/pm-monthly-kub-kwh',
      '/api/pm-monthly-kub-kwh/:id',
      '/api/pm-monthly-kub-kwh/date-range',
      '/api/pm-monthly-kub-kwh/shift/:shift',
      '/api/pm-monthly-kub-kwh/power-meter/:power_meter',

      // PM Shiftly kub KWH routes
      '/api/pm-shiftly-kub-kwh',
      '/api/pm-shiftly-kub-kwh/:id',
      '/api/pm-shiftly-kub-kwh/date-range',
      '/api/pm-shiftly-kub-kwh/shift/:shift',
      '/api/pm-shiftly-kub-kwh/power-meter/:power_meter',
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('🚨 Error:', err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

const PORT = process.env.PORT || 4001;

app.listen(PORT, async () => {
  try {
    // Test production database connection
    const productionConn = await pool.getConnection();
    console.log('✅ MySQL Production database connected successfully');
    productionConn.release();
    console.log(`🚀 Server running on port ${PORT}`);
    console.log('🌐 Environment:', process.env.NODE_ENV);
    console.log('📚 Available API Endpoints:');
    console.log('   GET  /');
    console.log('   GET  /api/test');
    console.log('   GET  /apiCr11/cr11');
    console.log('   GET  /apiCr11/cr11/:id (menggunakan id_uuid)');
    console.log('   POST /apiCr11/cr11');
    console.log('   PUT  /apiCr11/cr11/:id (menggunakan id_uuid)');
    console.log('   DELETE /apiCr11/cr11/:id (menggunakan id_uuid)');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
});