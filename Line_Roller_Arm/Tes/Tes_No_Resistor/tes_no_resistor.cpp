void loop() {
  buttonA2.loop();
  buttonA3.loop();
  buttonA4.loop();
  buttonA5.loop();
  buttonA13.loop();
  buttonA14.loop();
  buttonA15.loop();

  // Untuk tombol A2
  if (buttonA2.isPressed() || buttonA2.isReleased()) {
    if (buttonA2.isPressed()) {
      mySerial.println("*signal33on_mcfault#");
      displayMessage("*signal33on_mcfault#");
    } else {
      mySerial.println("*signal33off_mcfault#");
      displayMessage("*signal33off_mcfault#");
    }
  }

  // Untuk tombol A3
  if (buttonA3.isPressed() || buttonA3.isReleased()) {
    if (buttonA3.isPressed()) {
      mySerial.println("*signal33on_fullwork#");
      displayMessage("*signal33on_fullwork#");
    } else {
      mySerial.println("*signal33off_fullwork#");
      displayMessage("*signal33off_fullwork#");
    }
  }

  // Ulangi pola ini untuk tombol-tombol lainnya
  if (buttonA4.isPressed() || buttonA4.isReleased()) {
    if (buttonA4.isPressed()) {
      mySerial.println("*signal33on_qualitycheck#");
      displayMessage("*signal33on_qualitycheck#");
    } else {
      mySerial.println("*signal33off_qualitycheck#");
      displayMessage("*signal33off_qualitycheck#");
    }
  }

  if (buttonA5.isPressed() || buttonA5.isReleased()) {
    if (buttonA5.isPressed()) {
      mySerial.println("*signal33on_toolchange#");
      displayMessage("*signal33on_toolchange#");
    } else {
      mySerial.println("*signal33off_toolchange#");
      displayMessage("*signal33off_toolchange#");
    }
  }

  if (buttonA13.isPressed() || buttonA13.isReleased()) {
    if (buttonA13.isPressed()) {
      mySerial.println("*signal33on_arm#");
      displayMessage("*signal33on_arm#");
    } else {
      mySerial.println("*signal33off_arm#");
      displayMessage("*signal33off_arm#");
    }
  }

  if (buttonA14.isPressed() || buttonA14.isReleased()) {
    if (buttonA14.isPressed()) {
      mySerial.println("*signal33on_roller#");
      displayMessage("*signal33on_roller#");
    } else {
      mySerial.println("*signal33off_roller#");
      displayMessage("*signal33off_roller#");
    }
  }

  if (buttonA15.isPressed() || buttonA15.isReleased()) {
    if (buttonA15.isPressed()) {
      mySerial.println("*signal33on_pin#");
      displayMessage("*signal33on_pin#");
    } else {
      mySerial.println("*signal33off_pin#");
      displayMessage("*signal33off_pin#");
    }
  }
}

void displayMessage(const char* message) {
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SH110X_WHITE);
  display.setCursor(20, 20);
  display.println("Data : ");
  display.setCursor(20, 40);
  display.println(message);
  display.display();
}
