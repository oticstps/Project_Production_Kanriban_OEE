#include <Arduino.h>
#include <HTTPClient.h>
#include <Adafruit_I2CDevice.h>
#include <SPI.h>
#include <WiFi.h>
#include <SoftwareSerial.h>

#define DEBOUNCE_DELAY 5000

const int buttonPinA2 = 14;
const int buttonPinA4 = 27;
const int buttonPinA5 = 26;
const int buttonPinA13 = 25;
const int buttonPinA14 = 33;
const int buttonPinA15 = 32;

const char* ssid = "Pena";
const char* password = "pasbatron";
const char* serverName = "http://192.168.200.225/raspi/insert/insert_data.php";
const long interval = 5000;
unsigned long previousMillis = 0;


String dataOnA2 = "*signal35on_mcfault#";
String dataOnA4 = "*signal35on_qualitycheck#";
String dataOnA5 = "*signal35on_toolchange#";
String dataOnA13 = "*signal35on_arm#";
String dataOnA14 = "*signal35on_roller#";
String dataOnA15 = "*signal35on_pin#";

String dataOffA2 = "*signal35off_mcfault#";
String dataOffA4 = "*signal35off_qualitycheck#";
String dataOffA5 = "*signal35off_toolchange#";
String dataOffA13 = "*signal35off_arm#";
String dataOffA14 = "*signal35off_roller#";
String dataOffA15 = "*signal35off_pin#";


int lastButtonStateA2 = LOW;
int lastButtonStateA4 = LOW;
int lastButtonStateA5 = LOW;
int lastButtonStateA13 = LOW;
int lastButtonStateA14 = LOW;
int lastButtonStateA15 = LOW;

unsigned long lastDebounceTimeA2 = 0;
unsigned long lastDebounceTimeA4 = 0;
unsigned long lastDebounceTimeA5 = 0;
unsigned long lastDebounceTimeA13 = 0;
unsigned long lastDebounceTimeA14 = 0;
unsigned long lastDebounceTimeA15 = 0;

SoftwareSerial mySerialLora(16, 17); // TX, RX

void checkButtonState(int pin, int &lastState, unsigned long &lastDebounceTime, String dataOn, String dataOff) {
  int reading = digitalRead(pin);
  unsigned long currentTime = millis();
  unsigned long currentMillis = millis();
  if (reading != lastState) {
    lastDebounceTime = currentTime;
  }

  
  if ((currentTime - lastDebounceTime) > DEBOUNCE_DELAY) {
    if (reading != lastState) {
      lastState = reading;
      if (currentMillis - previousMillis >= interval) {
          previousMillis = currentMillis;
          if (WiFi.status() == WL_CONNECTED) {
            HTTPClient http;
            http.begin(serverName);
            http.addHeader("Content-Type", "application/x-www-form-urlencoded");


            int sensor1 = 45;
            int sensor2 = 65;


            String httpRequestData = "sensor1=" + String(sensor1) + "&sensor2=" + String(sensor2);
            Serial.print("Sending data to server: ");
            Serial.println(httpRequestData);
            int httpResponseCode = http.POST(httpRequestData);
            if (httpResponseCode > 0) {
                String response = http.getString();
                Serial.println(httpResponseCode);
                Serial.println(response);
            } else {
                Serial.print("Error on sending POST: ");
                Serial.println(httpResponseCode);
            } http.end();
          }else {
            Serial.println("WiFi Disconnected");
          }
        }
      }


      if (lastState == HIGH) {
        mySerialLora.println(dataOn);
      } else {
        mySerialLora.println(dataOff);
      }
  }
}



void setup() {
    Serial.begin(115200);
    mySerialLora.begin(9600);
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.println("Connecting to WiFi...");
    }
    Serial.println("Connected to WiFi");
    pinMode(buttonPinA2, INPUT);
    pinMode(buttonPinA4, INPUT);
    pinMode(buttonPinA5, INPUT);
    pinMode(buttonPinA13, INPUT);
    pinMode(buttonPinA14, INPUT);
    pinMode(buttonPinA15, INPUT);
}

void loop() {
    checkButtonState(buttonPinA2, lastButtonStateA2, lastDebounceTimeA2, dataOnA2, dataOffA2);
    checkButtonState(buttonPinA4, lastButtonStateA4, lastDebounceTimeA4, dataOnA4, dataOffA4);
    checkButtonState(buttonPinA5, lastButtonStateA5, lastDebounceTimeA5, dataOnA5, dataOffA5);
    checkButtonState(buttonPinA13, lastButtonStateA13, lastDebounceTimeA13, dataOnA13, dataOffA13);
    checkButtonState(buttonPinA14, lastButtonStateA14, lastDebounceTimeA14, dataOnA14, dataOffA14);
    checkButtonState(buttonPinA15, lastButtonStateA15, lastDebounceTimeA15, dataOnA15, dataOffA15);
    delay(1000);
}
