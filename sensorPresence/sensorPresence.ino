#include "pitches.h"

int ledPin = 13; // Led Pin
int motionPin = 2; // motion detector input pin
// notes in the melody
int melody[] = { 
  NOTE_C4, NOTE_G3};
// note durations
int noteDurations[] = {
  8, 8 };

void setup() {
  pinMode(ledPin, OUTPUT);
  pinMode(motionPin, INPUT); 
}

void loop() {  
  int sensor = digitalRead(motionPin); // reads the motion pin
  
  if(sensor == HIGH){
    digitalWrite(ledPin, HIGH);    
// to calculate the note duration, take one second divided by the note type    
  for (int thisNote = 0; thisNote < 2; thisNote++) {
    int noteDuration = 1000/noteDurations[thisNote];    
    tone(8, melody[thisNote],noteDuration);
    int pauseBetweenNotes = noteDuration * 1.30;
    delay(pauseBetweenNotes);
 // noTone(8);
    }
  }else
    digitalWrite(ledPin, LOW);
}
