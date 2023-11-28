#include "functions.h"
#include "global_variables.h"

#include <ArduinoJson.h>
#include <NewPing.h>
#include <math.h>

SocketIOclient socketIO;

NewPing lowSonar(LOW_TRIGGER, LOW_ECHO, MAX_DISTANCE);
NewPing midSonar(MID_TRIGGER, MID_ECHO, MAX_DISTANCE);
NewPing highSonar(HIGH_TRIGGER, HIGH_ECHO, MAX_DISTANCE);

long int lastLowSonarReading = 0;
long int lastMidSonarReading = 0;
long int lastHighSonarReading = 0;

bool lowEventSent = false;
bool middleEventSent = false;
bool highEventSent = false;

const int MARGIN_OF_TOLERANCE = 0;

void socketIOEvent(socketIOmessageType_t type, uint8_t *payload, size_t length)
{
  switch (type)
  {
  case sIOtype_DISCONNECT:
    USE_SERIAL.printf("[IOc] Disconnected!\n");
    break;
  case sIOtype_CONNECT:
  {
    USE_SERIAL.printf("[IOc] Connected to url: %s\n", payload);

    // join default namespace (no auto join in Socket.IO V3)
    socketIO.send(sIOtype_CONNECT, "/");
    break;
  }
  case sIOtype_EVENT:
  {
    char *sptr = NULL;
    int id = strtol((char *)payload, &sptr, 10);

    USE_SERIAL.printf("[IOc] get event: %s id: %d\n", payload, id);

    if (id)
    {
      payload = (uint8_t *)sptr;
    }

    DynamicJsonDocument doc(1024);
    DeserializationError error = deserializeJson(doc, payload, length);

    if (error)
    {
      USE_SERIAL.print(F("deserializeJson() failed: "));
      USE_SERIAL.println(error.c_str());
      return;
    }

    String eventName = doc[0];
    USE_SERIAL.printf("[IOc] event name: %s\n", eventName.c_str());

    // Message Includes a ID for a ACK (callback)
    if (id)
    {
      // creat JSON message for Socket.IO (ack)
      DynamicJsonDocument docOut(1024);
      JsonArray array = docOut.to<JsonArray>();

      // add payload (parameters) for the ack (callback function)
      JsonObject param1 = array.createNestedObject();
      param1["now"] = millis();

      // JSON to String (serializion)
      String output;
      output += id;
      serializeJson(docOut, output);

      // Send event
      socketIO.send(sIOtype_ACK, output);
    }

    if (String(eventName) == "turn_on_led")
    {
      // Processar o valores recebido

      // Acessar o segundo elemento do array JSON
      JsonObject obj = doc[1];

      // Acessar a chave "on" no objeto JSON
      bool active = obj["on"];

      USE_SERIAL.printf("Ativo: %s\n", active ? "Verdadeiro" : "Falso");
      digitalWrite(BLUE_LED, active);
    }
  }
  break;
  case sIOtype_ACK:
    USE_SERIAL.printf("[IOc] get ack: %u\n", length);
    break;
  case sIOtype_ERROR:
    USE_SERIAL.printf("[IOc] get error: %u\n", length);
    break;
  case sIOtype_BINARY_EVENT:
    USE_SERIAL.printf("[IOc] get binary: %u\n", length);
    break;
  case sIOtype_BINARY_ACK:
    USE_SERIAL.printf("[IOc] get binary ack: %u\n", length);
    break;
  }
}

unsigned long messageTimestamp = 0;

void sendEventName()
{
  uint64_t now = millis();

  if (now - messageTimestamp > 2000)
  {
    messageTimestamp = now;

    // creat JSON message for Socket.IO (event)
    DynamicJsonDocument doc(1024);
    JsonArray array = doc.to<JsonArray>();

    // add event name
    // Hint: socket.on('event_name', ....
    array.add("event_name");

    // add payload (parameters) for the event
    JsonObject param1 = array.createNestedObject();
    param1["now"] = (uint32_t)now;

    // JSON to String (serializion)
    String output;
    serializeJson(doc, output);

    // Send event
    socketIO.sendEVENT(output);

    // Print JSON for debugging
    // USE_SERIAL.println(output);
  }
}

void sendMacAddress()
{
  // creat JSON message for Socket.IO (ack)
  DynamicJsonDocument docOut(1024);
  JsonArray array = docOut.to<JsonArray>();

  array.add("register_point_collection");

  // add payload (parameters) for the ack (callback function)
  JsonObject param1 = array.createNestedObject();
  param1["mac_address"] = String(WiFi.macAddress());

  // JSON to String (serializion)
  String output;
  serializeJson(docOut, output);

  // USE_SERIAL.println(output);

  // Envia o MAC para o servidor via Socket.IO
  socketIO.sendEVENT(output);

  delay(1000);
}

// void sendGetLed()
// {
//   // creat JSON message for Socket.IO (ack)
//   DynamicJsonDocument docOut(1024);
//   JsonArray array = docOut.to<JsonArray>();

//   array.add("get_led");

//   // add payload (parameters) for the ack (callback function)
//   JsonObject param1 = array.createNestedObject();
//   param1["text"] = 'Tanto faz';

//   // JSON to String (serializion)
//   String output;
//   serializeJson(docOut, output);

//   // USE_SERIAL.println(output);

//   // Envia o MAC para o servidor via Socket.IO
//   socketIO.sendEVENT(output);

//   delay(1000);
// }

void handleRecycling()
{
  DynamicJsonDocument docOut(1024);
  JsonArray array = docOut.to<JsonArray>();

  array.add("register_recycling");

  JsonObject param1 = array.createNestedObject();
  param1["mac_address"] = String(WiFi.macAddress());
  param1["number_of_bottles"] = 0;
  param1["total_bottles_score"] = 0;

  String output;
  serializeJson(docOut, output);

  // USE_SERIAL.println(output);

  socketIO.sendEVENT(output);

  // int lowMotionSensor = digitalRead(LOW_MOTION_SENSOR);
  // int midMotionSensor = digitalRead(MID_MOTION_SENSOR);
  // int highMotionSensor = digitalRead(HIGH_MOTION_SENSOR);

  // =========== ÚLTIMOS QUE FORAM UTILIZADOS ===========:
  // USE_SERIAL.println('SENSOR MÉDIO:');
  // USE_SERIAL.println(midSonar.ping_cm());

  if (lowSonar.ping_cm() < 8 && fabs(lowSonar.ping_cm() - lastLowSonarReading) > MARGIN_OF_TOLERANCE && !lowEventSent)
  {
    lowLevelBottle();
  }
  else if (lowSonar.ping_cm() >= 8)
  {
    lowEventSent = false;
  }

  if (midSonar.ping_cm() < 12 && fabs(midSonar.ping_cm() - lastMidSonarReading) > MARGIN_OF_TOLERANCE && !middleEventSent)
  {
    middleLevelBottle();
  }
  else if (midSonar.ping_cm() >= 12)
  {
    middleEventSent = false;
  }

  if (highSonar.ping_cm() < 12 && fabs(highSonar.ping_cm() - lastHighSonarReading) > MARGIN_OF_TOLERANCE && !highEventSent)
  {
    highLevelBottle();
  }
  else if (highSonar.ping_cm() >= 12)
  {
    highEventSent = false;
  }
  // ====================================================;

  // handleBottle2(LOW_MOTION_SENSOR, 1, 15);

  delay(50);
}
// if (lowMotionSensor && !midMotionSensor && !highMotionSensor)
// {
// }
// if (midMotionSensor && !lowMotionSensor && !highMotionSensor)
// {
//   return handleBottle(MID_MOTION_SENSOR, 2, 20);
// }
// if (highMotionSensor && !lowMotionSensor && !midMotionSensor)
// {
//   return handleBottle(HIGH_MOTION_SENSOR, 3, 25);
// }

// bool bottleDetected = digitalRead(LOW_START_KEY) == 1 && digitalRead(LOW_END_KEY) == 1 && !eventoEnviado;

// if (bottleDetected) {
//   DynamicJsonDocument docOut(1024);
//   JsonArray array = docOut.to<JsonArray>();

//   array.add("register_bottle");

//   JsonObject param1 = array.createNestedObject();
//   param1["level"] = 1;
//   param1["points"] = 15;

//   String output;
//   serializeJson(docOut, output);

//   USE_SERIAL.println("Você ganhou 15 pontos");
//   USE_SERIAL.println(output);

//   socketIO.sendEVENT(output);

//   eventoEnviado = true;
// } else if (digitalRead(LOW_START_KEY) == 0 || digitalRead(LOW_END_KEY) == 0) {
//   eventoEnviado = false;
// }

// =================================================================================

// bool valorPIR = digitalRead(pinPIR);

// if (valorPIR && !eventoEnviado) {
//   Serial.println("DETECTADO");
//   eventoEnviado = true;
// } else if (!valorPIR) {
//   Serial.println("---------");
//   eventoEnviado = false;
// }
// }

// void handleBottle2(int motionSensor, int level, int points)
// {
//   bool bottleDetected = digitalRead(motionSensor) == 1 && !eventSent;

//   if (bottleDetected)
//   {
//     DynamicJsonDocument docOut(1024);
//     JsonArray array = docOut.to<JsonArray>();

//     array.add("register_bottle");

//     JsonObject param1 = array.createNestedObject();
//     param1["level"] = level;
//     param1["points"] = points;
//     param1["mac_address"] = String(WiFi.macAddress());

//     String output;
//     serializeJson(docOut, output);

//     // USE_SERIAL.println("Você ganhou %d pontos\n", points);
//     // USE_SERIAL.println("Você ganhou %d pontos\n", points);
//     USE_SERIAL.println(output);

//     socketIO.sendEVENT(output);

//     eventSent = true;
//   }
//   else if (digitalRead(motionSensor) == 0)
//   {
//     eventSent = false;
//   }
// }

// ========================= ÚLTIMOS QUE FORAM UTILIZADOS =========================:
// void handleBottle(int sensor, int minLimit, int maxLimit, int level, int points)
// {
//   // Conta os pontos quando as duas chaves são pressionadas simultaneamente.
//   // bool bottleDetected = digitalRead(motionSensor) == 1 && !eventSent;
//   // bool bottleDetected = sensor < limit && sensor >= 3 && !eventSent;
//   bool bottleDetected = sensor >= 1 && !eventSent;
//   // bool bottleDetected = digitalRead(motionSensor) == 1 && !eventSent;

//   if (bottleDetected)
//   {
//     DynamicJsonDocument docOut(1024);
//     JsonArray array = docOut.to<JsonArray>();

//     array.add("register_bottle");

//     JsonObject param1 = array.createNestedObject();
//     param1["level"] = level;
//     param1["points"] = points;
//     param1["mac_address"] = String(WiFi.macAddress());

//     String output;
//     serializeJson(docOut, output);

//     // USE_SERIAL.println("Você ganhou %d pontos\n", points);
//     // USE_SERIAL.println("Você ganhou %d pontos\n", points);
//     USE_SERIAL.println(output);

//     socketIO.sendEVENT(output);

//     eventSent = true;
//   }
//   else if (sensor > maxLimit)
//   {
//     eventSent = false;
//   }
// }
// ==============================================================================

void lowLevelBottle()
{
  USE_SERIAL.println(lowSonar.ping_cm());
  // handleBottle(lowSonar.ping_cm(), 0, 8, 1, 15);
  DynamicJsonDocument docOut(1024);
  JsonArray bottleArray = docOut.to<JsonArray>();

  bottleArray.add("register_bottle");

  JsonObject param1 = bottleArray.createNestedObject();
  param1["level"] = 1;
  param1["points"] = 15;
  param1["mac_address"] = String(WiFi.macAddress());

  String output;
  serializeJson(docOut, output);

  // USE_SERIAL.println("Você ganhou %d pontos\n", points);
  // USE_SERIAL.println("Você ganhou %d pontos\n", points);
  USE_SERIAL.println(output);

  socketIO.sendEVENT(output);

  lastLowSonarReading = lowSonar.ping_cm();
  lowEventSent = true;
}

void middleLevelBottle()
{
  USE_SERIAL.println(midSonar.ping_cm());
  // handleBottle(midSonar.ping_cm(), 0, 10, 2, 20);

  DynamicJsonDocument docOut(1024);
  JsonArray bottleArray = docOut.to<JsonArray>();

  bottleArray.add("register_bottle");

  JsonObject param1 = bottleArray.createNestedObject();
  param1["level"] = 2;
  param1["points"] = 20;
  param1["mac_address"] = String(WiFi.macAddress());

  String output;
  serializeJson(docOut, output);

  // USE_SERIAL.println("Você ganhou %d pontos\n", points);
  // USE_SERIAL.println("Você ganhou %d pontos\n", points);
  USE_SERIAL.println(output);

  socketIO.sendEVENT(output);

  lastMidSonarReading = midSonar.ping_cm();
  middleEventSent = true;
}

void highLevelBottle()
{
  USE_SERIAL.println(highSonar.ping_cm());
  // handleBottle(highSonar.ping_cm(), 0, 12, 3, 25);

  DynamicJsonDocument docOut(1024);
  JsonArray bottleArray = docOut.to<JsonArray>();

  bottleArray.add("register_bottle");

  JsonObject param1 = bottleArray.createNestedObject();
  param1["level"] = 3;
  param1["points"] = 25;
  param1["mac_address"] = String(WiFi.macAddress());

  String output;
  serializeJson(docOut, output);

  // USE_SERIAL.println("Você ganhou %d pontos\n", points);
  // USE_SERIAL.println("Você ganhou %d pontos\n", points);
  USE_SERIAL.println(output);

  socketIO.sendEVENT(output);

  lastHighSonarReading = highSonar.ping_cm();
  highEventSent = true;
}