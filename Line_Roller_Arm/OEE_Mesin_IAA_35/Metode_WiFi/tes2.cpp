#include <Arduino.h>
#include <HTTPClient.h>
#include <WiFi.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SH110X.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1
const char* ssid = "Pena";
const char* password = "pasbatron";
const char* serverName = "http://192.168.200.225/on/Project_PHP/Insert_MYSQL/insert_data.php";
const long interval = 5000;
unsigned long previousMillis = 0;

Adafruit_SH1106G display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

void displayMessage(const char* message) {
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SH110X_WHITE);
  display.setCursor(20, 30);
  display.println(message);
  display.display();
}




void reconnectWiFi() {
  if (WiFi.status() != WL_CONNECTED) {
    displayMessage("Reconnecting WiFi...");
    WiFi.disconnect();
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
      delay(1000);
    }
    displayMessage("Reconnected to WiFi");
  }
}




void sendData() {
  HTTPClient http;
  http.begin(serverName);
  http.addHeader("Content-Type", "application/x-www-form-urlencoded");
  int sensor1 = 4352;
  int sensor2 = 65;
  String httpRequestData = "sensor1=" + String(sensor1) + "&sensor2=" + String(sensor2);
  int httpResponseCode = http.POST(httpRequestData);
  if (httpResponseCode > 0) {
    String response = http.getString();
    displayMessage(response.c_str());
  } else {
    String errorMsg = "Error: " + String(httpResponseCode);
    displayMessage(errorMsg.c_str());
  }
  http.end();
}


void setup() {
  display.begin(0x3C);
  WiFi.begin(ssid, password);
  displayMessage("Connecting to WiFi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
  }
  displayMessage("Connected to WiFi");
}
void loop() {
  reconnectWiFi();
  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;
    sendData();
  }
}
