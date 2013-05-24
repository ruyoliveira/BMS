
#include <Keypad.h>

const byte ROWS = 4; //four rows
const byte COLS = 3; //three columns
char keys[ROWS][COLS] = {
  {'1','2','3'},
  {'4','5','6'},
  {'7','8','9'},
  {'*','0','#'}
};
byte rowPins[ROWS] = {45, 46, 47, 48}; //connect to the row pinouts of the keypad
byte colPins[COLS] = {42, 43, 44}; //connect to the column pinouts of the keypad




Keypad keypad = Keypad( makeKeymap(keys), rowPins, colPins, ROWS, COLS );


//GREEN AND RED LED
int led_green = 52;
int led_red = 53;

int incomingByte = 0;//receive data from the serial port

void setup(){
  Serial.begin(9600);
   // initialize the digital pin as an output.
    pinMode(led_red, OUTPUT);
    pinMode(led_green, OUTPUT); 
}
  
void loop(){
  if (Serial.available() > 0) {
                // read the incoming byte:
                incomingByte = Serial.read();
                //if the password is correct(incoming byte =97)
                if(incomingByte==97){
                  //Serial.println(incomingByte,DEC);
                  digitalWrite(led_green, HIGH);//turns on green light
                }
                //if the password is incorrect(incoming byte =98)
                if(incomingByte==98){
                  digitalWrite(led_red, HIGH);//turns on red light
                }
                
        }
  char key = keypad.getKey();
  
  if (key){
    digitalWrite(led_green, LOW);//turns off leds
    digitalWrite(led_red, LOW);//turns off leds
    Serial.println(key);//print pressed key to serial port
    
    
    
  }
}
