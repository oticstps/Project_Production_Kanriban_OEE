#include <Arduino.h>
#include <HTTPClient.h>
#include <Adafruit_I2CDevice.h>
#include <SPI.h>
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

void setup() {
  WiFi.begin(ssid, password);
    
  if (!display.begin(0x3C)) {
    while (true);
  }
  while (WiFi.status() != WL_CONNECTED) {
    delay(2000);
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SH110X_WHITE);
    display.setCursor(20, 20);
    display.println("Status");
    display.setCursor(20, 40);
    display.println("Connecting to WiFi...");
    display.display();
  }

  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SH110X_WHITE);
  display.setCursor(20, 20);
  display.println("Status");
  display.setCursor(20, 40);
  display.println("Connected to WiFi");
  display.display();

}

void loop() {
  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;
    if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
      http.begin(serverName);
      http.addHeader("Content-Type", "application/x-www-form-urlencoded");
      int sensor1 = 4352;
      int sensor2 = 65;
      String httpRequestData = "sensor1=" + String(sensor1) + "&sensor2=" + String(sensor2);
      int httpResponseCode = http.POST(httpRequestData);

      if (httpResponseCode > 0) {
        String response = http.getString();
        Serial.println(httpResponseCode);
        Serial.println(response);
        display.clearDisplay();
        display.setTextSize(1);
        display.setTextColor(SH110X_WHITE);
        display.setCursor(10, 20);
        display.println("Response :");
        display.setCursor(10, 30);
        display.println(response);
        display.display();

      } else {
        Serial.print("Error on sending POST: ");
        Serial.println(httpResponseCode);
        display.clearDisplay();
        display.setTextSize(1);
        display.setTextColor(SH110X_WHITE);
        display.setCursor(10, 20);
        display.println("Cek : ");
        display.setCursor(10, 30);
        display.println(httpResponseCode);
        display.display();
      }
      http.end();
    } else {
      Serial.println("WiFi Disconnected");
      display.clearDisplay();
      display.setTextSize(1);
      display.setTextColor(SH110X_WHITE);
      display.setCursor(20, 20);
      display.println("Error!");
      display.setCursor(20, 40);
      display.println("WiFi Disconnected!");
      display.display();
    }
  }
}
