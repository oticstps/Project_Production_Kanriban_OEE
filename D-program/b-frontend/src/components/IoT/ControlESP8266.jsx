// // ControlESP8266.jsx
// import React, { useState, useEffect, useRef } from 'react';
// import './ControlESP8266.css'; // Optional styling

// // Use mqtt.js over WebSocket (HiveMQ public broker)
// const MQTT_BROKER_URL = 'wss://broker.hivemq.com:8884/mqtt'; 
// // Note: HiveMQ's public WebSocket endpoint is often: wss://broker.hivemq.com:8884/mqtt
// // If firewall blocks 8884, try: ws://broker.hivemq.com:8000/mqtt (unencrypted)

// const CONTROL_TOPIC = 'nodemcu/beauty_kost/control';
// const STATUS_TOPIC = 'nodemcu/beauty_kost/status';

// const ControlESP8266 = () => {
//   const [connectionStatus, setConnectionStatus] = useState('Disconnected');
//   const [ledStatus, setLedStatus] = useState('Unknown');
//   const clientRef = useRef(null);

//   useEffect(() => {
//     // Dynamically import mqtt (since it doesn't run on server-side)
//     let mqttClient;

//     import('mqtt').then((mqtt) => {
//       console.log('Connecting to MQTT broker...');
//       setConnectionStatus('Connecting...');

//       const options = {
//         clientId: 'WebClient-' + Math.random().toString(16).substr(2, 8),
//         keepalive: 30,
//         reconnectPeriod: 3000,
//         connectTimeout: 30 * 1000,
//       };

//       const client = mqtt.default.connect(MQTT_BROKER_URL, options);
//       clientRef.current = client;

//       client.on('connect', () => {
//         console.log('MQTT connected');
//         setConnectionStatus('Connected ✅');
        
//         // Subscribe to status topic
//         client.subscribe(STATUS_TOPIC, (err) => {
//           if (err) {
//             console.error('Subscription error:', err);
//           } else {
//             console.log(`Subscribed to ${STATUS_TOPIC}`);
//           }
//         });

//         // Request initial status (optional)
//         client.publish(CONTROL_TOPIC, 'STATUS?', { qos: 0 });
//       });

//       client.on('message', (topic, payload) => {
//         const message = payload.toString();
//         console.log(`Message on [${topic}]: ${message}`);

//         if (topic === STATUS_TOPIC) {
//           setLedStatus(message === 'ON' ? 'ON' : 'OFF');
//         }
//       });

//       client.on('error', (err) => {
//         console.error('MQTT Error:', err);
//         setConnectionStatus(`Error: ${err.message}`);
//       });

//       client.on('reconnect', () => {
//         setConnectionStatus('Reconnecting...');
//       });

//       client.on('close', () => {
//         setConnectionStatus('Disconnected ❌');
//       });

//       mqttClient = client;
//     });

//     return () => {
//       if (mqttClient) mqttClient.end();
//       if (clientRef.current) clientRef.current.end();
//     };
//   }, []);

//   const sendCommand = (command) => {
//     const client = clientRef.current;
//     if (!client || !client.connected) {
//       alert('MQTT not connected!');
//       return;
//     }
//     console.log(`Sending command: ${command}`);
//     client.publish(CONTROL_TOPIC, command, { qos: 0, retain: false }, (err) => {
//       if (err) {
//         console.error('Publish error:', err);
//       }
//     });
//   };

//   return (
//     <div className="esp8266-control">
//       <h2>ESP8266 LED Controller</h2>
//       <div className="status">
//         <p><strong>MQTT:</strong> <span className={connectionStatus.includes('✅') ? 'connected' : 'disconnected'}>{connectionStatus}</span></p>
//         <p><strong>LED Status:</strong> <span className={ledStatus === 'ON' ? 'on' : 'off'}>{ledStatus}</span></p>
//       </div>

//       <div className="buttons">
//         <button 
//           onClick={() => sendCommand('ON')} 
//           disabled={connectionStatus !== 'Connected ✅'}
//           className="btn on"
//         >
//           🔆 Turn ON
//         </button>

//         <button 
//           onClick={() => sendCommand('OFF')} 
//           disabled={connectionStatus !== 'Connected ✅'}
//           className="btn off"
//         >
//           🔆 Turn OFF
//         </button>

//         <button 
//           onClick={() => sendCommand('TOGGLE')} 
//           disabled={connectionStatus !== 'Connected ✅'}
//           className="btn toggle"
//         >
//           🔄 Toggle
//         </button>
//       </div>

//       <div className="info">
//         <p>Control Topic: <code>{CONTROL_TOPIC}</code></p>
//         <p>Status Topic: <code>{STATUS_TOPIC}</code></p>
//         <p>Broker: <code>{MQTT_BROKER_URL}</code></p>
//       </div>
//     </div>
//   );
// };

// export default ControlESP8266;



// ControlESP8266.jsx
import React, { useState, useEffect, useRef } from 'react';

const MQTT_BROKER_URL = 'wss://broker.hivemq.com:8884/mqtt'; // HiveMQ WebSocket (TLS)
// Alternative (unencrypted, may be blocked): 'ws://broker.hivemq.com:8000/mqtt'

const CONTROL_TOPIC = 'nodemcu/beauty_kost/control';
const STATUS_TOPIC = 'nodemcu/beauty_kost/status';

const ControlESP8266 = () => {
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [ledStatus, setLedStatus] = useState('Unknown');
  const clientRef = useRef(null);

  useEffect(() => {
    let mqtt;

    // Dynamically import mqtt to avoid SSR issues
    import('mqtt').then((module) => {
      mqtt = module.default;

      const options = {
        clientId: 'WebClient-' + Math.random().toString(16).substring(2, 10),
        keepalive: 30,
        reconnectPeriod: 3000,
        connectTimeout: 30 * 1000,
      };

      const client = mqtt.connect(MQTT_BROKER_URL, options);
      clientRef.current = client;

      client.on('connect', () => {
        setConnectionStatus('Connected');
        client.subscribe(STATUS_TOPIC);
        // Request current state (optional — your ESP already publishes periodically)
      });

      client.on('message', (topic, payload) => {
        if (topic === STATUS_TOPIC) {
          const status = payload.toString();
          setLedStatus(status);
        }
      });

      client.on('error', (err) => {
        console.error('MQTT Error:', err);
        setConnectionStatus('Error');
      });

      client.on('reconnect', () => setConnectionStatus('Reconnecting...'));
      client.on('close', () => setConnectionStatus('Disconnected'));

      return () => {
        if (client) client.end();
      };
    });

    return () => {
      if (clientRef.current) clientRef.current.end();
    };
  }, []);

  const sendCommand = (cmd) => {
    const client = clientRef.current;
    if (!client || !client.connected) {
      alert('⚠️ Not connected to MQTT broker!');
      return;
    }
    client.publish(CONTROL_TOPIC, cmd, { qos: 0 });
  };

  // UI helpers
  const isConnected = connectionStatus === 'Connected';
  const isLedOn = ledStatus === 'ON';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-indigo-600 p-5 text-center">
          <h1 className="text-2xl font-bold text-white">ESP8266 LED Controller</h1>
          <p className="text-indigo-200 text-sm mt-1">NodeMCU @ BEAUTY KOST</p>
        </div>

        {/* Status Panel */}
        <div className="p-6 space-y-5">
          {/* Connection Status */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">MQTT Status:</span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                isConnected
                  ? 'bg-green-100 text-green-800'
                  : connectionStatus === 'Reconnecting...'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {connectionStatus}
            </span>
          </div>

          {/* LED Status */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">LED Status:</span>
            <div className="flex items-center space-x-2">
              <div
                className={`w-4 h-4 rounded-full ${
                  isLedOn ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                }`}
              />
              <span
                className={`font-bold ${
                  isLedOn ? 'text-green-600' : 'text-gray-500'
                }`}
              >
                {ledStatus}
              </span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <button
              onClick={() => sendCommand('ON')}
              disabled={!isConnected}
              className={`py-3 rounded-xl font-semibold transition-all duration-200 ${
                isConnected
                  ? 'bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              🔆 ON
            </button>

            <button
              onClick={() => sendCommand('OFF')}
              disabled={!isConnected}
              className={`py-3 rounded-xl font-semibold transition-all duration-200 ${
                isConnected
                  ? 'bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              🔆 OFF
            </button>

            <button
              onClick={() => sendCommand('TOGGLE')}
              disabled={!isConnected}
              className={`py-3 rounded-xl font-semibold transition-all duration-200 ${
                isConnected
                  ? 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              🔄 TOGGLE
            </button>
          </div>

          {/* Info Footer */}
          <div className="pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              📡 Control: <code className="bg-gray-100 px-1.5 py-0.5 rounded">{CONTROL_TOPIC}</code>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              📥 Status: <code className="bg-gray-100 px-1.5 py-0.5 rounded">{STATUS_TOPIC}</code>
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Broker: <code className="bg-gray-100 px-1.5 py-0.5 rounded">broker.hivemq.com</code>
            </p>
          </div>
        </div>
      </div>

      {/* Help Tooltip on mobile */}
      <p className="mt-6 text-center text-gray-500 text-sm max-w-md">
        📱 Control your ESP8266 LED from anywhere! Ensure the device is powered and connected to WiFi.
      </p>
    </div>
  );
};

export default ControlESP8266;