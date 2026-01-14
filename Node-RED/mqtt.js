[
  {
    "id": "a1b2c3d4e5f6",
    "type": "mqtt in",
    "z": "flow1",
    "name": "MQTT IN Suhu",
    "topic": "sensor/suhu",
    "qos": "0",
    "datatype": "auto",
    "broker": "mqtt_broker_1",
    "nl": false,
    "rap": true,
    "rh": 0,
    "x": 180,
    "y": 120,
    "wires": [
      [
        "debug1"
      ]
    ]
  },
  {
    "id": "debug1",
    "type": "debug",
    "z": "flow1",
    "name": "Debug Suhu",
    "active": true,
    "tosidebar": true,
    "complete": "payload",
    "x": 400,
    "y": 120,
    "wires": []
  },
  {
    "id": "mqtt_broker_1",
    "type": "mqtt-broker",
    "name": "EMQX Public",
    "broker": "broker.emqx.io",
    "port": "1883",
    "clientid": "nodered_client_01",
    "usetls": false,
    "protocolVersion": "4",
    "keepalive": "60",
    "cleansession": true
  }
]
