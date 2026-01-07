// =============================================================================================================================
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const pool = require('./config/db_core');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());


// Create HTTP server from Express app
const server = http.createServer(app);

// Socket.io Configuration
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:3200",
      "http://localhost:3000",
      "http://localhost:3100",
      "http://172.27.6.191:3100",
      process.env.FRONTEND_URL || "http://localhost:5173"
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Serial Port variables
let serialPort = null;
let pendingAcks = new Map();

// Socket.io event handlers
io.on('connection', (socket) => {
  console.log('Client connected via Socket.io:', socket.id);

  // Fungsi untuk membuka port serial baru
  const openNewSerialPort = (data, portPath) => {
    try {
      // Tutup koneksi lama dari variabel global jika ada
      if (serialPort && serialPort.isOpen) {
        console.log(`Closing previous serial port instance: ${serialPort.path}`);
        serialPort.close();
        serialPort = null;
        pendingAcks.clear();
      }

      serialPort = new SerialPort({ 
        path: portPath, 
        baudRate: data.baudRate || 2400,
        dataBits: data.dataBits || 8,
        stopBits: data.stopBits || 1,
        parity: data.parity || 'none'
      });
      const parser = serialPort.pipe(new ReadlineParser({ delimiter: '\n' }));

      parser.on('data', (line) => {
        const trimmedLine = line.trim();
        console.log('Data from Serial Port:', trimmedLine);

        if (trimmedLine.startsWith('ACK:')) {
          const msgId = trimmedLine.substring(4);
          console.log('ACK received for ID:', msgId);

          if (pendingAcks.has(msgId)) {
            const ackInfo = pendingAcks.get(msgId);
            clearTimeout(ackInfo.timeoutId);
            pendingAcks.delete(msgId);
            socket.emit('ackReceived', { msgId: msgId });
            console.log('ACK confirmed for message ID:', msgId);
          }
        } else {
          socket.emit('receiveMessage', {
            text: trimmedLine,
            timestamp: new Date().toLocaleTimeString()
          });

          const parts = trimmedLine.split('|');
          const receivedMsgId = parts[0] || 'unknown';
          const ackResponse = `ACK:${receivedMsgId}\n`;
          serialPort.write(ackResponse, (err) => {
            if (err) {
              console.error('Error sending ACK to Serial Port:', err);
            } else {
              console.log('Sent ACK to Serial Port:', ackResponse.trim());
            }
          });
        }
      });

      serialPort.on('open', () => {
        console.log(`Serial port ${portPath} opened with config:`, {
          baudRate: data.baudRate,
          dataBits: data.dataBits,
          stopBits: data.stopBits,
          parity: data.parity
        });
        socket.emit('status', `Connected to ${portPath} with ${data.baudRate || 2400} baud.`);
      });

      serialPort.on('error', (err) => {
        console.error('Serial port error:', err);
        socket.emit('status', `Serial error: ${err.message}`);
      });

      serialPort.on('close', () => {
        console.log('Serial port closed.');
        socket.emit('status', 'Serial port closed.');
        if (serialPort && serialPort.path === portPath) {
          serialPort = null;
        }
        pendingAcks.clear();
      });
    } catch (err) {
      console.error('Error opening serial port:', err);
      socket.emit('status', `Failed to open port: ${err.message}`);
    }
  };

  // Event untuk menginisialisasi koneksi serial dari frontend
  socket.on('connectSerial', (data) => {
    const portPath = data.portPath || process.env.SERIAL_PORT_PATH || '/dev/ttyUSB0';

    if (serialPort && serialPort.isOpen) {
      console.log(`Serial port (${serialPort.path}) is already open. Closing it before opening ${portPath}.`);
      serialPort.close((err) => {
        if (err) {
          console.error('Error closing previous serial port:', err);
        } else {
          console.log('Previous serial port closed successfully.');
        }
        openNewSerialPort(data, portPath);
      });
    } else {
      openNewSerialPort(data, portPath);
    }
  });

  // Event untuk memutuskan koneksi serial
  socket.on('disconnectSerial', () => {
    if (serialPort && serialPort.isOpen) {
      serialPort.close((err) => {
        if (err) {
          console.error('Error closing serial port:', err);
          socket.emit('status', `Error closing port: ${err.message}`);
        } else {
          console.log('Serial port closed by client.');
          socket.emit('status', 'Serial port closed by client.');
        }
      });
    } else {
      socket.emit('status', 'No serial port was open.');
    }
  });

  // Event untuk mengirim pesan teks dari frontend ke Serial Port
  socket.on('sendMessage', (data) => {
    if (serialPort && serialPort.isOpen) {
      const { text, id } = data;
      const message = text + '\n';

      serialPort.write(message, (err) => {
        if (err) {
          console.error('Error writing to serial port:', err);
          socket.emit('error', 'Failed to send message via Serial Port');
        } else {
          console.log('Sent to Serial Port:', message.trim());

          const timeoutId = setTimeout(() => {
            if (pendingAcks.has(id)) {
              pendingAcks.delete(id);
              console.log('ACK timeout for message ID:', id);
            }
          }, 8000);

          pendingAcks.set(id, { timeoutId, originalMessage: message });
        }
      });
    } else {
      socket.emit('error', 'Serial port is not connected');
    }
  });

  // Event untuk mengirim info gambar dari frontend ke Serial Port
  socket.on('sendImage', (data) => {
    if (serialPort && serialPort.isOpen) {
      const imageMessage = `[IMAGE] ${data.file}`;
      const msgId = Date.now();
      const fullMessage = `${msgId}|${imageMessage}`;
      
      serialPort.write(fullMessage + '\n', (err) => {
        if (err) {
          console.error('Error sending image info to Serial Port:', err);
          socket.emit('error', 'Failed to send image info via Serial Port');
        } else {
          console.log('Sent image info to Serial Port:', fullMessage);

          const timeoutId = setTimeout(() => {
            if (pendingAcks.has(msgId)) {
              pendingAcks.delete(msgId);
              console.log('ACK timeout for image message ID:', msgId);
            }
          }, 8000);

          pendingAcks.set(msgId, { timeoutId, originalMessage: fullMessage });
        }
      });
    } else {
      socket.emit('error', 'Serial port is not connected');
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected from Socket.io:', socket.id);
  });
});

// Middleware
// app.use(cors({
//   origin: [
//     "http://localhost:5173",
//     "http://localhost:3200",
//     "http://localhost:3000",
//     "http://localhost:3100",
//     "http://localhost:5173"
//   ],
//   credentials: true
// }));

app.use(cors());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Route dasar
app.get('/', (req, res) => {
  res.json({ 
    message: 'API is running with WebSocket support...',
    timestamp: new Date(),
    environment: process.env.NODE_ENV,
    endpoints: {
      energy: '/api/energy/pm-monthly-report',
      test: '/api/test',
      serialStatus: '/api/serial-status',
      socketio: 'ws://' + req.get('host')
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

// Serial port status route
app.get('/api/serial-status', (req, res) => {
  res.json({
    serialPort: serialPort ? {
      isOpen: serialPort.isOpen,
      path: serialPort.path,
      baudRate: serialPort.baudRate
    } : null,
    socketConnections: io.engine.clientsCount,
    timestamp: new Date()
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

const energyRoutes = require('./routes/energyRoutes');

// Use routes
app.use("/api/auth", require('./routes/auth'));
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

app.use('/api', energyRoutes);

// 404 handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
    requestedUrl: req.originalUrl,
    timestamp: new Date(),
    availableEndpoints: [
      // Basic routes
      '/',
      '/api/test',
      '/api/serial-status',

      // Auth routes
      '/api/auth/register',
      '/api/auth/login',
      '/api/auth/profile',

      // Common Rail routes (Cr1-Cr12)
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

server.listen(PORT, async () => {
  try {
    // Test production database connection
    const productionConn = await pool.getConnection();
    console.log('✅ MySQL Production database connected successfully');
    productionConn.release();

    console.log(`🚀 Server running on port ${PORT}`);
    console.log('🌐 Environment:', process.env.NODE_ENV);
    console.log('🔌 WebSocket/Socket.io available on ws://localhost:' + PORT);
    console.log('📡 Serial Port path:', process.env.SERIAL_PORT_PATH || '/dev/ttyUSB0');
    console.log('📚 Available API Endpoints:');
    console.log('   GET  /');
    console.log('   GET  /api/test');
    console.log('   GET  /api/serial-status');
    console.log('   GET  /api/energy/pm-monthly-report');
    console.log('   GET  /api/energy/pm-monthly-report/id/:id');
    console.log('   GET  /api/energy/pm-monthly-report/type/:type');
    console.log('   GET  /api/energy/pm-monthly-report/line/:line');
    console.log('   GET  /api/energy/pm-monthly-report/month/:month/year/:year');
    console.log('   GET  /api/energy/pm-monthly-report/date-range?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD');
    console.log('   WS   ws://localhost:' + PORT + ' (Socket.io for Serial Port communication)');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
});