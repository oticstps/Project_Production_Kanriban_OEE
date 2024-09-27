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

  // Membuat task untuk setiap tombol
  xTaskCreate(TaskA2, "TaskA2", 1000, NULL, 1, NULL);
  xTaskCreate(TaskA3, "TaskA3", 1000, NULL, 1, NULL);
  xTaskCreate(TaskA4, "TaskA4", 1000, NULL, 1, NULL);
  xTaskCreate(TaskA5, "TaskA5", 1000, NULL, 1, NULL);
  xTaskCreate(TaskA13, "TaskA13", 1000, NULL, 1, NULL);
  xTaskCreate(TaskA14, "TaskA14", 1000, NULL, 1, NULL);
  xTaskCreate(TaskA15, "TaskA15", 1000, NULL, 1, NULL);
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
      }
    }
  }
  lastButtonState = reading;
}

// Task untuk masing-masing tombol
void TaskA2(void *pvParameters) {
  while (1) {
    checkButton(buttonPinA2, lastButtonStateA2, buttonStateA2, lastDebounceTimeA2, dataOnA2, dataOffA2);
    vTaskDelay(10 / portTICK_PERIOD_MS);
  }
}

void TaskA3(void *pvParameters) {
  while (1) {
    checkButton(buttonPinA3, lastButtonStateA3, buttonStateA3, lastDebounceTimeA3, dataOnA3, dataOffA3);
    vTaskDelay(10 / portTICK_PERIOD_MS);
  }
}

void TaskA4(void *pvParameters) {
  while (1) {
    checkButton(buttonPinA4, lastButtonStateA4, buttonStateA4, lastDebounceTimeA4, dataOnA4, dataOffA4);
    vTaskDelay(10 / portTICK_PERIOD_MS);
  }
}

void TaskA5(void *pvParameters) {
  while (1) {
    checkButton(buttonPinA5, lastButtonStateA5, buttonStateA5, lastDebounceTimeA5, dataOnA5, dataOffA5);
    vTaskDelay(10 / portTICK_PERIOD_MS);
  }
}

void TaskA13(void *pvParameters) {
  while (1) {
    checkButton(buttonPinA13, lastButtonStateA13, buttonStateA13, lastDebounceTimeA13, dataOnA13, dataOffA13);
    vTaskDelay(10 / portTICK_PERIOD_MS);
  }
}

void TaskA14(void *pvParameters) {
  while (1) {
    checkButton(buttonPinA14, lastButtonStateA14, buttonStateA14, lastDebounceTimeA14, dataOnA14, dataOffA14);
    vTaskDelay(10 / portTICK_PERIOD_MS);
  }
}

void TaskA15(void *pvParameters) {
  while (1) {
    checkButton(buttonPinA15, lastButtonStateA15, buttonStateA15, lastDebounceTimeA15, dataOnA15, dataOffA15);
    vTaskDelay(10 / portTICK_PERIOD_MS);
  }
}

void loop() {
  // Tidak ada yang dilakukan di loop utama
}
