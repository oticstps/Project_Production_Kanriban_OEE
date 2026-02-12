// addons/settings.js

// Konfigurasi default
export const DEFAULT_SERIAL_CONFIG = {
  port: 'COM4', // Default, bisa diubah oleh user
  baudRate: 2400,
  dataBits: 8,
  stopBits: 1,
  parity: 'none',
};

// Opsi untuk dropdown
export const BAUD_RATES = [1200, 2400, 4800, 9600, 19200, 38400, 57600, 115200];
export const DATA_BITS = [5, 6, 7, 8];
export const STOP_BITS = [1, 2];
export const PARITY_OPTIONS = ['none', 'even', 'odd'];

// Konfigurasi Socket.io
export const BACKEND_URL = 'http://localhost:4000'; // Pastikan sesuai dengan PORT di .env

// Timeout untuk ACK
export const ACK_TIMEOUT_MS = 8000;
export const MAX_RETRIES = 3;