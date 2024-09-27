#include <Arduino.h>
#include <Wire.h>
#include <Adafruit_I2CDevice.h>
#include <SoftwareSerial.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SH110X.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1

const int buttonPinA1 = 32;
const int buttonPinA2 = 33;
const int buttonPinA3 = 25;


String dataOnA1 = "*iam72on_mcfault#";
String dataOnA2 = "*iam72on_fullwork#";
String dataOnA3 = "*iam72on_hoppernopart#";
String dataOffA1 = "*iam72off_mcfault#";
String dataOffA2 = "*iam72off_fullwork#";
String dataOffA3 = "*iam72off_hoppernopart#";


int buttonStateA1 = LOW;
int buttonStateA2 = LOW;
int buttonStateA3 = LOW;


int lastButtonStateA1 = LOW;
int lastButtonStateA2 = LOW;
int lastButtonStateA3 = LOW;

unsigned long lastDebounceTimeA1 = 0;
unsigned long lastDebounceTimeA2 = 0;
unsigned long lastDebounceTimeA3 = 0;
const unsigned long debounceDelay = 5000; // 5 seconds

SoftwareSerial mySerialLora(16, 17); // TX, RX
Adafruit_SH1106G display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

void setup() {
  mySerialLora.begin(9600);
  pinMode(buttonPinA1, INPUT);
  pinMode(buttonPinA2, INPUT);
  pinMode(buttonPinA3, INPUT);

  if (!display.begin(0x3C)) {
    while (true);
  }
  delay(2000);
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SH110X_WHITE);
  display.setCursor(20, 20);
  display.println("App Run!");
  display.setCursor(20, 40);
  display.println("Version 1.0 TPS");
  display.display();
}

void checkButton(int buttonPin, int &lastButtonState, int &buttonState, unsigned long &lastDebounceTime, String dataOn, String dataOff) {
  int reading = digitalRead(buttonPin);
  if (reading != lastButtonState) {
    lastDebounceTime = millis();
  }

  if ((millis() - lastDebounceTime) > debounceDelay) {
    if (reading != buttonState) {
      buttonState = reading;
      if (buttonState == HIGH) {
        mySerialLora.println(dataOn);
        display.clearDisplay();
        display.setTextSize(1);
        display.setTextColor(SH110X_WHITE);
        display.setCursor(10, 20);
        display.println("Data : ");
        display.setCursor(10, 30);
        display.println(dataOn);
        display.display();
        delay(1100);
      } else {
        mySerialLora.println(dataOff);
        display.clearDisplay();
        display.setTextSize(1);
        display.setTextColor(SH110X_WHITE);
        display.setCursor(10, 20);
        display.println("Data : ");
        display.setCursor(10, 30);
        display.println(dataOff);
        display.display();
        delay(1100);
      }
    }
  }
  lastButtonState = reading;
}

void loop() {
  checkButton(buttonPinA1, lastButtonStateA1, buttonStateA1, lastDebounceTimeA1, dataOnA1, dataOffA1);
  checkButton(buttonPinA2, lastButtonStateA2, buttonStateA2, lastDebounceTimeA2, dataOnA2, dataOffA2);
  checkButton(buttonPinA3, lastButtonStateA3, buttonStateA3, lastDebounceTimeA3, dataOnA3, dataOffA3);
  delay(100);
}