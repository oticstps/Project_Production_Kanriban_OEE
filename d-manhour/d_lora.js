import express from 'express';
import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Sesuaikan dengan URL frontend Anda
  }
});

const BAUD_RATE = 2400;
let port = null; // Akan diinisialisasi nanti

// Ganti dengan port serial Anda, misalnya: '/dev/ttyUSB0' (Linux) atau 'COM4' (Windows)
const SERIAL_PORT_PATH = process.env.SERIAL_PORT_PATH || '/dev/ttyUSB0'; // atau 'COM4'

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Event untuk mengirim pesan dari frontend ke LoRa
  socket.on('sendMessage', (data) => {
    console.log('Received from frontend:', data);
    if (port && port.isOpen) {
      port.write(data.text + '\n', (err) => {
        if (err) {
          console.error('Error writing to serial port:', err);
          socket.emit('error', 'Failed to send message');
        } else {
          console.log('Sent to LoRa:', data.text);
          // Tambahkan logika ACK di sini jika diperlukan
        }
      });
    } else {
      socket.emit('error', 'Serial port not connected');
    }
  });

  // Event untuk menginisialisasi koneksi serial
  socket.on('connectSerial', (data) => {
    const path = data.portPath || SERIAL_PORT_PATH;
    if (port && port.isOpen) {
      socket.emit('status', 'Port is already open');
      return;
    }

    port = new SerialPort({ path, baudRate: BAUD_RATE });
    const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

    parser.on('data', (line) => {
      console.log('Received from LoRa:', line);
      // Kirim ke semua client frontend
      io.emit('receiveMessage', { text: line.trim(), timestamp: new Date().toLocaleTimeString() });
    });

    port.on('open', () => {
      console.log(`Serial port ${path} opened`);
      socket.emit('status', `Connected to ${path} at ${BAUD_RATE} baud`);
    });

    port.on('error', (err) => {
      console.error('Serial port error:', err);
      socket.emit('status', `Serial error: ${err.message}`);
    });

    port.on('close', () => {
      console.log('Serial port closed');
      socket.emit('status', 'Serial port closed');
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});