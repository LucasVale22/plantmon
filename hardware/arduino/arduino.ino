/*Expansão das portas para sensores de plantas com Arduino Nano v3.0*/

/*Definições*/
#define NUMBER_OF_CHANNELS 8                                              //Numero de canais de sensores
#define DATA_SIZE 4                                                       //4 bytes de informação cada, em ASCII 
#define DELIMITERS (7 + 1)                                               //7 separadores e 1 terminador de string
#define SERIAL_STRING_SIZE ((DATA_SIZE * NUMBER_OF_CHANNELS) + DELIMITERS)  //Tamanho da string serial
#define BAUD_RATE 19200

/*Constantes*/


/*Variáveis globais*/
int adcReadings[NUMBER_OF_CHANNELS]; //Armazenará as leituras dos canais de ADC

/*Protótipos*/
void readAdcChannels();
void transmitAdcReadings();

/*Implementações*/

//Lê os canais de ADC
void readAdcChannels()
{
  char counter;

  for(counter = 0; counter < NUMBER_OF_CHANNELS; counter++)
    adcReadings[counter] = analogRead(counter);
}

//Transmite via serial, na forma textual/string, as leituras ADC obtidas
void transmitAdcReadings()
{
  char adcChannelsInfo[SERIAL_STRING_SIZE];

  //Limpa string
  memset(adcChannelsInfo, 0, SERIAL_STRING_SIZE);

  //Coloca as leituras numa string
  sprintf(adcChannelsInfo, "%04d;%04d;%04d;%04d;%04d;%04d;%04d;%04d", adcReadings[0],
                                                                      adcReadings[1],
                                                                      adcReadings[2],
                                                                      adcReadings[3],
                                                                      adcReadings[4],
                                                                      adcReadings[5],
                                                                      adcReadings[6],
                                                                      adcReadings[7]);

  //Transmite a string pela serial
  Serial.write(adcChannelsInfo, SERIAL_STRING_SIZE);  
  Serial.println("");
  delay(5000);
}
 
void setup() 
{
  memset(adcReadings, 0, sizeof(adcReadings));
  
  Serial.begin(BAUD_RATE);
}
 
void loop() 
{
  readAdcChannels();  
  transmitAdcReadings();
}

