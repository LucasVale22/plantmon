#include <NeoSWSerial.h>
#include <ArduinoJson.h>

#define D7 10
#define D8 11
#define BAUD_RATE 19200

#define JSON_SENSORS_OBJECT_SIZE 8
#define JSON_ADDITIONAL_BYTES 200

char* sensor_port[] = {"LDR_L_A0", "HIG_U_A1", "LDR_L_A2", "HIG_U_A3", "LDR_L_A4", "HIG_U_A5", "LDR_L_A6", "HIG_U_A7"};

NeoSWSerial mySerial(D7, D8);

float getLightValue(int port) {
    
    int sensorValue = analogRead(port);
  
    float voltage = sensorValue * (5.0 / 1023.0);   
    float light = voltage * (100.0 / 5.0); 
  
  return light;

}

float getAirHumidityValue(int port) {
    
    int sensorValue = analogRead(port);
   
    float soil_moisture = 100 * ((1023 - (float)sensorValue) / 1023 ); 
  
    return soil_moisture;

}
 
void setup() {
  Serial.begin(BAUD_RATE);
  mySerial.begin(BAUD_RATE);
}
 
void loop() {

   float sensor_reading; 
   char port = 0;
   const size_t json_capacity = JSON_OBJECT_SIZE(JSON_SENSORS_OBJECT_SIZE) + JSON_ADDITIONAL_BYTES ; 
   DynamicJsonDocument sensors_data(json_capacity);

   for(int counter = 0; counter < JSON_SENSORS_OBJECT_SIZE; counter++)
   {
       if(counter % 2 == 0) 
       {
          sensor_reading = getLightValue(port);
       }
       else
       {
          sensor_reading = getAirHumidityValue(port);
       }
       sensors_data[sensor_port[counter]] = sensor_reading;
       port++;
   }

   serializeJsonPretty(sensors_data, Serial); 
 
  if(Serial.available())
  {
    Serial.println("Entrou aqui");
    serializeJson(sensors_data, Serial);
  }
  delay(5000);
}

