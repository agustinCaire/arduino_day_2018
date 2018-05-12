#include <DallasTemperature.h>
#include <PID_v1.h>


#define PWM_MAX 255
#define PWM_PIN 6
#define TEMP_PIN 8 

double KP = 768;
double KI = 64;
double KD = 256;

int sampleTime = 200;

double input, output;
double setPoint = 379;

OneWire ourWire(TEMP_PIN); 
DallasTemperature sensors(&ourWire);

PID myPID(&input, &output, &setPoint,KP,KI,KD, REVERSE);


void setup() {
  delay(500);
  
  Serial.begin(9600);
  sensors.begin(); //Se inician los sensores
  sensors.setResolution(12);
  
  myPID.SetMode(AUTOMATIC);
  myPID.SetSampleTime(sampleTime);
  
  setPWM(0);
}

void loop() {
  
  readSerial();
  temperatureLoop();

  if(input==-127)
    return;

  if(setPoint==379)
    setPoint= input+0.2;

  myPID.Compute();

  setPWM(output);

  printStatus();

  delay(1000);

}

void printStatus(){
  
  Serial.print(input,4);

  Serial.print("\t");

  Serial.print(setPoint);

  Serial.print("\t");

  Serial.print(output);

  Serial.print("\t");

  Serial.print(myPID.GetKp());

  Serial.print("\t");

  Serial.print(myPID.GetKi());

  Serial.print("\t");

  Serial.print(myPID.GetKd());

  Serial.print("\t");

  Serial.println(sampleTime);
}


void temperatureLoop(){
  sensors.requestTemperatures(); //Prepara el sensor para la lectura
 
  input = sensors.getTempCByIndex(0); //Realiza la lectura

}

void readSerial(){
  int value;
  String data;
  if(Serial.available()){
    data = Serial.readString();

    char key = data[0];
    String value = data.substring(1,data.length());

    switch(key){
      case 'S':
        setPoint = value.toFloat();
        break;
      case 'P':
        KP = value.toFloat();
        break;
      case 'I':
        KI = value.toFloat();
        break;
      case 'D':
        KD = value.toFloat();
        break;
      case 'M':
        myPID.SetMode(MANUAL);
        output=value.toInt();
        break;
      case 'A':
        myPID.SetMode(AUTOMATIC);
        break;
      case 'T':
        sampleTime= value.toInt();
        myPID.SetSampleTime(sampleTime);
        break;
        
      
    }

    if(key == 'P' || key == 'I' || key == 'D')
      myPID.SetTunings(KP,KI,KD);

    
    
  }
}

void setPWM(int pwm){
    analogWrite(PWM_PIN, PWM_MAX - pwm);
}


