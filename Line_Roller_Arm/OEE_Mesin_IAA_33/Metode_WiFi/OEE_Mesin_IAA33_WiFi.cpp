#include <Arduino.h>
#include <HTTPClient.h>
#include <Adafruit_I2CDevice.h>
#include <SPI.h>
#include <WiFi.h>


const char* ssid = "Pena";
const char* password = "pasbatron";

// URL dari skrip PHP di server
const char* serverName = "http://192.168.200.225/raspi/insert/insert_data.php";


const long interval = 5000; // 10 detik

unsigned long previousMillis = 0;

void setup() {
  Serial.begin(115200);

  // Menghubungkan ke WiFi
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
}

void loop() {
  unsigned long currentMillis = millis();
  
  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;

    if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;

      // Membuat URL lengkap untuk HTTP POST
      http.begin(serverName);
      http.addHeader("Content-Type", "application/x-www-form-urlencoded");

      // Data sensor yang akan dikirim
      int sensor1 = 45; // Ganti dengan pin sensor yang sesuai
      int sensor2 = 65; // Ganti dengan pin sensor yang sesuai

      // Membuat payload untuk HTTP POST
      String httpRequestData = "sensor1=" + String(sensor1) + "&sensor2=" + String(sensor2);

      Serial.print("Sending data to server: ");
      Serial.println(httpRequestData);

      // Mengirim data melalui HTTP POST
      int httpResponseCode = http.POST(httpRequestData);

      if (httpResponseCode > 0) {
        String response = http.getString();
        Serial.println(httpResponseCode);
        Serial.println(response);
      } else {
        Serial.print("Error on sending POST: ");
        Serial.println(httpResponseCode);
      }

      // Mengakhiri koneksi HTTP
      http.end();
    } else {
      Serial.println("WiFi Disconnected");
    }
  }
}
