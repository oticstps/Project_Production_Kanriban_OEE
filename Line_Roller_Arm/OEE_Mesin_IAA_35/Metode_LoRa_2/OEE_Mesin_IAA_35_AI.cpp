#include <Arduino.h>
#include <Wire.h>
#include <SoftwareSerial.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SH110X.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1

const int buttonPinA2 = 32;
const int buttonPinA3 = 33;
const int buttonPinA4 = 25;
const int buttonPinA5 = 26;
const int buttonPinA13 = 27;
const int buttonPinA14 = 14;
const int buttonPinA15 = 12;

String dataOnA2 = "*signal35on_mcfault#";
String dataOnA3 = "*signal35on_fullwork#";
String dataOnA4 = "*signal35on_qualitycheck#";
String dataOnA5 = "*signal35on_toolchange#";
String dataOnA13 = "*signal35on_arm#";
String dataOnA14 = "*signal35on_roller#";
String dataOnA15 = "*signal35on_pin#";

String dataOffA2 = "*signal35off_mcfault#";
String dataOffA3 = "*signal35off_fullwork#";
String dataOffA4 = "*signal35off_qualitycheck#";
String dataOffA5 = "*signal35off_toolchange#";
String dataOffA13 = "*signal35off_arm#";
String dataOffA14 = "*signal35off_roller#";
String dataOffA15 = "*signal35off_pin#";

int buttonStateA2 = LOW;
int buttonStateA3 = LOW;
int buttonStateA4 = LOW;
int buttonStateA5 = LOW;
int buttonStateA13 = LOW;
int buttonStateA14 = LOW;
int buttonStateA15 = LOW;

int lastButtonStateA2 = LOW;
int lastButtonStateA3 = LOW;
int lastButtonStateA4 = LOW;
int lastButtonStateA5 = LOW;
int lastButtonStateA13 = LOW;
int lastButtonStateA14 = LOW;
int lastButtonStateA15 = LOW;

unsigned long lastDebounceTimeA2 = 0;
unsigned long lastDebounceTimeA3 = 0;
unsigned long lastDebounceTimeA4 = 0;
unsigned long lastDebounceTimeA5 = 0;
unsigned long lastDebounceTimeA13 = 0;
unsigned long lastDebounceTimeA14 = 0;
unsigned long lastDebounceTimeA15 = 0;
const unsigned long debounceDelay = 5000; // 5 seconds

SoftwareSerial mySerialLora(16, 17); // TX, RX
Adafruit_SH1106G display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

void setup() {
  mySerialLora.begin(9600);
  pinMode(buttonPinA2, INPUT);
  pinMode(buttonPinA3, INPUT);
  pinMode(buttonPinA4, INPUT);
  pinMode(buttonPinA5, INPUT);
  pinMode(buttonPinA13, INPUT);
  pinMode(buttonPinA14, INPUT);
  pinMode(buttonPinA15, INPUT);

  if (!display.begin(0x3C)) {
    while (true);
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
}

// void checkButton(int buttonPin, int &lastButtonState, int &buttonState, unsigned long &lastDebounceTime, String dataOn, String dataOff) {

// }

void loop() {

  // checkButton(buttonPinA2, lastButtonStateA2, buttonStateA2, lastDebounceTimeA2, dataOnA2, dataOffA2);
  // checkButton(buttonPinA3, lastButtonStateA3, buttonStateA3, lastDebounceTimeA3, dataOnA3, dataOffA3);
  // checkButton(buttonPinA4, lastButtonStateA4, buttonStateA4, lastDebounceTimeA4, dataOnA4, dataOffA4);
  // checkButton(buttonPinA5, lastButtonStateA5, buttonStateA5, lastDebounceTimeA5, dataOnA5, dataOffA5);
  // checkButton(buttonPinA13, lastButtonStateA13, buttonStateA13, lastDebounceTimeA13, dataOnA13, dataOffA13);
  // checkButton(buttonPinA14, lastButtonStateA14, buttonStateA14, lastDebounceTimeA14, dataOnA14, dataOffA14);
  // checkButton(buttonPinA15, lastButtonStateA15, buttonStateA15, lastDebounceTimeA15, dataOnA15, dataOffA15);
  int reading = digitalRead(buttonPinA2);
  if (reading != lastButtonStateA2) {
    lastDebounceTimeA2 = millis();
  }
  if ((millis() - lastDebounceTimeA2) > debounceDelay) {
    if (reading != buttonStateA2) {
      buttonStateA2 = reading;
      if (buttonStateA2 == HIGH) {
        mySerialLora.println(dataOnA2);
        display.clearDisplay();
        display.setTextSize(1);
        display.setTextColor(SH110X_WHITE);
        display.setCursor(10, 20);
        display.println("Data : ");
        display.setCursor(10, 30);
        display.println(dataOnA2);
        display.display();
      } 
    }
  }
  lastButtonStateA2 = reading;



  delay(1000);
}