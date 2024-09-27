
// A1 = COMMON 
// A2 = MACHINE_FAULT
// A3 = NO WORK, FULL WORK
// A4 = QUALITY CHECK
// A5 = TOOL CHANGE
// A13 = ARM NO PART
// A14 = ROLLER NO PART
// A15 = PIN NO PART



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


int buttonStateA2 = 0; 
int buttonStateA3 = 0;
int buttonStateA4 = 0;
int buttonStateA5 = 0;
int buttonStateA13 = 0;
int buttonStateA14 = 0;
int buttonStateA15 = 0;

int lastButtonStateA2 = LOW;
int lastButtonStateA3 = LOW;
int lastButtonStateA4 = LOW;
int lastButtonStateA5 = LOW;
int lastButtonStateA13 = LOW;
int lastButtonStateA14 = LOW;
int lastButtonStateA15 = LOW;


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
  display.println("App Run!");
  display.setCursor(20, 40);
  display.println("Version 1.0 TPS");
  display.display();

}

void loop() {



  buttonStateA2 = digitalRead(buttonPinA2);
  if (buttonStateA2 != lastButtonStateA2) {
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
    } else {
      mySerialLora.println(dataOffA2);
      display.clearDisplay();
      display.setTextSize(1);
      display.setTextColor(SH110X_WHITE);
      display.setCursor(10, 20);
      display.println("Data : ");
      display.setCursor(10, 30);
      display.println(dataOffA2);
      display.display();
    }
    lastButtonStateA2 = buttonStateA2;
  }


  buttonStateA3 = digitalRead(buttonPinA3);
  if (buttonStateA3 != lastButtonStateA3) {
    if (buttonStateA3 == HIGH) {
      mySerialLora.println(dataOnA3);
      display.clearDisplay();
      display.setTextSize(1);
      display.setTextColor(SH110X_WHITE);
      display.setCursor(10, 20);
      display.println("Data : ");
      display.setCursor(10, 30);
      display.println(dataOnA3);
      display.display();
    } else {
      mySerialLora.println(dataOffA3);
      display.clearDisplay();
      display.setTextSize(1);
      display.setTextColor(SH110X_WHITE);
      display.setCursor(10, 20);
      display.println("Data : ");
      display.setCursor(10, 30);
      display.println(dataOffA3);
      display.display();
    }
    lastButtonStateA3 = buttonStateA3;
  }

  
  buttonStateA4 = digitalRead(buttonPinA4);
  if (buttonStateA4 != lastButtonStateA4) {
    if (buttonStateA4 == HIGH) {
      mySerialLora.println(dataOnA4);
      display.clearDisplay();
      display.setTextSize(1);
      display.setTextColor(SH110X_WHITE);
      display.setCursor(10, 20);
      display.println("Data : ");
      display.setCursor(10, 30);
      display.println(dataOnA4);
      display.display();
       
    } else {
      mySerialLora.println(dataOffA4);
      display.clearDisplay();
      display.setTextSize(1);
      display.setTextColor(SH110X_WHITE);
      display.setCursor(10, 20);
      display.println("Data : ");
      display.setCursor(10, 30);
      display.println(dataOffA4);
      display.display();
    }
    lastButtonStateA4 = buttonStateA4;
  }

  buttonStateA5 = digitalRead(buttonPinA5);
  if (buttonStateA5 != lastButtonStateA5) {
    if (buttonStateA5 == HIGH) {
      mySerialLora.println(dataOnA5);
      display.clearDisplay();
      display.setTextSize(1);
      display.setTextColor(SH110X_WHITE);
      display.setCursor(10, 20);
      display.println("Data : ");
      display.setCursor(10, 30);
      display.println(dataOnA5);
      display.display(); 
    } else {
      mySerialLora.println(dataOffA5);
      display.clearDisplay();
      display.setTextSize(1);
      display.setTextColor(SH110X_WHITE);
      display.setCursor(10, 20);
      display.println("Data : ");
      display.setCursor(10, 30);
      display.println(dataOffA5);
      display.display();
    }
    lastButtonStateA5 = buttonStateA5;
  }



  buttonStateA13 = digitalRead(buttonPinA13);
  if (buttonStateA13 != lastButtonStateA13) {
    if (buttonStateA13 == HIGH) {
      mySerialLora.println(dataOnA13); 
      display.clearDisplay();
      display.setTextSize(1);
      display.setTextColor(SH110X_WHITE);
      display.setCursor(10, 20);
      display.println("Data : ");
      display.setCursor(10, 30);
      display.println(dataOnA13);
      display.display(); 

    } else {
      mySerialLora.println(dataOffA13);
      display.clearDisplay();
      display.setTextSize(1);
      display.setTextColor(SH110X_WHITE);
      display.setCursor(10, 20);
      display.println("Data : ");
      display.setCursor(10, 30);
      display.println(dataOffA13);
      display.display(); 
    }
    lastButtonStateA13 = buttonStateA13;
  }


  buttonStateA14 = digitalRead(buttonPinA14);
  if (buttonStateA14 != lastButtonStateA14) {
    if (buttonStateA14 == HIGH) {
      mySerialLora.println(dataOnA14);
      display.clearDisplay();
      display.setTextSize(1);
      display.setTextColor(SH110X_WHITE);
      display.setCursor(10, 20);
      display.println("Data : ");
      display.setCursor(10, 30);
      display.println(dataOnA14);
      display.display(); 
    } else {
      mySerialLora.println(dataOffA14);
      display.clearDisplay();
      display.setTextSize(1);
      display.setTextColor(SH110X_WHITE);
      display.setCursor(10, 20);
      display.println("Data : ");
      display.setCursor(10, 30);
      display.println(dataOffA14);
      display.display();
    }
    lastButtonStateA14 = buttonStateA14;
  }


  buttonStateA15 = digitalRead(buttonPinA15);
  if (buttonStateA15 != lastButtonStateA15) {
    if (buttonStateA15 == HIGH) {
      mySerialLora.println(dataOnA15); 
      display.clearDisplay();
      display.setTextSize(1);
      display.setTextColor(SH110X_WHITE);
      display.setCursor(10, 20);
      display.println("Data : ");
      display.setCursor(10, 30);
      display.println(dataOnA15);
      display.display(); 
    } else {
      mySerialLora.println(dataOffA15);
      display.clearDisplay();
      display.setTextSize(1);
      display.setTextColor(SH110X_WHITE);
      display.setCursor(10, 20);
      display.println("Data : ");
      display.setCursor(10, 30);
      display.println(dataOffA15);
      display.display();
      
    }
    lastButtonStateA15 = buttonStateA15;
  }

  delay(50);
}
