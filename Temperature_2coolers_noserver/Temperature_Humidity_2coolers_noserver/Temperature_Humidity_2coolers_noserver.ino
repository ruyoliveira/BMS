#include <DHT22.h>
// Only used for sprintf
#include <stdio.h>

// Data wire is plugged into port 7 on the Arduino
// Connect a 4.7K resistor between VCC and the data pin (strong pullup)
#define DHT22_PIN 7
#define PIR 6
#define LED 5

// Setup a DHT22 instance
DHT22 myDHT22(DHT22_PIN);
int fanMinTimeOn=400;//(milisec*10)Minimum time a fan must stay on(quick turn off turn on problem solution)
int i=0;
float temperatura=0.0;
int contFanOn=400;//Fan minimum time on counter
int contador=0;
int contSensor = 0;
int contMOV=0 ;
void setup(void)
{
  // start serial port
  Serial.begin(9600);
  Serial.println("Leitura da Temperatura e da Humidade");
  pinMode(13, OUTPUT); 
  pinMode(12, OUTPUT); 
  pinMode(PIR, INPUT); 
  pinMode(LED, OUTPUT); 
  digitalWrite(13, LOW);
}

void loop(void)
{ 
  delay(10);
  int sensordemovimento = digitalRead(PIR);
  if(sensordemovimento == HIGH)
  {   
      if(contMOV==0)
      {    
          Serial.print("movimento detectado  ");
          Serial.println(contador);
          contador++;
          digitalWrite(LED, HIGH); 
          contMOV++ ;
       }
  }
  if(contMOV!=0)
  {  
      contMOV++ ;  
  }  
  if(contMOV==100)
  {   
       digitalWrite(LED, LOW);            
       contMOV=0; 
  }
  DHT22_ERROR_t errorCode;    
  contSensor++;
  if (contSensor==200)
  {
      i++;
      errorCode = myDHT22.readData();
      switch(errorCode)
      {
            case DHT_ERROR_NONE:     
                                 char buf[128];         
                                 sprintf(buf, "LEITURA %d: | Temperature %hi.%01hi C |", i, myDHT22.getTemperatureCInt()/10, abs(myDHT22.getTemperatureCInt()%10));
                                 Serial.println(buf);      
                                 break;
            case DHT_ERROR_CHECKSUM:
                                 Serial.print("check sum error ");
                                 Serial.print(myDHT22.getTemperatureC());
                                 Serial.print("C ");
                                 Serial.print(myDHT22.getHumidity());
                                 Serial.println("%");
                                 break;
            case DHT_BUS_HUNG:
                                 Serial.println("BUS Hung ");
                                 break;
            case DHT_ERROR_NOT_PRESENT:
                                 Serial.println("Not Present ");
                                 break;
            case DHT_ERROR_ACK_TOO_LONG:
                                 Serial.println("ACK time out ");
                                 break;
            case DHT_ERROR_SYNC_TIMEOUT:
                                 Serial.println("Sync Timeout ");
                                 break;
            case DHT_ERROR_DATA_TIMEOUT:
                                 Serial.println("Data Timeout ");
                                 break;
            case DHT_ERROR_TOOQUICK:
                                 Serial.println("Polled to quick ");
                                 break;
      }
      contSensor=0;
      temperatura=myDHT22.getTemperatureC(); 
      
      
  }
  if(contFanOn>fanMinTimeOn){
        
            
          if( temperatura >= 23)// aciona o ventilador 1 quando a temperatura for maior ou igual a 25.5 °C
          {
     
                 Serial.println("ACIONANDO O AR-CONDICIONADO.......");
                 digitalWrite(13, HIGH);    
          }
          else {  digitalWrite(13, LOW);  }
      
          if( temperatura < 23)// aciona o ventilador 2 quando a temperatura for menor ou igual a 24.5 °C
          {
             
                Serial.println("ACIONANDO O AQUECEDOR......");
                digitalWrite(12, HIGH); 
               
          }
          else{   digitalWrite(12, LOW); }
          
          contFanOn=0; 
       }
       
       contFanOn++;
  
}

