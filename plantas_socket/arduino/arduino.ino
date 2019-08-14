#include <SoftwareSerial.h>
#include <ArduinoJson.h>
SoftwareSerial s(5,6);
 
void setup() {
s.begin(9600);
}
 
void loop() {
 StaticJsonBuffer<1000> jsonBuffer;
 JsonObject& root = jsonBuffer.createObject();
 int ldr = analogRead(A0);
  root["data1"] = 100;
  root["data2"] = 200;
  root["ldr"] = ldr;
if(s.available()>0)
{
 root.printTo(s);
}
}

