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

String dataOnA2 = "*signal33on_mcfault#";
String dataOnA3 = "*signal33on_fullwork#";
String dataOnA4 = "*signal33on_qualitycheck#";
String dataOnA5 = "*signal33on_toolchange#";
String dataOnA13 = "*signal33on_arm#";
String dataOnA14 = "*signal33on_roller#";
String dataOnA15 = "*signal33on_pin#";

String dataOffA2 = "*signal33off_mcfault#";
String dataOffA3 = "*signal33off_fullwork#";
String dataOffA4 = "*signal33off_qualitycheck#";
String dataOffA5 = "*signal33off_toolchange#";
String dataOffA13 = "*signal33off_arm#";
String dataOffA14 = "*signal33off_roller#";
String dataOffA15 = "*signal33off_pin#";

int lastButtonStateA2 = LOW;
int lastButtonStateA3 = LOW;
int lastButtonStateA4 = LOW;
int lastButtonStateA5 = LOW;
int lastButtonStateA13 = LOW;
int lastButtonStateA14 = LOW;
int lastButtonStateA15 = LOW;

SoftwareSerial mySerialLora(16, 17); // TX, RX
Adafruit_SH1106G display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

void sendData(String data) {
  for (int x = 0; x < 5; x++) {
    mySerialLora.println(data);
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SH110X_WHITE);
    display.setCursor(10, 20);
    display.println("Data : ");
    display.setCursor(10, 30);
    display.println(data);
    display.display();
    delay(1000);
  }
}

void checkButton(int buttonPin, int &lastButtonState, String dataOn, String dataOff) {
  int buttonState = digitalRead(buttonPin);
  if (buttonState != lastButtonState) {
    if (buttonState == HIGH) {
      sendData(dataOn);
    } else {
      sendData(dataOff);
    }
    lastButtonState = buttonState;
  }
}

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
  display.println("App Run!");
  display.setCursor(20, 40);
  display.println("Version 1.0 TPS");
  display.display();
}

void loop() {
  checkButton(buttonPinA2, lastButtonStateA2, dataOnA2, dataOffA2);
  checkButton(buttonPinA3, lastButtonStateA3, dataOnA3, dataOffA3);
  checkButton(buttonPinA4, lastButtonStateA4, dataOnA4, dataOffA4);
  checkButton(buttonPinA5, lastButtonStateA5, dataOnA5, dataOffA5);
  checkButton(buttonPinA13, lastButtonStateA13, dataOnA13, dataOffA13);
  checkButton(buttonPinA14, lastButtonStateA14, dataOnA14, dataOffA14);
  checkButton(buttonPinA15, lastButtonStateA15, dataOnA15, dataOffA15);

  delay(50);
}
