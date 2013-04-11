/* @file HelloKeypad.pde
|| @version 1.0
|| @author Alexander Brevig
|| @contact alexanderbrevig@gmail.com
||
|| @description
|| | Demonstrates the simplest use of the matrix Keypad library.
|| #
*/
#include <Keypad.h>
#include <OneWire.h>

OneWire  ds(32);  // on pin 10
int fan_control = 33;
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
    //initialize motor pin
    pinMode(fan_control, OUTPUT);
}
  
void loop(){
  byte i;
  byte present = 0;
  byte type_s;
  byte data[12];
  byte addr[8];
  float celsius, fahrenheit;
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
    Serial.println(key);
  }
  
  if ( !ds.search(addr)) {
    ds.reset_search();
    delay(250);
    return;
  }
  

  if (OneWire::crc8(addr, 7) != addr[7]) {
      return;
  }
 
  // the first ROM byte indicates which chip
  switch (addr[0]) {
    case 0x10:
      type_s = 1;
      break;
    case 0x28:
      type_s = 0;
      break;
    case 0x22:
      type_s = 0;
      break;
    default:
      return;
  } 

  ds.reset();
  ds.select(addr);
  ds.write(0x44,1);         // start conversion, with parasite power on at the end
  
  delay(1000);     // maybe 750ms is enough, maybe not
  // we might do a ds.depower() here, but the reset will take care of it.
  
  present = ds.reset();
  ds.select(addr);    
  ds.write(0xBE);         // Read Scratchpad
  for ( i = 0; i < 9; i++) {           // we need 9 bytes
    data[i] = ds.read();
  }

  unsigned int raw = (data[1] << 8) | data[0];
  if (type_s) {
    raw = raw << 3; // 9 bit resolution default
    if (data[7] == 0x10) {
      // count remain gives full 12 bit resolution
      raw = (raw & 0xFFF0) + 12 - data[6];
    }
  } else {
    byte cfg = (data[4] & 0x60);
    if (cfg == 0x00) raw = raw << 3;  // 9 bit resolution, 93.75 ms
    else if (cfg == 0x20) raw = raw << 2; // 10 bit res, 187.5 ms
    else if (cfg == 0x40) raw = raw << 1; // 11 bit res, 375 ms
    // default is 12 bit resolution, 750 ms conversion time
  }
  celsius = (float)raw / 16.0;
  fahrenheit = celsius * 1.8 + 32.0;
  Serial.print ("t");
  Serial.print(celsius);
  Serial.print ("\r\n");
  
}
