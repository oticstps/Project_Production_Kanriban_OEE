#include <Arduino.h>
#include <SoftwareSerial.h>
#include <Adafruit_I2CDevice.h>
#include <SPI.h>

const int buttonPinA2 = 32;
const int buttonPinA3 = 33;
const int buttonPinA4 = 25;
const int buttonPinA5 = 26;
const int pinAndon = 27;

String dataOnA2 = "*signalbarelon_mcfault#";
String dataOnA3 = "*signalbarelon_fullwork#";
String dataOnA4 = "*signalbarelon_qualitycheck#";
String dataOnA5 = "*signalbarelon_qualitycheckmtc#";

String dataOffA2 = "*signalbareloff_mcfault#";
String dataOffA3 = "*signalbareloff_fullwork#";
String dataOffA4 = "*signalbareloff_qualitycheck#";
String dataOffA5 = "*signalbarelon_qualitycheckmtc#";

int buttonStateA2 = LOW;
int buttonStateA3 = LOW;
int buttonStateA4 = LOW;
int buttonStateA5 = LOW;

int lastButtonStateA2 = LOW;
int lastButtonStateA3 = LOW;
int lastButtonStateA4 = LOW;
int lastButtonStateA5 = LOW;

unsigned long lastDebounceTimeA2 = 0;
unsigned long lastDebounceTimeA3 = 0;
unsigned long lastDebounceTimeA4 = 0;
unsigned long lastDebounceTimeA5 = 0;
const unsigned long debounceDelay = 200; // 5 seconds


String dataIn;
String dt[10];
boolean parsing=false;
int i;
SoftwareSerial mySerial(16, 17); //TX, RX
Adafruit_SH1106G display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);





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









void setup() {
  pinMode(buttonPinA2, INPUT);
  pinMode(buttonPinA3, INPUT);
  pinMode(buttonPinA4, INPUT);
  pinMode(buttonPinA5, INPUT);
  pinMode(pinAndon, OUTPUT);
  Serial.begin(9600);
  mySerial.begin(9600);
  dataIn="";


}
 
void loop() {
  int readingA3 = digitalRead(buttonPinA3);
  if(mySerial.available() > 1){
    String dataIn = mySerial.readString();
    int j=0;
    Serial.print("data masuk : ");
    Serial.print(dataIn);
    Serial.print("\n");
    dt[j]="";
    for(i=1;i<dataIn.length();i++){
      if ((dataIn[i] == '#') || (dataIn[i] == ',')){
          j++;
          dt[j]="";
      }else{
          dt[j] = dt[j] + dataIn[i];
      }
    }



    Serial.print("data 1 : ");
    Serial.print(dt[0]);
    if(dt[0] == "signal72off_hoppernopart"){
      digitalWrite(pinAndon, HIGH);
    }
    Serial.print("\n");
    Serial.print("data 2 : ");
    Serial.print(dt[1].toInt());
    Serial.print("\n");
    Serial.print("data 3 : ");
    Serial.print(dt[2].toInt());
    Serial.print("\n");
    Serial.print("data 4 : ");
    Serial.print(dt[3].toInt());
    Serial.print("\n");
    Serial.print("data 5 : ");
    Serial.print(dt[4].toInt());
    Serial.print("\n\n");   
    dataIn = "";

  }else if(readingA3 == LOW){
      digitalWrite(pinAndon, LOW);
    }
  delay(1000);
}
 

