#include <Arduino.h>
#include <Wire.h>
#include <SoftwareSerial.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SH110X.h>

// Define the button pins
const int buttonPinA2 = 32;
const int buttonPinA3 = 33;

// Variables to store the button states
volatile bool buttonA2State = LOW;
volatile bool buttonA3State = LOW;

// Task handles
TaskHandle_t TaskButtonA2;
TaskHandle_t TaskButtonA3;

void setup() {
  // Initialize the button pins as inputs
  pinMode(buttonPinA2, INPUT);
  pinMode(buttonPinA3, INPUT);

  // Create tasks for handling the buttons
  xTaskCreate(
    TaskButtonA2Function,   // Task function
    "TaskButtonA2",         // Name of the task
    1000,                   // Stack size (in words)
    NULL,                   // Task input parameter
    1,                      // Priority of the task
    &TaskButtonA2           // Task handle
  );

  xTaskCreate(
    TaskButtonA3Function,   // Task function
    "TaskButtonA3",         // Name of the task
    1000,                   // Stack size (in words)
    NULL,                   // Task input parameter
    1,                      // Priority of the task
    &TaskButtonA3           // Task handle
  );
}

void loop() {
  // The loop function can remain empty or handle other tasks
  // as the button handling is done in the RTOS tasks
}

// Task to handle button A2
void TaskButtonA2Function(void * parameter) {
  for (;;) {
    // Read the button state
    buttonA2State = digitalRead(buttonPinA2);

    // Perform action based on the button state
    if (buttonA2State == HIGH) {
      // Button A2 is pressed, perform an action
      Serial.println("Button A2 pressed");
    }

    // Add a small delay to avoid bouncing issues
    vTaskDelay(50 / portTICK_PERIOD_MS);
  }
}

// Task to handle button A3
void TaskButtonA3Function(void * parameter) {
  for (;;) {
    // Read the button state
    buttonA3State = digitalRead(buttonPinA3);

    // Perform action based on the button state
    if (buttonA3State == HIGH) {
      // Button A3 is pressed, perform an action
      Serial.println("Button A3 pressed");
    }

    // Add a small delay to avoid bouncing issues
    vTaskDelay(50 / portTICK_PERIOD_MS);
  }
}
