    /*
    Détecteur de proximité - HC-SR04
    Librairie Ultrasonic : http://tetrasys-design.net/download/HCSR04Ultrasonic/HCSR04Ultrasonic-1.1.2.zip
    Arduino IDE v1.0.1
    */


#define REDPIN 9
#define GREENPIN 10
#define BLUEPIN 11
int LDR_Pin = A0; //analog pin 0
int incomingByte = 0;//receive data from the serial port
 
#define FADESPEED 5    // make this higher to slow down

    void setup()
    {
      Serial.begin(9600);
      pinMode(REDPIN, OUTPUT);
      pinMode(GREENPIN, OUTPUT);
      pinMode(BLUEPIN, OUTPUT);
    }

    void loop()
    {
        int r, g, b;
        int LDRReading = analogRead(LDR_Pin); 
  
        Serial.println(LDRReading);
    delay(250); //just here to slow down the output for easier reading
   
   if (Serial.available() > 0) {
                  // read the incoming byte:
                  incomingByte = Serial.read();
                  //if the lux is low(incoming byte =97)
                  if(incomingByte==97){
                    //Serial.println(incomingByte,DEC);
                    digitalWrite(GREENPIN, HIGH);//turns on green light
  		    digitalWrite(BLUEPIN, HIGH);
  		    digitalWrite(REDPIN, HIGH);
                  }
                  //if the lux is high(incoming byte =98)
                  if(incomingByte==98){
                    digitalWrite(GREENPIN, LOW);
  		    digitalWrite(BLUEPIN, LOW);
    		    digitalWrite(REDPIN, LOW);
                  }
                  
    
    }
}
