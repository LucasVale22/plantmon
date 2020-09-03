#include <SoftwareSerial.h>

/* ############################################ BIBLIOTECAS ##################################################### */
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>
#include "DHT.h"
//#include <SoftwareSerial.h>
/* ############################################################################################################## */

/* ###################################### DEFINICOES DE CONSTANTES ############################################## */
#define NUMBER_OF_CHANNELS 8                                                //Numero de canais de sensores
#define DATA_SIZE 4                                                         //4 bytes de informação cada, em ASCII 
#define DELIMITERS (7 + 1)                                                  //7 separadores e 1 terminador de string
#define SERIAL_STRING_SIZE ((DATA_SIZE * NUMBER_OF_CHANNELS) + DELIMITERS)  //Tamanho da string serial
#define BAUD_RATE 19200                                                     //Taxa de transmissao de bits (comunicacao serial)
#define DHTPIN 5

#define DHTTYPE DHT11                                           //Tamanho maximo dos campos(arrays) "data" e "time" do objeto JSON do sensor
#define SENSOR_OBJECT_SIZE 5                                                //Numero de campos do objeto JSON do sensor
#define ADDITIONAL_BYTES_SENSOR 159                 //Bytes adicionais de string no objeto JSON do sensor  
#define NODEMCU_OBJECT_SIZE 5                                               //Numero de campos do objeto JSON do nodemcu
#define ADDITIONAL_BYTES_NODEMCU 121                                        //Bytes adicionais de string no objeto JSON do nodemcu

#define JSON_SENSORS_OBJECT_SIZE 8
#define JSON_ADDITIONAL_BYTES 200

/* ############################################################################################################## */

/* ###################################### DEFINICOES DE REDE #################################################### */
const char* SSID = "nome_da_rede";                 // rede wi-fi
const char* PASSWORD = "************";           // senha da rede wi-fi
String BASE_URL = "http://XXX.XXX.XXX.XXX:XXXX/"; // endereco do servidor 
/* ############################################################################################################## */

/* ######################################## DEFINICOES DO DISPOSITIVO ########################################### */
const String device = "n0d3mcu13";
const String nodemcu_name = "NodeMCU_13";
bool nodemcu_recorded = false;
String sensor_port[] = {"DHT11_T_D1", "DHT11_U_D1", "LDR_L_A0", "HIG_U_A1", "LDR_L_A2", "HIG_U_A3", "LDR_L_A4", "HIG_U_A5", "LDR_L_A6", "HIG_U_A7"};
bool sensor_recorded[] = {false, false, false, false, false, false, false, false, false, false};
const size_t json_sensor_capacity = JSON_OBJECT_SIZE(SENSOR_OBJECT_SIZE) + ADDITIONAL_BYTES_SENSOR ;
const size_t json_nodemcu_capacity = JSON_OBJECT_SIZE(NODEMCU_OBJECT_SIZE) + ADDITIONAL_BYTES_NODEMCU;
const size_t json_capacity = JSON_OBJECT_SIZE(JSON_SENSORS_OBJECT_SIZE) + JSON_ADDITIONAL_BYTES ;
/* ############################################################################################################## */

/* ########################################### DELAYS ########################################################### */
const int inicialization_wifi_delay = 10;
const int connection_attempt_delay = 100;
const int request_delay = 2000;
const int send_data_delay = 10000;
/* ############################################################################################################## */

/* ######################################### VARIAVEIS GLOBAIS ################################################## */

/* ############################################################################################################## */

/* ######################################## PROTOTIPOS DE FUNCOES################################################ */
void initSerial();                                    //Inicializacao serial
void initWiFi();                                      //Inicializacao da rede

float getTemperature();                               //Obtenção da temperatura
float getAirHumidity();                               //Obtenção da umidade do ar
float getLight();                                     //Obtenção da luminosidade
float getSoilMoisture();                              //Obtenção da umidade do solo

bool verifyRequest(int httpCode);                     //Verificacao de requisicao

void nodemcuPOST();                                 //Envio dos dados do NodeMCU
String nodemcuGET();                                  //Recepção dos dados do NodeMCU

void sensorPOST(String port, 
                  String sensor_name, 
                  String target, 
                  String index);                      //Envio dos dados dos sensores                 
String sensorGET(String port);                        //Recepção dos dados dos sensores          
void sensorPUT(String port,
                 float data);                         //Envio de dados dos sensores
/* ############################################################################################################## */

/* ############################################# OBJETOS ######################################################## */
WiFiClient client;  //Cliente Wi-Fi
HTTPClient http;    //Cliente HTTP
DHT dht(DHTPIN, DHTTYPE);
SoftwareSerial mySerial(D5, D6, false, 256);
/* ############################################################################################################## */

/* #################################### IMPLEMENTACAO DOS PROTOTIPOS ############################################ */

//Funcao: inicializacao da transmissao serial
//Parametros: nenhum
//Retorno: nenhum
void initSerial() {
  Serial.begin(BAUD_RATE);
  mySerial.begin(BAUD_RATE);
}

//Funcao: inicializacao da rede Wi-Fi
//Parametros: nenhum
//Retorno: nenhum
void initWiFi() {
  delay(inicialization_wifi_delay);
  Serial.println("Conectando-se em: " + String(SSID));

  //Inicializacao
  WiFi.begin(SSID, PASSWORD);
  //Tentativa de conexao
  while (WiFi.status() != WL_CONNECTED) {
    delay(connection_attempt_delay);
    Serial.print(".");
  }
  Serial.println();
  Serial.print("Conectado na Rede " + String(SSID) + " | IP => ");
  Serial.println(WiFi.localIP());
}

//Funcao: verificacao das requisicoes http
//Parametros: codigo de erro http
//Retorno: resposta`da requisicao
bool verifyRequest(int httpCode) {
  //Erro na requisição
   
  if (httpCode < 0) {
    Serial.println("Erro de requisicao - " + String(httpCode));
    return true;
  }
  else {
    //Erro na resposta
    if (httpCode != HTTP_CODE_OK) {
      Serial.println("Erro HTTP: " + String(httpCode));
      return true;
    }
    else {
      return false;
    }
  }
}

//Funcao: leitura de temperatura
//Parametros: nenhum
//Retorno: valor de temperatura
float getTemperature() {

  float last_values_mean = 0;
  int read_delay = send_data_delay / 10;
  int samples_number = send_data_delay / read_delay;
  
  //Leitura e conversao
  for(int counter = 1; counter <=  samples_number; counter++) {
  
    float temperature = dht.readTemperature();

    if(isnan(temperature)) {
      temperature = last_values_mean;
    }

    last_values_mean += temperature / samples_number;

    delay(read_delay);
    
  }

  //Media das ultimas amostras
  return last_values_mean;

}

//Funcao: leitura de umidade do ar
//Parametros: nenhum
//Retorno: valor de umidade do ar
float getAirHumidity() {

  float last_values_mean = 0;
  int read_delay = send_data_delay / 10;
  int samples_number = send_data_delay / read_delay;
  
  //Leitura e conversao
  for(int counter = 1; counter <=  samples_number; counter++) {

    float air_humidity = dht.readHumidity();

    if(isnan(air_humidity)) {
      air_humidity = last_values_mean;
    }

    last_values_mean += air_humidity / samples_number;

    delay(read_delay);
    
  }

  //Media das ultimas amostras
  return last_values_mean;

}

//Funcao: leitura de luminosidade
//Parametros: delay para envio de dados
//Retorno: valor de luminosidade
float getLight(String port) {

  float last_values_mean = 0;
  int read_delay = send_data_delay / 10;
  int samples_number = send_data_delay / read_delay;
  float light;
  
  //Leitura e conversao
  for(int counter = 1; counter <=  samples_number; counter++) {

     DynamicJsonDocument sensors_data(json_capacity);

     if(Serial.available()) 
     {
       auto error = deserializeJson(sensors_data, Serial);
       if (error) 
       {
        Serial.print(F("deserializeJson() failed with code "));
        Serial.println(error.c_str());
        //light = 66;
       }
       light = float(sensors_data[port]);
     }
     else
     {
      light = 50;
     }

    Serial.println("LUMINOSIDADE LIDA NA PORTA " + port + ":" + String(light));

    last_values_mean += light / samples_number;

    delay(read_delay);
    
  }

  //Media das ultimas amostras
  return last_values_mean;

}

//Funcao: envio dos dados do NodeMCU
//Parametros: nenhum
//Retorno: nenhum
void nodemcuPOST()
{
  DynamicJsonDocument pretty_json(json_nodemcu_capacity);
  
  http.begin(BASE_URL + "nodemcu");
  http.addHeader("content-type", "application/x-www-form-urlencoded");

  String body = "device=" + String(device) + "&name=" + String(nodemcu_name);

  int httpCode = http.POST(body);

  if (verifyRequest(httpCode)) {
    Serial.println("Erro na requisicao do nodemcu " + nodemcu_name);
  }

  String response =  http.getString();
  http.end();

  //Sem resposta
  if (!response) {
    Serial.println("Nao houve resposta do nodemcu" + nodemcu_name);
  }

  nodemcu_recorded = true;
  Serial.println(nodemcu_name + "(" + device + ") identificado com sucesso!");
  deserializeJson(pretty_json, response);
  serializeJsonPretty(pretty_json, Serial); 
}

//Funcao: recepcao dos dados do NodeMCU
//Parametros: nenhum
//Retorno: resposta à requisicao
String nodemcuGET()
{
  http.begin(BASE_URL + "nodemcu/" + device);

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

//Funcao: envio dos dados do sensor
//Parametros: port -> porta de conexao, sensor_name -> nome do sensor, target -> alvo de medição, index -> índice da porta
//Retorno: nenhum
void sensorPOST(String port, String sensor_name, String target, int index)
{
  http.begin(BASE_URL + "nodemcu/" + device + "/sensor");
  http.addHeader("content-type", "application/x-www-form-urlencoded");

  String body = "port=" + port + "&name=" + sensor_name + "&target=" + target;

  int httpCode = http.POST(body);

  if (verifyRequest(httpCode)) {
    Serial.println("Erro na requisicao do sensor de" + sensor_name);
  }

  String response =  http.getString();
  http.end();

  //Sem resposta
  if (!response) {
    Serial.println("Nao houve resposta do sensor de" + sensor_name);
  }

  sensor_recorded[index] = true;
  Serial.println("Sensor na porta " + port + " identificado com sucesso!");
  Serial.println(response);
}

//Funcao: recepcao dos dados do sensor
//Parametros: nenhum
//Retorno: resposta à requisicao
String sensorGET(String port)
{
  http.begin(BASE_URL + "nodemcu/" + device + "/sensor/" + port);

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

//Funcao: envio das leituras do sensor
//Parametros: port -> porta de conexao, data ->leitura do sensor
//Retorno: resposta à requisicao
void sensorPUT(String port, float data)
{
  http.begin(BASE_URL + "nodemcu/" + device + "/transmission/" + port);
  http.addHeader("content-type", "application/x-www-form-urlencoded");

  String body = "data=" + String(data) ;

  int httpCode = http.PUT(body);

  if (verifyRequest(httpCode)) {
    Serial.println("Erro ao enviar o dado da porta " + port);
  }

  String response =  http.getString();
  http.end();

  //Sem resposta
  if (!response) {
    Serial.println("Nao houve resposta ao enviar o dado da porta" + port);
  }
  
}

//Inicializacao das portas seriais e da conexao com o wifi: toda vez que o nodemcu for ligado na energia

void setup() {
  initSerial();
  initWiFi();
}

//Comunicacao e sincronizacao do NodeMCU com o Aplicativo

void loop() {
  
  DynamicJsonDocument nodemcu_json(json_nodemcu_capacity);
  DynamicJsonDocument sensor_json(json_sensor_capacity);

  float data;

  /*################################ Registrando NodeMCU no BD ###################################*/

  //Tentativas de registro do NodeMCU
  if (!nodemcu_recorded) {
    nodemcuPOST();
    Serial.println("Tentando identificar dispositivo " + nodemcu_name + "(" + device + ") na rede..." );
    Serial.println("");
    delay(request_delay);
  }
  /*#############################################################################################*/

  /*######################## Recebendo o NodeMCU do BD ###########################################################################*/
  
  //Recepção e extração do AK (confirmação de sincronização através do campo "connected") dp NodeMCU
  
  deserializeJson(nodemcu_json, nodemcuGET());
  bool nodemcu_synchronized = nodemcu_json["connected"];
  String response_name = nodemcu_json["name"];

  /*#############################################################################################################################*/
  
  if (nodemcu_synchronized) {

    
    
    Serial.println(response_name + " sincronizado! Identificando sensores...");

    for(int counter = 0; counter < 10; counter++) {

        /*################################ Registrando os Sensores no BD ########################################################*/

        //Tentativas de registro para cada sensor
        if(!sensor_recorded[counter]) {
          if(counter == 0) {
            sensorPOST(sensor_port[counter], "Temperatura", "Ambiente", counter);
          } 
          else if(counter == 1) {
            sensorPOST(sensor_port[counter], "Umidade do Ar", "Ambiente", counter);
          }
          else {
            if(counter % 2 == 0) {
              sensorPOST(sensor_port[counter], "Luminosidade", "Planta", counter);
            }
            else {
              sensorPOST(sensor_port[counter], "Umidade do Solo", "Planta", counter);
            }
          }
        }

      /*########################################################################################################################*/

      /*################################ Recebendo os Sensores do BD ###########################################################*/

      //Recepção e extração do AK (confirmação de sincronização através do campo "connected") dp NodeMCU
      
      deserializeJson(sensor_json, sensorGET(sensor_port[counter]));
      bool sensor_synchronized = sensor_json["connected"];
      String port = sensor_json["port"];

      //Envio dos dados lidos pelos sensores
      if(sensor_synchronized) {
          if(counter == 0) {
            sensorPUT(sensor_port[counter], getTemperature());
          } 
          else if(counter == 1) {
            sensorPUT(sensor_port[counter], getAirHumidity());
          }
          else {
            if(counter % 2 == 0) {
              sensorPUT(sensor_port[counter], getLight(sensor_port[counter]));
            }
            else {
              //data = getSoilMoisture();
              data = 40.1;
              sensorPUT(sensor_port[counter], data);
            }
          }  

      /*########################################################################################################################*/
      /*Serial.println("");
      delay(request_delay);*/
      }
      else {
          Serial.println("Sensor " + port + " desconectado!");
      } 

     delay(request_delay);
    }


  }
  else {
     Serial.println(nodemcu_name + " desconectado!");
  }

  /*######################################################################################################################################*/
  Serial.println("");
  delay(send_data_delay);
}



