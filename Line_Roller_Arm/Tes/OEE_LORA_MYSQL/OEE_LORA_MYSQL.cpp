#include <Arduino.h>
#include <SoftwareSerial.h>
#include <ezButton.h>
#include <Adafruit_I2CDevice.h>
#include <SPI.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SH110X.h>
#include <WiFi.h>
#include <MySQL_Connection.h>
#include <MySQL_Cursor.h>

#define BUTTON_PIN_A2 32
#define BUTTON_PIN_A3 33
#define BUTTON_PIN_A4 25
#define BUTTON_PIN_A5 26
#define BUTTON_PIN_A13 26
#define BUTTON_PIN_A14 26
#define BUTTON_PIN_A15 26

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1

const char* ssid = "Pena";
const char* password = "pasbatron";
IPAddress server_addr(127,0,0,1); // Replace with your MySQL server IP
char user[] = "root";              // MySQL user
char db[] = "database_ujicoba";    // MySQL database name

ezButton buttonA2(BUTTON_PIN_A2);
ezButton buttonA3(BUTTON_PIN_A3);
ezButton buttonA4(BUTTON_PIN_A4);
ezButton buttonA5(BUTTON_PIN_A5);
ezButton buttonA13(BUTTON_PIN_A13);
ezButton buttonA14(BUTTON_PIN_A14);
ezButton buttonA15(BUTTON_PIN_A15);

SoftwareSerial mySerial(16, 17); // TX, RX
Adafruit_SH1106G display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);
WiFiClient client;
MySQL_Connection conn(&client);

void setup() {
  Serial.begin(9600);
  mySerial.begin(9600);

  buttonA2.setDebounceTime(200);
  buttonA3.setDebounceTime(200);
  buttonA4.setDebounceTime(200);
  buttonA5.setDebounceTime(200);
  buttonA13.setDebounceTime(200);
  buttonA14.setDebounceTime(200);
  buttonA15.setDebounceTime(200);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  if (conn.connect(server_addr, 3307, user)) {
    Serial.println("Connected to MySQL Server");
  } else {
    Serial.println("Connection failed.");
  }

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

  sendGPIOStatusToDatabase();

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
    delay(1000);
  }

  if (buttonA2.isReleased()) {
    mySerial.println("*signal33off_mcfault#");
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SH110X_WHITE);
    display.setCursor(20, 20);
    display.println("Data : ");
    display.setCursor(20, 40);
    display.println("*signal33off_mcfault#");
    display.display();
    delay(1000);
  }

  if (buttonA3.isPressed()) {
    mySerial.println("*signal33on_fullwork#");
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SH110X_WHITE);
    display.setCursor(20, 20);
    display.println("Data : ");
    display.setCursor(20, 40);
    display.println("27_on");
    display.display();
    delay(1000);
  }

  if (buttonA3.isReleased()) {
    mySerial.println("*signal33off_fullwork#");
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SH110X_WHITE);
    display.setCursor(20, 20);
    display.println("Data : ");
    display.setCursor(20, 40);
    display.println("*signal33off_fullwork#");
    display.display();
    delay(1000);
  }

  if (buttonA4.isPressed()) {
    mySerial.println("*signal33on_qualitycheck#");
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SH110X_WHITE);
    display.setCursor(20, 20);
    display.println("Data : ");
    display.setCursor(20, 40);
    display.println("*signal33on_qualitycheck#");
    display.display();
    delay(1000);
  }

  if (buttonA4.isReleased()) {
    mySerial.println("*signal33off_qualitycheck#");
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SH110X_WHITE);
    display.setCursor(20, 20);
    display.println("Data : ");
    display.setCursor(20, 40);
    display.println("*signal33off_qualitycheck#");
    display.display();
    delay(1000);
  }

  if (buttonA5.isPressed()) {
    mySerial.println("*signal33on_toolchange#");
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SH110X_WHITE);
    display.setCursor(20, 20);
    display.println("Data : ");
    display.setCursor(20, 40);
    display.println("*signal33on_toolchange#");
    display.display();
    delay(1000);
  }

  if (buttonA5.isReleased()) {
    mySerial.println("*signal33off_toolchange#");
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SH110X_WHITE);
    display.setCursor(20, 20);
    display.println("Data : ");
    display.setCursor(20, 40);
    display.println("*signal33off_toolchange#");
    display.display();
    delay(1000);
  }

  if (buttonA13.isPressed()) {
    mySerial.println("*signal33on_arm#");
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SH110X_WHITE);
    display.setCursor(20, 20);
    display.println("Data : ");
    display.setCursor(20, 40);
    display.println("*signal33on_arm#");
    display.display();
    delay(1000);
  }

  if (buttonA13.isReleased()) {
    mySerial.println("*signal33off_arm#");
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SH110X_WHITE);
    display.setCursor(20, 20);
    display.println("Data : ");
    display.setCursor(20, 40);
    display.println("*signal33off_arm#");
    display.display();
    delay(1000);
  }

  if (buttonA14.isPressed()) {
    mySerial.println("*signal33on_roller#");
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SH110X_WHITE);
    display.setCursor(20, 20);
    display.println("Data : ");
    display.setCursor(20, 40);
    display.println("*signal33on_roller#");
    display.display();
    delay(1000);
  }

  if (buttonA14.isReleased()) {
    mySerial.println("*signal33off_roller#");
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SH110X_WHITE);
    display.setCursor(20, 20);
    display.println("Data : ");
    display.setCursor(20, 40);
    display.println("*signal33off_roller#");
    display.display();
    delay(1000);
  }

  if (buttonA15.isPressed()) {
    mySerial.println("*signal33on_pin#");
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SH110X_WHITE);
    display.setCursor(20, 20);
    display.println("Data : ");
    display.setCursor(20, 40);
    display.println("*signal33on_pin#");
    display.display();
    delay(1000);
  }

  if (buttonA15.isReleased()) {
    mySerial.println("*signal33off_pin#");
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SH110X_WHITE);
    display.setCursor(20, 20);
    display.println("Data : ");
    display.setCursor(20, 40);
    display.println("*signal33off_pin#");
    display.display();
    delay(1000);
  }
}

void sendGPIOStatusToDatabase() {
  char query[256];
  int buttonA2State = digitalRead(BUTTON_PIN_A2);
  int buttonA3State = digitalRead(BUTTON_PIN_A3);
  int buttonA4State = digitalRead(BUTTON_PIN_A4);
  int buttonA5State = digitalRead(BUTTON_PIN_A5);
  int buttonA13State = digitalRead(BUTTON_PIN_A13);
  int buttonA14State = digitalRead(BUTTON_PIN_A14);
  int buttonA15State = digitalRead(BUTTON_PIN_A15);

  sprintf(query, "INSERT INTO gpio_status (button_a2, button_a3, button_a4, button_a5, button_a13, button_a14, button_a15) VALUES (%d, %d, %d, %d, %d, %d, %d);",
          buttonA2State, buttonA3State, buttonA4State, buttonA5State, buttonA13State, buttonA14State, buttonA15State);
  
  MySQL_Cursor *cur_mem = new MySQL_Cursor(&conn);
  cur_mem->execute(query);
  delete cur_mem;
  
  delay(1000);  // Send the data every second
}
