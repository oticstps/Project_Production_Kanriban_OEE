#include <Arduino.h>
#include <Wire.h>
#include <SoftwareSerial.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SH110X.h>
#include <freertos/FreeRTOS.h>
#include <freertos/task.h>

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

SoftwareSerial mySerialLora(16, 17); // TX, RX
Adafruit_SH1106G display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

void checkButton(void *parameter) {
  // Extract parameters
  int buttonPin = ((int *)parameter)[0];
  String dataOn = ((String *)parameter)[1];
  String dataOff = ((String *)parameter)[2];

  int buttonState = LOW;
  int lastButtonState = LOW;
  unsigned long lastDebounceTime = 0;
  const unsigned long debounceDelay = 5000; // 5 seconds

  while (1) {
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
          delay(1000);
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
          delay(1000);
        }
      }
    }

    lastButtonState = reading;
    vTaskDelay(300 / portTICK_PERIOD_MS); // Delay to prevent task hogging the CPU
  }
}

void setup() {
  mySerialLora.begin(9600);
  
  // Initialize display
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

  // Define buttons
  int buttonPins[] = {buttonPinA2, buttonPinA3, buttonPinA4, buttonPinA5, buttonPinA13, buttonPinA14, buttonPinA15};
  String dataOn[] = {dataOnA2, dataOnA3, dataOnA4, dataOnA5, dataOnA13, dataOnA14, dataOnA15};
  String dataOff[] = {dataOffA2, dataOffA3, dataOffA4, dataOffA5, dataOffA13, dataOffA14, dataOffA15};

  // Create tasks
  for (int i = 0; i < 7; i++) {
    xTaskCreate(checkButton, "Task", 2048, (void *)new int[3]{buttonPins[i], dataOn[i], dataOff[i]}, 1, NULL);
  }
}

void loop() {
  // Empty loop since tasks are handling everything
}
