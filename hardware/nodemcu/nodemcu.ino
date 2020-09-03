// ############# LIBRARIES ############### //
#include <SoftwareSerial.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>

SoftwareSerial mySerial(D7,D8);

// ############# VARIABLES ############### //

const char* SSID = "cacau.dog"; // rede wifi
const char* PASSWORD = "v@l3_s4nt05"; // senha da rede wifi

String BASE_URL = "http://192.168.0.105:3333/";

const String nodemcu_id = "n0d3mcu02";
const String nodemcu_name = "NodeMCU_2";
bool recorded = false;
const int request_delay = 5000;
const int send_data_delay = 10000;
// ############# PROTOTYPES ############### //

void initSerial();
void initWiFi();
String sendSynchronizationRequest(String path);
String receiveSynchronizationResponse(String path);
String sendSensorData(String path, String temperature, String airHumidity, String light, String soilMoisture);

// ############### OBJECTS ################# //

WiFiClient client;
HTTPClient http;

bool verifyRequest(int httpCode) {
  //Erro na requisição
  if (httpCode < 0) {
    Serial.println("request error - " + httpCode);
    return true;
  }
  else {
    //Erro na resposta
    if (httpCode != HTTP_CODE_OK) {
      return true;
    }
    else {
      return false;
    }
  }

}

float getLightValue(int send_data_delay) {

  float last_values_mean = 0;
  int read_delay = send_data_delay / 10;
  int samples_number = send_data_delay / read_delay;
  

  for(int counter = 1; counter <=  samples_number; counter++) {
    
    int sensorValue = analogRead(A0);
  
    float voltage = sensorValue * (5.0 / 1023.0);   // Convert the analog reading (which goes from 0 - 1023) to a voltage (0 - 5V)
    float light = voltage * (100.0 / 5.0); //Convertendo para escala de porcentagem

    last_values_mean += light / samples_number;

    delay(read_delay);
    
  }
  
  return last_values_mean;

}

//Inicializacao das portas seriais e da conexao com o wifi: toda vez que o nodemcu for ligado na energia

void setup() {
  initSerial();
  initWiFi();
}

//Comunicacao e sincronizacao do NodeMCU com o Aplicativo

void loop() {

  const size_t bufferSize = JSON_OBJECT_SIZE(2) + JSON_OBJECT_SIZE(3) + JSON_OBJECT_SIZE(5) + JSON_OBJECT_SIZE(8) + 370;

  String post_sync_response = "";
  String get_sync_response = "";
  String put_sensor_response = "";
  
  DynamicJsonBuffer jsonBuffer(bufferSize);

  /*Trecho de teste*/
  if(mySerial.available() > 0 ) {
    JsonObject& rootnano = jsonBuffer.parseObject(mySerial);
    if (rootnano == JsonObject::invalid())
      return;
    Serial.print("arduino nano ");
    Serial.println("");
    float data1dr=rootnano["ldr"];
    Serial.print(data1dr);
  }
  
  /***********************************************/

  //Pedido de sincronizacao do NodeMCU no BD
  if (!recorded) {

    post_sync_response = sendSynchronizationRequest("nodemcu");
    Serial.println("Identificando dispositivo " + nodemcu_name + "(" + nodemcu_id + ") na rede..." );
    Serial.println("");
    delay(request_delay);
  }
  else {
    Serial.println(nodemcu_name + "(" + nodemcu_id + ") disponivel!");
    Serial.println(post_sync_response);
  }

  //Resposta de sincronizacao do NodeMCU com o aplicativo
  get_sync_response = receiveSynchronizationResponse("nodemcu/" + nodemcu_id);
  Serial.println(get_sync_response);

  //Extracao do campo que contem o AK (Confirmacao de Sincronizacao)
  JsonObject& root = jsonBuffer.parseObject(get_sync_response);
  bool synchronized = root["connected"];
  String environment = root["environment"];

  //Verificacao do AK (se o NodeMCU esta sincronizado ou nao)
  if (synchronized) {
    Serial.println(nodemcu_name + " sincronizado! Enviando dados dos sensores...");
    String light = String(getLightValue(send_data_delay));
    put_sensor_response = sendSensorData("sensors/" + environment, light, light, light, light);
    Serial.println(put_sensor_response);
  }
  else {
    Serial.println(nodemcu_name + " desconectado!");
  }

  Serial.println("");
  delay(send_data_delay);

}

//Pedido de sincronização

String sendSynchronizationRequest(String path)
{
  http.begin(BASE_URL + path);
  http.addHeader("content-type", "application/x-www-form-urlencoded");

  String body = "id=" + String(nodemcu_id) + "&name=" + String(nodemcu_name);

  int httpCode = http.POST(body);

  if (verifyRequest(httpCode)) {
    return "";
  }

  String response =  http.getString();
  http.end();

  //Sem resposta
  if (!response) {
    return "";
  }

  recorded = true;

  return response;
}

//Confirmação (AK) de sincronização
String receiveSynchronizationResponse(String path)
{
  http.begin(BASE_URL + path);

  int httpCode = http.GET();

  if (verifyRequest(httpCode)) {
    return "";
  }

  String response =  http.getString();
  http.end();

  //Sem resposta
  if (!response) {
    return "";
  }

  return response;
}

String sendSensorData(String path, String temperature, String airHumidity, String light, String soilMoisture)
{
  http.begin(BASE_URL + path);
  http.addHeader("content-type", "application/x-www-form-urlencoded");

  String body = "temperature=" + String(temperature) + "&airHumidity=" + String(airHumidity) + "&light=" + String(light) + "&soilMoisture=" + String(soilMoisture);

  int httpCode = http.PUT(body);

  if (verifyRequest(httpCode)) {
    return "";
  }

  String response =  http.getString();
  http.end();

  //Sem resposta
  if (!response) {
    return "";
  }

  return response;
}



// ###################################### //

//Implementacao dos prototipos

void initSerial() {
  Serial.begin(9600);
  mySerial.begin(9600);
}

void initWiFi() {
  delay(10);
  Serial.println("Conectando-se em: " + String(SSID));

  WiFi.begin(SSID, PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(100);
    Serial.print(".");
  }
  Serial.println();
  Serial.print("Conectado na Rede " + String(SSID) + " | IP => ");
  Serial.println(WiFi.localIP());
}
