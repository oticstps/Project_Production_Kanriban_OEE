#include <Arduino.h>
#include <SoftwareSerial.h>
#include <ezButton.h>
#include <Adafruit_I2CDevice.h>
#include <SPI.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SH110X.h>

#define BUTTON_PIN_A2 32
#define BUTTON_PIN_A3 33
#define BUTTON_PIN_A4 25
#define BUTTON_PIN_A5 26
#define BUTTON_PIN_A13 27
#define BUTTON_PIN_A14 14
#define BUTTON_PIN_A15 12

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1

ezButton buttonA2(BUTTON_PIN_A2);
ezButton buttonA3(BUTTON_PIN_A3);
ezButton buttonA4(BUTTON_PIN_A4);
ezButton buttonA5(BUTTON_PIN_A5);
ezButton buttonA13(BUTTON_PIN_A13);
ezButton buttonA14(BUTTON_PIN_A14);
ezButton buttonA15(BUTTON_PIN_A15);


SoftwareSerial mySerial(16, 17); // TX, RX
Adafruit_SH1106G display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

void setup() {
  mySerial.begin(9600);
  buttonA2.setDebounceTime(3000);
  buttonA3.setDebounceTime(3000);
  buttonA4.setDebounceTime(3000);
  buttonA5.setDebounceTime(3000);
  buttonA13.setDebounceTime(3000);
  buttonA14.setDebounceTime(3000);
  buttonA15.setDebounceTime(3000);


  if (!display.begin(0x3C)) {
    while (true);
  }
  delay(2000);
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SH110X_WHITE);
  display.setCursor(20, 20);
  display.println("App Running.!");
  display.setCursor(20, 40);
  display.println("Version 1.0 TPS");
  display.display();
}

void loop() {
  buttonA2.loop();
  buttonA3.loop();
  buttonA4.loop();
  buttonA5.loop();
  buttonA13.loop();
  buttonA14.loop();
  buttonA15.loop();

  if (buttonA2.isPressed()) {
    mySerial.println("*signal33on_mcfault#");
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SH110X_WHITE);
    display.setCursor(20, 20);
    display.println("Data : ");
    display.setCursor(20, 40);
    display.println("*signal33on_mcfault#");
    display.display();
    
  }

  else if (buttonA2.isReleased()) {
    mySerial.println("*signal33off_mcfault#");
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SH110X_WHITE);
    display.setCursor(20, 20);
    display.println("Data : ");
    display.setCursor(20, 40);
    display.println("*signal33off_mcfault#");
    display.display();
    
  }

  else if (buttonA3.isPressed()) {
    mySerial.println("*signal33on_fullwork#");
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SH110X_WHITE);
    display.setCursor(20, 20);
    display.println("Data : ");
    display.setCursor(20, 40);
    display.println("signal33on_fullwork");
    display.display();
    
  }

  else if (buttonA3.isReleased()) {
    mySerial.println("*signal33off_fullwork#");
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SH110X_WHITE);
    display.setCursor(20, 20);
    display.println("Data : ");
    display.setCursor(20, 40);
    display.println("*signal33off_fullwork#");
    display.display();
    
  }

  else if (buttonA4.isPressed()) {
    mySerial.println("*signal33on_qualitycheck#");
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SH110X_WHITE);
    display.setCursor(20, 20);
    display.println("Data : ");
    display.setCursor(20, 40);
    display.println("*signal33on_qualitycheck#");
    display.display();
    
  }

  else if (buttonA4.isReleased()) {
    mySerial.println("*signal33off_qualitycheck#");
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SH110X_WHITE);
    display.setCursor(20, 20);
    display.println("Data : ");
    display.setCursor(20, 40);
    display.println("*signal33off_qualitycheck#");
    display.display();
    
  }

  else if (buttonA5.isPressed()) {

    mySerial.println("*signal33on_toolchange#");
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SH110X_WHITE);
    display.setCursor(20, 20);
    display.println("Data : ");
    display.setCursor(20, 40);
    display.println("*signal33on_toolchange#");
    display.display();
    
  }

  else if (buttonA5.isReleased()) {
    mySerial.println("*signal33off_toolchange#");
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SH110X_WHITE);
    display.setCursor(20, 20);
    display.println("Data : ");
    display.setCursor(20, 40);
    display.println("*signal33off_toolchange#");
    display.display();
    
  }

  else if (buttonA13.isPressed()) {
    mySerial.println("*signal33on_arm#");
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SH110X_WHITE);
    display.setCursor(20, 20);
    display.println("Data : ");
    display.setCursor(20, 40);
    display.println("*signal33on_arm#");
    display.display();
    
  }

  else if (buttonA13.isReleased()) {
    mySerial.println("*signal33off_arm#");
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SH110X_WHITE);
    display.setCursor(20, 20);
    display.println("Data : ");
    display.setCursor(20, 40);
    display.println("*signal33off_arm#");
    display.display();
    
  }


  else if (buttonA14.isPressed()) {
    mySerial.println("*signal33on_roller#");
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SH110X_WHITE);
    display.setCursor(20, 20);
    display.println("Data : ");
    display.setCursor(20, 40);
    display.println("*signal33on_roller#");
    display.display();
    
  }

  else if (buttonA14.isReleased()) {
    mySerial.println("*signal33off_roller#");
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SH110X_WHITE);
    display.setCursor(20, 20);
    display.println("Data : ");
    display.setCursor(20, 40);
    display.println("*signal33off_roller#");
    display.display();
    
  }

  else if (buttonA15.isPressed()) {
    mySerial.println("*signal33on_pin#");
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SH110X_WHITE);
    display.setCursor(20, 20);
    display.println("Data : ");
    display.setCursor(20, 40);
    display.println("*signal33on_pin#");
    display.display();
    
  }

  else if (buttonA15.isReleased()) {
    mySerial.println("*signal33off_pin#");
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SH110X_WHITE);
    display.setCursor(20, 20);
    display.println("Data : ");
    display.setCursor(20, 40);
    display.println("*signal33off_pin#");
    display.display();
    
  }
  delay(1100);
}