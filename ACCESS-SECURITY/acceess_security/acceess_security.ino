/*
Access module and Security Module mixed
 */
 //acceess includes
#include <Keypad.h>
#include "Arduino.h"
#include <Servo.h> 
//security includes
#include "pitches.h"
#include "IRremote.h"
#include "IRremoteInt.h"

#define PIN_SCE   28
#define PIN_RESET 27
#define PIN_DC    26
#define PIN_SDIN  25
#define PIN_SCLK  24

#define LCD_C     LOW
#define LCD_D     HIGH

#define LCD_X     84
#define LCD_Y     48
#define LCD_CMD   0


static const byte ASCII[][5] =
{
  {
    0x00, 0x00, 0x00, 0x00, 0x00    } // 20
  ,{
    0x00, 0x00, 0x5f, 0x00, 0x00    } // 21 !
  ,{
    0x00, 0x07, 0x00, 0x07, 0x00    } // 22 "
  ,{
    0x14, 0x7f, 0x14, 0x7f, 0x14    } // 23 #
  ,{
    0x24, 0x2a, 0x7f, 0x2a, 0x12    } // 24 $
  ,{
    0x23, 0x13, 0x08, 0x64, 0x62    } // 25 %
  ,{
    0x36, 0x49, 0x55, 0x22, 0x50    } // 26 &
  ,{
    0x00, 0x05, 0x03, 0x00, 0x00    } // 27 '
  ,{
    0x00, 0x1c, 0x22, 0x41, 0x00    } // 28 (
  ,{
    0x00, 0x41, 0x22, 0x1c, 0x00    } // 29 )
  ,{
    0x14, 0x08, 0x3e, 0x08, 0x14    } // 2a *
  ,{
    0x08, 0x08, 0x3e, 0x08, 0x08    } // 2b +
  ,{
    0x00, 0x50, 0x30, 0x00, 0x00    } // 2c ,
  ,{
    0x08, 0x08, 0x08, 0x08, 0x08    } // 2d -
  ,{
    0x00, 0x60, 0x60, 0x00, 0x00    } // 2e .
  ,{
    0x20, 0x10, 0x08, 0x04, 0x02    } // 2f /
  ,{
    0x3e, 0x51, 0x49, 0x45, 0x3e    } // 30 0
  ,{
    0x00, 0x42, 0x7f, 0x40, 0x00    } // 31 1
  ,{
    0x42, 0x61, 0x51, 0x49, 0x46    } // 32 2
  ,{
    0x21, 0x41, 0x45, 0x4b, 0x31    } // 33 3
  ,{
    0x18, 0x14, 0x12, 0x7f, 0x10    } // 34 4
  ,{
    0x27, 0x45, 0x45, 0x45, 0x39    } // 35 5
  ,{
    0x3c, 0x4a, 0x49, 0x49, 0x30    } // 36 6
  ,{
    0x01, 0x71, 0x09, 0x05, 0x03    } // 37 7
  ,{
    0x36, 0x49, 0x49, 0x49, 0x36    } // 38 8
  ,{
    0x06, 0x49, 0x49, 0x29, 0x1e    } // 39 9
  ,{
    0x00, 0x36, 0x36, 0x00, 0x00    } // 3a :
  ,{
    0x00, 0x56, 0x36, 0x00, 0x00    } // 3b ;
  ,{
    0x08, 0x14, 0x22, 0x41, 0x00    } // 3c <
  ,{
    0x14, 0x14, 0x14, 0x14, 0x14    } // 3d =
  ,{
    0x00, 0x41, 0x22, 0x14, 0x08    } // 3e >
  ,{
    0x02, 0x01, 0x51, 0x09, 0x06    } // 3f ?
  ,{
    0x32, 0x49, 0x79, 0x41, 0x3e    } // 40 @
  ,{
    0x7e, 0x11, 0x11, 0x11, 0x7e    } // 41 A
  ,{
    0x7f, 0x49, 0x49, 0x49, 0x36    } // 42 B
  ,{
    0x3e, 0x41, 0x41, 0x41, 0x22    } // 43 C
  ,{
    0x7f, 0x41, 0x41, 0x22, 0x1c    } // 44 D
  ,{
    0x7f, 0x49, 0x49, 0x49, 0x41    } // 45 E
  ,{
    0x7f, 0x09, 0x09, 0x09, 0x01    } // 46 F
  ,{
    0x3e, 0x41, 0x49, 0x49, 0x7a    } // 47 G
  ,{
    0x7f, 0x08, 0x08, 0x08, 0x7f    } // 48 H
  ,{
    0x00, 0x41, 0x7f, 0x41, 0x00    } // 49 I
  ,{
    0x20, 0x40, 0x41, 0x3f, 0x01    } // 4a J
  ,{
    0x7f, 0x08, 0x14, 0x22, 0x41    } // 4b K
  ,{
    0x7f, 0x40, 0x40, 0x40, 0x40    } // 4c L
  ,{
    0x7f, 0x02, 0x0c, 0x02, 0x7f    } // 4d M
  ,{
    0x7f, 0x04, 0x08, 0x10, 0x7f    } // 4e N
  ,{
    0x3e, 0x41, 0x41, 0x41, 0x3e    } // 4f O
  ,{
    0x7f, 0x09, 0x09, 0x09, 0x06    } // 50 P
  ,{
    0x3e, 0x41, 0x51, 0x21, 0x5e    } // 51 Q
  ,{
    0x7f, 0x09, 0x19, 0x29, 0x46    } // 52 R
  ,{
    0x46, 0x49, 0x49, 0x49, 0x31    } // 53 S
  ,{
    0x01, 0x01, 0x7f, 0x01, 0x01    } // 54 T
  ,{
    0x3f, 0x40, 0x40, 0x40, 0x3f    } // 55 U
  ,{
    0x1f, 0x20, 0x40, 0x20, 0x1f    } // 56 V
  ,{
    0x3f, 0x40, 0x38, 0x40, 0x3f    } // 57 W
  ,{
    0x63, 0x14, 0x08, 0x14, 0x63    } // 58 X
  ,{
    0x07, 0x08, 0x70, 0x08, 0x07    } // 59 Y
  ,{
    0x61, 0x51, 0x49, 0x45, 0x43    } // 5a Z
  ,{
    0x00, 0x7f, 0x41, 0x41, 0x00    } // 5b [
  ,{
    0x02, 0x04, 0x08, 0x10, 0x20    } // 5c ¥
  ,{
    0x00, 0x41, 0x41, 0x7f, 0x00    } // 5d ]
  ,{
    0x04, 0x02, 0x01, 0x02, 0x04    } // 5e ^
  ,{
    0x40, 0x40, 0x40, 0x40, 0x40    } // 5f _
  ,{
    0x00, 0x01, 0x02, 0x04, 0x00    } // 60 `
  ,{
    0x20, 0x54, 0x54, 0x54, 0x78    } // 61 a
  ,{
    0x7f, 0x48, 0x44, 0x44, 0x38    } // 62 b
  ,{
    0x38, 0x44, 0x44, 0x44, 0x20    } // 63 c
  ,{
    0x38, 0x44, 0x44, 0x48, 0x7f    } // 64 d
  ,{
    0x38, 0x54, 0x54, 0x54, 0x18    } // 65 e
  ,{
    0x08, 0x7e, 0x09, 0x01, 0x02    } // 66 f
  ,{
    0x0c, 0x52, 0x52, 0x52, 0x3e    } // 67 g
  ,{
    0x7f, 0x08, 0x04, 0x04, 0x78    } // 68 h
  ,{
    0x00, 0x44, 0x7d, 0x40, 0x00    } // 69 i
  ,{
    0x20, 0x40, 0x44, 0x3d, 0x00    } // 6a j 
  ,{
    0x7f, 0x10, 0x28, 0x44, 0x00    } // 6b k
  ,{
    0x00, 0x41, 0x7f, 0x40, 0x00    } // 6c l
  ,{
    0x7c, 0x04, 0x18, 0x04, 0x78    } // 6d m
  ,{
    0x7c, 0x08, 0x04, 0x04, 0x78    } // 6e n
  ,{
    0x38, 0x44, 0x44, 0x44, 0x38    } // 6f o
  ,{
    0x7c, 0x14, 0x14, 0x14, 0x08    } // 70 p
  ,{
    0x08, 0x14, 0x14, 0x18, 0x7c    } // 71 q
  ,{
    0x7c, 0x08, 0x04, 0x04, 0x08    } // 72 r
  ,{
    0x48, 0x54, 0x54, 0x54, 0x20    } // 73 s
  ,{
    0x04, 0x3f, 0x44, 0x40, 0x20    } // 74 t
  ,{
    0x3c, 0x40, 0x40, 0x20, 0x7c    } // 75 u
  ,{
    0x1c, 0x20, 0x40, 0x20, 0x1c    } // 76 v
  ,{
    0x3c, 0x40, 0x30, 0x40, 0x3c    } // 77 w
  ,{
    0x44, 0x28, 0x10, 0x28, 0x44    } // 78 x
  ,{
    0x0c, 0x50, 0x50, 0x50, 0x3c    } // 79 y
  ,{
    0x44, 0x64, 0x54, 0x4c, 0x44    } // 7a z
  ,{
    0x00, 0x08, 0x36, 0x41, 0x00    } // 7b {
  ,{
    0x00, 0x00, 0x7f, 0x00, 0x00    } // 7c |
  ,{
    0x00, 0x41, 0x36, 0x08, 0x00    } // 7d }
  ,{
    0x10, 0x08, 0x08, 0x10, 0x08    } // 7e ←
  ,{
    0x78, 0x46, 0x41, 0x46, 0x78    } // 7f →
};
void LcdCharacter(char character)
{
  LcdWrite(LCD_D, 0x00);
  for (int index = 0; index < 5; index++)
  {
    LcdWrite(LCD_D, ASCII[character - 0x20][index]);
  }
  LcdWrite(LCD_D, 0x00);
}

void LcdClear(void)
{
  for (int index = 0; index < LCD_X * LCD_Y / 8; index++)
  {
    LcdWrite(LCD_D, 0x00);
  }
}

void LcdInitialise(void)
{
  pinMode(PIN_SCE, OUTPUT);
  pinMode(PIN_RESET, OUTPUT);
  pinMode(PIN_DC, OUTPUT);
  pinMode(PIN_SDIN, OUTPUT);
  pinMode(PIN_SCLK, OUTPUT);

  digitalWrite(PIN_RESET, LOW);
  delay(1);
  digitalWrite(PIN_RESET, HIGH);

  LcdWrite( LCD_CMD, 0x21 );  // LCD Extended Commands.
  LcdWrite( LCD_CMD, 0xC4 );  // Set LCD Vop (Contrast). //B1
  LcdWrite( LCD_CMD, 0x04 );  // Set Temp coefficent. //0x04
  LcdWrite( LCD_CMD, 0x14 );  // LCD bias mode 1:48. //0x13
  LcdWrite( LCD_CMD, 0x0C );  // LCD in normal mode. 0x0d for inverse
  LcdWrite(LCD_C, 0x20);
  LcdWrite(LCD_C, 0x0C);
}

void LcdString(char *characters)
{
  while (*characters)
  {
    LcdCharacter(*characters++);
  }
}

void LcdWrite(byte dc, byte data)
{
  digitalWrite(PIN_DC, dc);
  digitalWrite(PIN_SCE, LOW);
  shiftOut(PIN_SDIN, PIN_SCLK, MSBFIRST, data);
  digitalWrite(PIN_SCE, HIGH);
}

void gotoXY(int x, int y)
{
  LcdWrite( 0, 0x80 | x);  // Column.
  LcdWrite( 0, 0x40 | y);  // Row. 
}

/*KEYPAD CONFIG*/
const byte ROWS = 4; //four rows
const byte COLS = 3; //three columns
char keys[ROWS][COLS] = {
  {
    '1','2','3'    }
  ,
  {
    '4','5','6'    }
  ,
  {
    '7','8','9'    }
  ,
  {
    '*','0','#'    }
};
byte rowPins[ROWS] = { 
  45, 46, 47, 48}; //connect to the row pinouts of the keypad
byte colPins[COLS] = { 
  42, 43, 44}; //connect to the column pinouts of the keypad


/*VARIABLES***********************************************************/
int led_green = 52;//green pin pin
int led_red = 53;//red led pin
int i=40;//LCD and PASSWORD counter
int TamanhoSenha = 5;//passwordsize
int incomingByte = 0;//received data from the serial port
int pos = 0;//door position(rotation)
char key;//keypad pressed key 
Servo myservo;//door servo motor
Keypad keypad = Keypad( makeKeymap(keys), rowPins, colPins, ROWS, COLS );//keypad

/*Security variables*/
int recv_pin = 9; //iremote pin
IRrecv irrecv(recv_pin);//iremote intialize
decode_results results;//iremote results var
boolean alarmShout = false;//alarm shouting flag
int buttonPin = 4;//arlarm manual turn off button pin
int buttonState = LOW;//arlarm manual turn off button state flag
int ledPin = 13; // Led Pin

int motionPin1 = 10;// motion detector1 input pin
int motionPin2 = 11;// motion detector2 input pin
int motionPin3 = 12;// motion detector3 input pin
int thisNote = 0;//current playing note
int melody[] = { NOTE_C4, NOTE_G3};// notes in the melody
int noteDurations[] = { 8, 8 };// note durations

/*ARDUINO SETUP*/
void setup(){
  Serial.begin(9600);
  //Select arduino port designed to servo
  myservo.attach(9); 
  myservo.write(0);
  // initialize the digital pin as an output.
  pinMode(led_red, OUTPUT);
  pinMode(led_green, OUTPUT); 
  //Initialise LCD
  LcdInitialise();
  LcdClear();
  //Print initial text to LCD
  LcdString("user: adm");
  gotoXY(0,42);
  LcdString("pswd:"); 
  gotoXY(0,42);
  //Transform passwordSize to another format
  TamanhoSenha = ((TamanhoSenha-1)*8)+8+i;
  /*Security Setup*/
  pinMode(ledPin, OUTPUT);
  pinMode(motionPin1, INPUT); 
  pinMode(motionPin2, INPUT);
  pinMode(motionPin3, INPUT);
  pinMode(buttonPin, INPUT);
  irrecv.enableIRIn(); //begins the receptor
}
/*ARDUINO MAIN LOOP*/
void loop(){
  delay(10);//used as a reference
  //Door control codeblock
  if (Serial.available() > 0) {
    // read the incoming byte:
    incomingByte = Serial.read();
    //if the password is correct(incoming byte =97)
    if(incomingByte==97){
      Serial.println("opening");
      digitalWrite(led_green, HIGH);//turns on green light`
      for(pos = 0; pos < 180; pos += 1)  // goes from 0 degrees to 180 degrees 
      {                                  // in steps of 1 degree 
        myservo.write(pos);              // tell servo to go to position in variable 'pos' 
        delay(15);        // waits 15ms for the servo to reach the position 
        if(pos==50||pos == 100 || pos == 150){
          Serial.println("loading");   
        } 
      } 
      Serial.println("open");
      for(pos = 180; pos>0; pos-=1)     // goes from 180 degrees to 0 degrees 
      {                                
        myservo.write(pos);              // tell servo to go to position in variable 'pos' 
        delay(15);                       // waits 15ms for the servo to reach the position 
        if(pos==50||pos == 100 || pos == 150){
          Serial.println("loading");   
        }  
      }
      Serial.println("closed");
      digitalWrite(led_green, LOW);//turns off leds
      digitalWrite(led_red, LOW);//turns off leds 
      //Clear lcd and return lcd pointer to x=40
      i=40;
      gotoXY (i,42);
      LcdString("        "); 
    }
    //if the password is incorrect(incoming byte =98)
    if(incomingByte==98){
      digitalWrite(led_red, HIGH);//turns on red light
      //Clear lcd and return lcd pointer to x=40
      i=40;
      gotoXY (i,42);
      LcdString("        ");
    }

  }

  //Configure LCD
  int contraste=byte(0xB0);
  LcdWrite( LCD_CMD, 0x21 );  // LCD Extended Commands.
  LcdWrite( LCD_CMD, contraste );  // Set LCD Vop (Contrast). //B1
  LcdWrite( LCD_CMD, 0x04 );  // Set Temp coefficent. //0x04
  LcdWrite( LCD_CMD, 0x14 );  // LCD bias mode 1:48. //0x13
  LcdWrite( LCD_CMD, 0x0C );  // LCD in normal mode. 0x0d for inverse
  LcdWrite(LCD_C, 0x20);
  LcdWrite(LCD_C, 0x0C); 
  
  key= keypad.getKey();//get keypad Presses key   
  if (key){
    digitalWrite(led_green, LOW);//turns off leds
    digitalWrite(led_red, LOW);//turns off leds 
    gotoXY (i,42);//Put lcd cursor on position xy  
    LcdCharacter('*'); //Print '*' (not inserted char) on lcd screen
    Serial.println(key); //Print inserted char on serialport
    i=i+8;
  }
  /*Security Loop*/
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


