#include <Arduino.h>
#include <Wire.h>
#include <SoftwareSerial.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SH110X.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1

#define RELAY_IN1 16
#define RELAY_IN2 17
#define POTENTIOMETER_PIN 34

SoftwareSerial mySerialLora(RELAY_IN1, RELAY_IN2); // TX, RX
Adafruit_SH1106G display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

int potentiometerValue = 0;
int relayInterval = 0;
unsigned long previousMillis = 0;

void setup() {
  mySerialLora.begin(9600);
  
  // Initialize display
  if (!display.begin(0x3C)) {
    while (true); // Infinite loop if display fails to initialize
  }
  delay(2000);
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SH110X_WHITE);
  display.setCursor(20, 20);
  display.println("App Running...!!!");
  display.setCursor(20, 40);
  display.println("Version 1.0 TPS");
  display.display();

  // Initialize relay pins
  pinMode(RELAY_IN1, OUTPUT);
  pinMode(RELAY_IN2, OUTPUT);
  digitalWrite(RELAY_IN1, LOW);
  digitalWrite(RELAY_IN2, LOW);
}

void loop() {
  // Read potentiometer value
  potentiometerValue = analogRead(POTENTIOMETER_PIN);
  
  // Map potentiometer value to relay interval
  relayInterval = map(potentiometerValue, 0, 4095, 100, 1000);

  // Relay toggle logic based on interval
  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >= relayInterval) {
    previousMillis = currentMillis;

    // Toggle relay
    digitalWrite(RELAY_IN1, !digitalRead(RELAY_IN1));
    digitalWrite(RELAY_IN2, !digitalRead(RELAY_IN2));

    // Update display
    display.clearDisplay();
    display.setCursor(0, 0);
    display.print("Potentiometer: ");
    display.println(potentiometerValue);
    display.print("Relay Interval: ");
    display.println(relayInterval);
    display.display();
  }
}
