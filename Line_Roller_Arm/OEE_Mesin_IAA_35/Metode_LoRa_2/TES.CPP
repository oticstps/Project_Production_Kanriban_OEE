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

unsigned long debounceDelay = 500;

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
}

void loop() {
  int readingA2 = digitalRead(buttonPinA2);
  int readingA3 = digitalRead(buttonPinA3);
  int readingA4 = digitalRead(buttonPinA4);
  int readingA5 = digitalRead(buttonPinA5);
  int readingA13 = digitalRead(buttonPinA13);
  int readingA14 = digitalRead(buttonPinA14);
  int readingA15 = digitalRead(buttonPinA15);

  if (readingA2 != lastButtonStateA2) {
    lastDebounceTimeA2 = millis();
  }
  if (readingA3 != lastButtonStateA3) {
    lastDebounceTimeA3 = millis();
  }
  if (readingA4 != lastButtonStateA4) {
    lastDebounceTimeA4 = millis();
  }
  if (readingA5 != lastButtonStateA5) {
    lastDebounceTimeA5 = millis();
  }
  if (readingA13 != lastButtonStateA13) {
    lastDebounceTimeA13 = millis();
  }
  if (readingA14 != lastButtonStateA14) {
    lastDebounceTimeA14 = millis();
  }
  if (readingA15 != lastButtonStateA15) {
    lastDebounceTimeA15 = millis();
  }

  if ((millis() - lastDebounceTimeA2) > debounceDelay) {
    buttonStateA2 = readingA2;
  }
  if ((millis() - lastDebounceTimeA3) > debounceDelay) {
    buttonStateA3 = readingA3;
  }
  if ((millis() - lastDebounceTimeA4) > debounceDelay) {
    buttonStateA4 = readingA4;
  }
  if ((millis() - lastDebounceTimeA5) > debounceDelay) {
    buttonStateA5 = readingA5;
  }
  if ((millis() - lastDebounceTimeA13) > debounceDelay) {
    buttonStateA13 = readingA13;
  }
  if ((millis() - lastDebounceTimeA14) > debounceDelay) {
    buttonStateA14 = readingA14;
  }
  if ((millis() - lastDebounceTimeA15) > debounceDelay) {
    buttonStateA15 = readingA15;
  }

  lastButtonStateA2 = readingA2;
  lastButtonStateA3 = readingA3;
  lastButtonStateA4 = readingA4;
  lastButtonStateA5 = readingA5;
  lastButtonStateA13 = readingA13;
  lastButtonStateA14 = readingA14;
  lastButtonStateA15 = readingA15;
  
  mySerialLora.println("*" + String(buttonStateA2) + "," + String(buttonStateA3) + "," + String(buttonStateA4) + "," + String(buttonStateA5) + "," + String(buttonStateA13) + "," + String(buttonStateA14) + "," + String(buttonStateA15) +",#");
  delay(1000);

  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SH110X_WHITE);
  display.setCursor(10, 20);
  display.println("*" + String(buttonStateA2) + "," + String(buttonStateA3) + "," + String(buttonStateA4) + "," + String(buttonStateA5) + ",");
  display.setCursor(10, 40);
  display.println(String(buttonStateA13) + "," + String(buttonStateA14) + "," + String(buttonStateA15) +",#");
  display.display();
  delay(2000);
}
