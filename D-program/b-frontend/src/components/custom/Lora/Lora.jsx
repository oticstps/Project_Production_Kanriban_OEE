import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { DEFAULT_SERIAL_CONFIG, BACKEND_URL, ACK_TIMEOUT_MS } from './addons/settings';
import { SerialConfig } from './addons/ui';

// Konstanta MQTT
const MQTT_BROKER_URL = 'wss://broker.hivemq.com:8884/mqtt';
const CONTROL_TOPIC = 'nodemcu/beauty_kost/control';
const STATUS_TOPIC = 'nodemcu/beauty_kost/status';

const Lora = () => {
  // State Konfigurasi Serial
  const [serialConfig, setSerialConfig] = useState(DEFAULT_SERIAL_CONFIG);

  // State Chat dan UI LoRa
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [sensorData, setSensorData] = useState({
    temperature: 0,
    humidity: 0,
    status: 'Normal'
  });
  const [socket, setSocket] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // State dan Ref untuk MQTT
  const [mqttConnectionStatus, setMqttConnectionStatus] = useState('Disconnected');
  const [ledStatus, setLedStatus] = useState('Unknown');
  const mqttClientRef = useRef(null);

  // Ref untuk auto-scroll LoRa
  const messagesEndRef = useRef(null);

  // --- Inisialisasi Socket.io (LoRa) ---
  useEffect(() => {
    const newSocket = io(BACKEND_URL);
    setSocket(newSocket);

    newSocket.on('receiveMessage', (data) => {
      const newMessage = {
        id: Date.now(),
        text: data.text,
        sender: 'peer',
        timestamp: data.timestamp || new Date().toLocaleTimeString(),
        type: 'text',
        status: 'received'
      };
      setMessages(prev => [...prev, newMessage]);
    });

    newSocket.on('ackReceived', (data) => {
      const { msgId } = data;
      setMessages(prev => prev.map(msg => 
        msg.id === msgId ? { ...msg, status: 'sent' } : msg
      ));
    });

    newSocket.on('status', (status) => {
      setConnectionStatus(status);
      if (status.includes('Connected')) {
        setIsConnected(true);
      } else if (status.includes('closed') || status.includes('error')) {
        setIsConnected(false);
      }
    });

    newSocket.on('error', (err) => {
      console.error('Socket error:', err);
      setConnectionStatus(`Error: ${err}`);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // --- Inisialisasi MQTT ---
  useEffect(() => {
    let mqtt;

    const connectMqtt = async () => {
      try {
        const mqttModule = await import('mqtt');
        mqtt = mqttModule.default;

        const options = {
          clientId: 'WebClient-' + Math.random().toString(16).substring(2, 10),
          keepalive: 30,
          reconnectPeriod: 3000,
          connectTimeout: 30 * 1000,
        };

        const client = mqtt.connect(MQTT_BROKER_URL, options);
        mqttClientRef.current = client;

        client.on('connect', () => {
          setMqttConnectionStatus('Connected');
          client.subscribe(STATUS_TOPIC, (err) => {
            if (err) {
              console.error('MQTT Subscribe Error:', err);
            }
          });
        });

        client.on('message', (topic, payload) => {
          if (topic === STATUS_TOPIC) {
            const status = payload.toString();
            setLedStatus(status);
          }
        });

        client.on('error', (err) => {
          console.error('MQTT Error:', err);
          setMqttConnectionStatus('Error');
        });

        client.on('reconnect', () => setMqttConnectionStatus('Reconnecting...'));
        client.on('close', () => setMqttConnectionStatus('Disconnected'));
      } catch (err) {
        console.error('Failed to load MQTT library:', err);
      }
    };

    connectMqtt();

    return () => {
      if (mqttClientRef.current) {
        mqttClientRef.current.end();
      }
    };
  }, []);

  // Auto-scroll ke pesan terbaru LoRa
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Simulasi data sensor LoRa
  useEffect(() => {
    let interval;
    if (isSimulating) {
      interval = setInterval(() => {
        const newSensorData = {
          temperature: Math.floor(Math.random() * 50) + 15,
          humidity: Math.floor(Math.random() * 40) + 30,
          status: ['Normal', 'Warning', 'Critical'][Math.floor(Math.random() * 3)]
        };
        setSensorData(newSensorData);

        if (socket && isConnected) {
          const sensorMessage = `SENSOR: Temp=${newSensorData.temperature}°C, Hum=${newSensorData.humidity}%, Status=${newSensorData.status}`;
          sendToLora(sensorMessage, 'sensor');
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isSimulating, socket, isConnected]);

  // Fungsi untuk mengirim pesan ke LoRa (dengan ACK)
  const sendToLora = (text, type = 'text') => {
    if (!socket || !isConnected) return;

    const msgId = Date.now();
    const fullMessage = `${msgId}|${text}`;
    const newMessage = {
      id: msgId,
      text: text,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString(),
      type: type,
      status: 'sending'
    };

    setMessages(prev => [...prev, newMessage]);
    socket.emit('sendMessage', { text: fullMessage, originalText: text, id: msgId });
  };

  // Fungsi untuk mengirim pesan teks LoRa
  const handleSend = () => {
    if (!inputText.trim()) return;
    sendToLora(inputText, 'text');
    setInputText('');
  };

  // Fungsi untuk upload dan preview gambar LoRa
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Fungsi untuk mengirim gambar ke LoRa
  const handleSendImage = () => {
    if (!selectedImage) return;

    const imageMessage = `[IMAGE] ${selectedImage.name}`;
    sendToLora(imageMessage, 'image');
    setSelectedImage(null);
    setImagePreview(null);
  };

  // Fungsi untuk terhubung ke port serial LoRa
  const handleConnect = () => {
    if (socket) {
      socket.emit('connectSerial', { portPath: serialConfig.port, ...serialConfig });
    }
  };

  // Fungsi untuk memutuskan koneksi LoRa
  const handleDisconnect = () => {
    if (socket) {
      socket.emit('disconnectSerial');
      setIsConnected(false);
      setConnectionStatus('Disconnected');
    }
  };

  // Fungsi untuk membersihkan chat LoRa
  const clearChat = () => {
    setMessages([]);
  };

  // Handler untuk perubahan konfigurasi LoRa
  const handleConfigChange = (field, value) => {
    setSerialConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Fungsi untuk mengirim perintah MQTT
  const sendMqttCommand = (cmd) => {
    const client = mqttClientRef.current;
    if (!client || !client.connected) {
      alert('⚠️ Not connected to MQTT broker!');
      return;
    }
    client.publish(CONTROL_TOPIC, cmd, { qos: 0 });
  };

  // Toggle sidebar untuk mobile
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // UI helpers MQTT
  const isMqttConnected = mqttConnectionStatus === 'Connected';
  const isLedOn = ledStatus === 'ON';

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-full mx-auto w-full h-full flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-lg p-3 md:p-4 border-b border-blue-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="md:hidden mr-3 p-1 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-xl md:text-2xl font-bold text-blue-800">LoRa & MQTT Interface</h1>
            </div>
            <div className="flex flex-wrap gap-2 justify-center md:justify-end">
              <button 
                onClick={isConnected ? handleDisconnect : handleConnect}
                className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-semibold transition-all text-sm ${
                  isConnected 
                    ? 'bg-green-500 hover:bg-green-600 text-white' 
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                {isConnected ? 'Disconnect LoRa' : 'Connect LoRa'}
              </button>
              <button 
                onClick={clearChat}
                className="px-3 py-1.5 md:px-4 md:py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all text-sm"
              >
                Clear Chat
              </button>
            </div>
          </div>
          <div className="flex flex-wrap justify-center md:justify-start gap-2 text-xs md:text-sm mt-1">
            <span className="text-gray-600">LoRa: {connectionStatus}</span>
            <span className="text-gray-600">MQTT: {mqttConnectionStatus}</span>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar (Konfigurasi, Sensor, Upload, MQTT Control) */}
          <div className={`bg-blue-50 border-r border-blue-200 flex-col flex-shrink-0 transition-all duration-300 ease-in-out ${
            sidebarOpen ? 'flex w-1/4 md:w-64' : 'hidden md:flex'
          }`}>
            <div className="p-3 md:p-4 flex flex-col space-y-4 overflow-y-auto h-full">
              {/* Panel Konfigurasi Serial LoRa */}
              <SerialConfig config={serialConfig} onChange={handleConfigChange} />
              
              {/* Panel Sensor LoRa */}
              <div className="bg-white p-3 md:p-4 rounded-xl shadow-md border border-blue-100">
                <h2 className="text-base md:text-lg font-bold text-blue-800 mb-2 md:mb-3">LoRa Sensor Data</h2>
                <div className="space-y-1.5 md:space-y-2">
                  <div className="flex justify-between text-xs md:text-sm">
                    <span className="text-gray-600">Temperature:</span>
                    <span className="font-semibold">{sensorData.temperature}°C</span>
                  </div>
                  <div className="flex justify-between text-xs md:text-sm">
                    <span className="text-gray-600">Humidity:</span>
                    <span className="font-semibold">{sensorData.humidity}%</span>
                  </div>
                  <div className="flex justify-between text-xs md:text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-semibold ${
                      sensorData.status === 'Normal' ? 'text-green-600' :
                      sensorData.status === 'Warning' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {sensorData.status}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsSimulating(!isSimulating)}
                  className={`mt-3 w-full py-1.5 md:py-2 rounded-lg font-semibold transition-all text-xs md:text-sm ${
                    isSimulating
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {isSimulating ? 'Stop Simulation' : 'Start Simulation'}
                </button>
              </div>

              {/* Panel Upload Gambar LoRa */}
              <div className="bg-white p-3 md:p-4 rounded-xl shadow-md border border-blue-100">
                <h2 className="text-base md:text-lg font-bold text-blue-800 mb-2 md:mb-3">Upload Image (LoRa)</h2>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full mb-2 p-1.5 md:p-2 text-xs md:text-sm border border-gray-300 rounded-lg"
                />
                {imagePreview && (
                  <div className="mb-2">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-20 md:h-32 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      onClick={handleSendImage}
                      className="mt-1 w-full py-1.5 md:py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all text-xs md:text-sm"
                    >
                      Send Image
                    </button>
                  </div>
                )}
              </div>

              {/* Panel Kontrol MQTT */}
              <div className="bg-white p-3 md:p-4 rounded-xl shadow-md border border-blue-100">
                <h2 className="text-base md:text-lg font-bold text-blue-800 mb-2 md:mb-3">MQTT Control</h2>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs md:text-sm text-gray-600">Status:</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      isMqttConnected
                        ? 'bg-green-100 text-green-800'
                        : mqttConnectionStatus === 'Reconnecting...'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {mqttConnectionStatus}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs md:text-sm text-gray-600">LED:</span>
                  <div className="flex items-center space-x-1">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        isLedOn ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                      }`}
                    />
                    <span
                      className={`font-bold text-xs ${
                        isLedOn ? 'text-green-600' : 'text-gray-500'
                      }`}
                    >
                      {ledStatus}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-1 pt-1">
                  <button
                    onClick={() => sendMqttCommand('ON')}
                    disabled={!isMqttConnected}
                    className={`py-1.5 rounded-lg font-semibold transition-all text-xs ${
                      isMqttConnected
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    ON
                  </button>
                  <button
                    onClick={() => sendMqttCommand('OFF')}
                    disabled={!isMqttConnected}
                    className={`py-1.5 rounded-lg font-semibold transition-all text-xs ${
                      isMqttConnected
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    OFF
                  </button>
                  <button
                    onClick={() => sendMqttCommand('TOGGLE')}
                    disabled={!isMqttConnected}
                    className={`py-1.5 rounded-lg font-semibold transition-all text-xs ${
                      isMqttConnected
                        ? 'bg-indigo-500 hover:bg-indigo-600 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    TGL
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Area Chat Utama (LoRa) */}
          <div className="flex-1 flex flex-col bg-white">
            <div className="flex-1 overflow-y-auto p-2 md:p-4 space-y-3 bg-gray-50">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p>No LoRa messages yet.</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-xs md:max-w-md lg:max-w-lg px-3 py-2 rounded-xl relative ${
                        msg.sender === 'user'
                          ? 'bg-blue-500 text-white rounded-br-none'
                          : 'bg-gray-200 text-gray-800 rounded-bl-none'
                      }`}
                    >
                      {msg.type === 'image' ? (
                        <div>
                          <img 
                            src={msg.imageUrl || "https://via.placeholder.com/150"} 
                            alt="Sent" 
                            className="w-full h-20 object-cover rounded-lg mb-2"
                          />
                          <p className="text-xs md:text-sm">{msg.text}</p>
                        </div>
                      ) : (
                        <p className="text-sm md:text-base">{msg.text}</p>
                      )}
                      <p className="text-xs opacity-70 mt-1">{msg.timestamp}</p>
                      
                      {msg.sender === 'user' && (
                        <div className="absolute -bottom-5 right-1 text-xs">
                          {msg.status === 'sending' && <span className="text-yellow-600">Sending...</span>}
                          {msg.status === 'sent' && <span className="text-green-600">✅ Sent</span>}
                          {msg.status === 'failed' && <span className="text-red-600">❌ Failed</span>}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-2 md:p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center space-x-1 md:space-x-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your message for LoRa..."
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSend}
                  disabled={!inputText.trim() || !socket || !isConnected}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all disabled:opacity-50 text-sm"
                >
                  Send LoRa
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-1 text-center text-xs text-gray-600 p-1">
          {isSimulating && (
            <span className="inline-flex items-center px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
              Simulating sensor data and sending via LoRa...
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Lora;