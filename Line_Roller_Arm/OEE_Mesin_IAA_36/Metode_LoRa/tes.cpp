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

String dataOnA2 = "*signal36on_mcfault#";
String dataOnA3 = "*signal36on_fullwork#";
String dataOnA4 = "*signal36on_qualitycheck#";
String dataOnA5 = "*signal36on_toolchange#";
String dataOnA13 = "*signal36on_arm#";
String dataOnA14 = "*signal36on_roller#";
String dataOnA15 = "*signal36on_pin#";

String dataOffA2 = "*signal36off_mcfault#";
String dataOffA3 = "*signal36off_fullwork#";
String dataOffA4 = "*signal36off_qualitycheck#";
String dataOffA5 = "*signal36off_toolchange#";
String dataOffA13 = "*signal36off_arm#";
String dataOffA14 = "*signal36off_roller#";
String dataOffA15 = "*signal36off_pin#";

int buttonStateA2 = LOW;
int buttonStateA3 = LOW;
int buttonStateA4 = LOW;
int buttonStateA5 = LOW;
int buttonStateA13 = LOW;
int buttonStateA14 = LOW;
int buttonStateA15 = LOW;

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

void loop() {
  // Periksa setiap tombol dan kirimkan statusnya
  checkAndSendData(buttonPinA2, dataOnA2, dataOffA2);
  checkAndSendData(buttonPinA3, dataOnA3, dataOffA3);
  checkAndSendData(buttonPinA4, dataOnA4, dataOffA4);
  checkAndSendData(buttonPinA5, dataOnA5, dataOffA5);
  checkAndSendData(buttonPinA13, dataOnA13, dataOffA13);
  checkAndSendData(buttonPinA14, dataOnA14, dataOffA14);
  checkAndSendData(buttonPinA15, dataOnA15, dataOffA15);

  delay(1000);
}

void checkAndSendData(int buttonPin, String dataOn, String dataOff) {
  int buttonState = digitalRead(buttonPin);
  String dataToSend;

  if (buttonState == HIGH) {
    dataToSend = dataOn;
  } else {
    dataToSend = dataOff;
  }


  mySerialLora.println(dataToSend);

  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SH110X_WHITE);
  display.setCursor(10, 20);
  display.println("Data : ");
  display.setCursor(10, 30);
  display.println(dataToSend);
  display.display();
}
