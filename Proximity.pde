    /*
    Détecteur de proximité - HC-SR04
    Librairie Ultrasonic : http://tetrasys-design.net/download/HCSR04Ultrasonic/HCSR04Ultrasonic-1.1.2.zip
    Arduino IDE v1.0.1
    */

    #include <Ultrasonic.h>

    const int Trig = 12;     // pin "Trig" du HC-SR04 connectée à pin 12 de l'Arduino
    const int Echo = 13;     // pin "Echo" du HC-SR04 connectée à pin 13 de l'Arduino

    /*const int green = 10;   // LEDs reliées aux pins de l'Arduino via une résistance
    const int yellow = 11;  // de 150 Ohms.
    const int red = 12;*/

    long cm;                // variable pour stocker la distance de l'objet en cm

    Ultrasonic HCSR04(Trig,Echo);

    void setup()
    {
      Serial.begin(9600);
      /*pinMode(green, OUTPUT);
      pinMode(yellow, OUTPUT);
      pinMode(red, OUTPUT);*/
    }

    void loop()
    {
      // on commence par convertir le temps entre l'émission et la réception du signal
      // en cm, voir http://wiki.tetrasys-design.net/HCSR04Ultrasonic pour le détail
      // des méthodes utilisées
     
      cm = HCSR04.convert(HCSR04.timing(), 1);
      
     
      if(cm >0 && cm < 20)          // objet très proche
      {
        Serial.println(cm);
        // blink(cm, red);
      }
      /*else if(cm >= 20 && cm < 100)  // distance moyenne
      {
        blink(cm, yellow);
      }*/
      else if(cm >= 100)             // objet lointain
      {
        Serial.println(cm);
        // blink(cm, green);
      }
    }

    // La fonction ci-dessous fait clignoter la LED correspondant à la distance.
    // Le clignotement est de plus en plus rapide à mesure que l'objet se rapproche.

    /*void blink(int pause, int ledPin)
    {
      pause = cm * 10;
      digitalWrite(ledPin, HIGH);
      delay(10);
      digitalWrite(ledPin, LOW);
      delay(pause);
    }*/

