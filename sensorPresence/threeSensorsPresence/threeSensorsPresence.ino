/**
Changed inside IRemoteInt, changed everything using timer 2 to another timer.
reason:lib tone uses timer2
**/
#include "pitches.h"
#include "IRremote.h"
#include "IRremoteInt.h"

int recv_pin = 9; // porta do iremote
IRrecv irrecv(recv_pin);
decode_results results;

boolean alarmShout = false;
int buttonPin = 4;
int buttonState = LOW;
int ledPin = 13; // Led Pin

int motionPin1 = 10; // motion detector input pin
int motionPin2 = 11;
int motionPin3 = 12;
int thisNote = 0;
// notes in the melody
int melody[] = { 
  NOTE_C4, NOTE_G3};
// note durations
int noteDurations[] = {
  8, 8 };

void setup() {
  Serial.begin(9600);
  pinMode(ledPin, OUTPUT);
  pinMode(motionPin1, INPUT); 
  pinMode(motionPin2, INPUT);
  pinMode(motionPin3, INPUT);
  pinMode(buttonPin, INPUT);
  irrecv.enableIRIn(); // begins the receptor
}

void loop() {  
  buttonState = digitalRead(buttonPin);
  int sensor1 = digitalRead(motionPin1); // reads the motion pin
  int sensor2 = digitalRead(motionPin2);
  int sensor3 = digitalRead(motionPin3);
  
   if(irrecv.decode(&results))
  {
    long int decCode = results.value;
  ///  Serial.println(decCode);//Use this to discover the button value you need
    switch (decCode)
    {
      case 2011242671:
        if(alarmShout){
          alarmShout = false;
          Serial.println("OFF");
        }
        else{
          Serial.println("ALARM");
          alarmShout = true;        
        }        
        break;       
    }
    irrecv.resume(); //recebe proximo valor
  }  
   if(sensor1 == HIGH && !alarmShout){
     Serial.println("ALARM1");
    alarmShout = true;
  }
  if( sensor2 == HIGH&& !alarmShout){
     Serial.println("ALARM2");
    alarmShout = true;
  }
   if( sensor3 == HIGH&& !alarmShout){
     Serial.println("ALARM3");
    alarmShout = true;
  }
   if(alarmShout){
    digitalWrite(ledPin, HIGH);  
    
// to calculate the note duration, take one second divided by the note type     
    int noteDuration = 1000/noteDurations[thisNote];    
    tone(8, melody[thisNote],noteDuration);
    int pauseBetweenNotes = noteDuration * 1.30;
    delay(pauseBetweenNotes);
 
    if(thisNote == 0)
      thisNote = 1;
    else
      thisNote = 0;
    
  }else
    digitalWrite(ledPin, LOW);
    
  if(buttonState == HIGH && alarmShout){
    alarmShout = false;
    Serial.println("BUTTON OFF");
  }
}
