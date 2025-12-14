const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http'); // Tambahkan ini untuk Socket.io
const { Server } = require('socket.io'); // Tambahkan ini
const { SerialPort } = require('serialport'); // Tambahkan ini
const { ReadlineParser } = require('@serialport/parser-readline'); // Tambahkan ini
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const dataRoutes = require('./routes/data');

const app = express();

// Buat server HTTP dari Express instance
const server = http.createServer(app);

// Konfigurasi CORS
const corsOptions = {
  origin: [
    "http://localhost:5173", // Default Vite
    "http://localhost:3200", // Origin frontend Anda
    // Tambahkan origin lain jika perlu
  ],
  methods: ["GET", "POST"],
  credentials: true
};

app.use(cors(corsOptions)); // Gunakan konfigurasi CORS yang sama
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/data', dataRoutes);

// Serve static files (for production)
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Handle React routing
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
// });

// --- Logika Socket.io dan Serial Port ---
let serialPort = null;
let pendingAcks = new Map(); // Map untuk melacak pesan yang menunggu ACK

const io = new Server(server, {
  cors: corsOptions // Gunakan konfigurasi CORS yang sama
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Event untuk menginisialisasi koneksi serial dari frontend
  socket.on('connectSerial', (data) => {
    const portPath = data.portPath || process.env.SERIAL_PORT_PATH || '/dev/ttyUSB0';

    if (serialPort && serialPort.isOpen) {
      socket.emit('status', `Port ${portPath} is already open.`);
      return;
    }

    try {
      // Gunakan konfigurasi dari frontend
      serialPort = new SerialPort({ 
        path: portPath, 
        baudRate: data.baudRate || 2400, // Gunakan dari data atau default
        dataBits: data.dataBits || 8,
        stopBits: data.stopBits || 1,
        parity: data.parity || 'none'
      });
      const parser = serialPort.pipe(new ReadlineParser({ delimiter: '\n' }));

      parser.on('data', (line) => {
        const trimmedLine = line.trim();
        console.log('Data from LoRa:', trimmedLine);

        // Cek apakah data adalah ACK
        if (trimmedLine.startsWith('ACK:')) {
          const msgId = trimmedLine.substring(4); // Ambil ID setelah 'ACK:'
          console.log('ACK received for ID:', msgId);

          // Cek apakah ID ini ada di daftar pending
          if (pendingAcks.has(msgId)) {
            const ackInfo = pendingAcks.get(msgId);
            clearTimeout(ackInfo.timeoutId); // Hentikan timer
            pendingAcks.delete(msgId); // Hapus dari daftar pending

            // Kirim event ke frontend bahwa ACK diterima
            socket.emit('ackReceived', { msgId: msgId });
            console.log('ACK confirmed for message ID:', msgId);
          }
        } else {
          // Kirim pesan biasa ke frontend
          socket.emit('receiveMessage', {
            text: trimmedLine,
            timestamp: new Date().toLocaleTimeString()
          });

          // Kirim ACK balik ke LoRa
          const parts = trimmedLine.split('|');
          const receivedMsgId = parts[0] || 'unknown';
          const ackResponse = `ACK:${receivedMsgId}\n`;
          serialPort.write(ackResponse, (err) => {
            if (err) {
              console.error('Error sending ACK to LoRa:', err);
            } else {
              console.log('Sent ACK to LoRa:', ackResponse.trim());
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
        serialPort = null;
      });

      serialPort.on('close', () => {
        console.log('Serial port closed.');
        socket.emit('status', 'Serial port closed.');
        serialPort = null;
        pendingAcks.clear(); // Bersihkan daftar pending saat disconnect
      });
    } catch (err) {
      console.error('Error opening serial port:', err);
      socket.emit('status', `Failed to open port: ${err.message}`);
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
          serialPort = null;
          pendingAcks.clear(); // Bersihkan daftar pending
        }
      });
    } else {
      socket.emit('status', 'No serial port was open.');
    }
  });

  // Event untuk mengirim pesan teks dari frontend ke LoRa
  socket.on('sendMessage', (data) => {
    if (serialPort && serialPort.isOpen) {
      const { text, id } = data; // text adalah pesan lengkap "ID|pesan", id adalah ID-nya
      const message = text + '\n';

      serialPort.write(message, (err) => {
        if (err) {
          console.error('Error writing to serial port:', err);
          socket.emit('error', 'Failed to send message via LoRa');
        } else {
          console.log('Sent to LoRa:', message.trim());

          // Tambahkan ke daftar pending ACK
          const timeoutId = setTimeout(() => {
            if (pendingAcks.has(id)) {
              pendingAcks.delete(id);
              console.log('ACK timeout for message ID:', id);
            }
          }, 8000); // Timeout 8 detik

          pendingAcks.set(id, { timeoutId, originalMessage: message });
        }
      });
    } else {
      socket.emit('error', 'Serial port is not connected');
    }
  });

  // Event untuk mengirim info gambar dari frontend ke LoRa
  socket.on('sendImage', (data) => {
    if (serialPort && serialPort.isOpen) {
      const imageMessage = `[IMAGE] ${data.file}`;
      const msgId = Date.now();
      const fullMessage = `${msgId}|${imageMessage}`;
      
      serialPort.write(fullMessage + '\n', (err) => {
        if (err) {
          console.error('Error sending image info to LoRa:', err);
          socket.emit('error', 'Failed to send image info via LoRa');
        } else {
          console.log('Sent image info to LoRa:', fullMessage);

          // Tambahkan ke pending ACK untuk gambar juga
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
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 4000; // Gunakan PORT dari .env atau default 4000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});