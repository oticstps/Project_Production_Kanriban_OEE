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

String dataOnA2 = "*iaa35on_mcfault#";
String dataOnA3 = "*iaa35on_fullwork#";
String dataOnA4 = "*iaa35on_qualitycheck#";
String dataOnA5 = "*iaa35on_toolchange#";
String dataOnA13 = "*iaa35on_arm#";
String dataOnA14 = "*iaa35on_roller#";
String dataOnA15 = "*iaa33on_pin#";

String dataOffA2 = "*iaa35off_mcfault#";
String dataOffA3 = "*iaa35off_fullwork#";
String dataOffA4 = "*iaa35off_qualitycheck#";
String dataOffA5 = "*iaa35off_toolchange#";
String dataOffA13 = "*iaa35off_arm#";
String dataOffA14 = "*iaa35off_roller#";
String dataOffA15 = "*iaa35off_pin#";

int buttonStateA2 = HIGH;
int buttonStateA3 = HIGH;
int buttonStateA4 = HIGH;
int buttonStateA5 = HIGH;
int buttonStateA13 = HIGH;
int buttonStateA14 = HIGH;
int buttonStateA15 = HIGH;

int lastButtonStateA2 = HIGH;
int lastButtonStateA3 = HIGH;
int lastButtonStateA4 = HIGH;
int lastButtonStateA5 = HIGH;
int lastButtonStateA13 = HIGH;
int lastButtonStateA14 = HIGH;
int lastButtonStateA15 = HIGH;

unsigned long lastDebounceTimeA2 = 0;
unsigned long lastDebounceTimeA3 = 0;
unsigned long lastDebounceTimeA4 = 0;
unsigned long lastDebounceTimeA5 = 0;
unsigned long lastDebounceTimeA13 = 0;
unsigned long lastDebounceTimeA14 = 0;
unsigned long lastDebounceTimeA15 = 0;
const unsigned long debounceDelay = 200; // 200 ms debounce delay

SoftwareSerial mySerialLora(16, 17); // TX, RX
Adafruit_SH1106G display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

void checkButton(int buttonPin, int &lastButtonState, int &buttonState, unsigned long &lastDebounceTime, String dataOn, String dataOff) {
  int reading = digitalRead(buttonPin);

  // If the button state has changed
  if (reading != lastButtonState) {
    lastDebounceTime = millis();
  }

  // If the state has been stable for longer than the debounce delay
  if ((millis() - lastDebounceTime) > debounceDelay) {
    if (reading != buttonState) {
      buttonState = reading;

      // Button is pressed (LOW in INPUT_PULLUP mode)
      if (buttonState == LOW) {
        mySerialLora.println(dataOn);
        display.clearDisplay();
        display.setTextSize(1);
        display.setTextColor(SH110X_WHITE);
        display.setCursor(10, 20);
        display.println("Data : ");
        display.setCursor(10, 30);
        display.println(dataOn);
        display.display();
        delay(1100); // 1.1 seconds delay for display update
      }
      // Button is released (HIGH in INPUT_PULLUP mode)
      else {
        mySerialLora.println(dataOff);
        display.clearDisplay();
        display.setTextSize(1);
        display.setTextColor(SH110X_WHITE);
        display.setCursor(10, 20);
        display.println("Data : ");
        display.setCursor(10, 30);
        display.println(dataOff);
        display.display();
        delay(1100); // 1.1 seconds delay for display update
      }
    }
  }

  // Save the reading. Next time through the loop, it'll be the lastButtonState
  lastButtonState = reading;
}

void setup() {
  mySerialLora.begin(9600);

  // Set the buttons as INPUT_PULLUP
  pinMode(buttonPinA2, INPUT_PULLUP);
  pinMode(buttonPinA3, INPUT_PULLUP);
  pinMode(buttonPinA4, INPUT_PULLUP);
  pinMode(buttonPinA5, INPUT_PULLUP);
  pinMode(buttonPinA13, INPUT_PULLUP);
  pinMode(buttonPinA14, INPUT_PULLUP);
  pinMode(buttonPinA15, INPUT_PULLUP);

  if (!display.begin(0x3C)) {
    while (true); // Halt if display initialization fails
  }

  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SH110X_WHITE);
  display.setCursor(20, 20);
  display.println("App Run!");
  display.setCursor(20, 40);
  display.println("OEE 1.0 TPS");
  display.display();
  delay(2000);
}

void loop() {
  // Check each button
  checkButton(buttonPinA2, lastButtonStateA2, buttonStateA2, lastDebounceTimeA2, dataOnA2, dataOffA2);
  checkButton(buttonPinA3, lastButtonStateA3, buttonStateA3, lastDebounceTimeA3, dataOnA3, dataOffA3);
  checkButton(buttonPinA4, lastButtonStateA4, buttonStateA4, lastDebounceTimeA4, dataOnA4, dataOffA4);
  checkButton(buttonPinA5, lastButtonStateA5, buttonStateA5, lastDebounceTimeA5, dataOnA5, dataOffA5);
  checkButton(buttonPinA13, lastButtonStateA13, buttonStateA13, lastDebounceTimeA13, dataOnA13, dataOffA13);
  checkButton(buttonPinA14, lastButtonStateA14, buttonStateA14, lastDebounceTimeA14, dataOnA14, dataOffA14);
  checkButton(buttonPinA15, lastButtonStateA15, buttonStateA15, lastDebounceTimeA15, dataOnA15, dataOffA15);

  delay(100); // Short delay to avoid unnecessary CPU usage
}
