#include "functions.h"
#include "global_variables.h"

#include <ArduinoJson.h>
#include <NewPing.h>

SocketIOclient socketIO;
NewPing lowSonar(LOW_TRIGGER, LOW_ECHO, MAX_DISTANCE);

bool eventSent = false;

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

  USE_SERIAL.println(lowSonar.ping_cm());
  // handleBottle(lowSonar.ping_cm(), 8, 1, 15);
  handleBottle(lowSonar.ping_cm(), 12, 1, 15);
  delay(100);
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
}

void handleBottle(int lowSensor, int limit, int level, int points)
{
  // Conta os pontos quando as duas chaves são pressionadas simultaneamente.
  // bool bottleDetected = digitalRead(motionSensor) == 1 && !eventSent;
  bool bottleDetected = lowSensor < limit && lowSensor > 0 && !eventSent;
  // bool bottleDetected = digitalRead(motionSensor) == 1 && !eventSent;

  if (bottleDetected)
  {
    DynamicJsonDocument docOut(1024);
    JsonArray array = docOut.to<JsonArray>();

    array.add("register_bottle");

    JsonObject param1 = array.createNestedObject();
    param1["level"] = level;
    param1["points"] = points;
    param1["mac_address"] = String(WiFi.macAddress());

    String output;
    serializeJson(docOut, output);

    // USE_SERIAL.println("Você ganhou %d pontos\n", points);
    // USE_SERIAL.println("Você ganhou %d pontos\n", points);
    USE_SERIAL.println(output);

    socketIO.sendEVENT(output);

    eventSent = true;
  }
  else if (lowSensor >= limit)
  {
    eventSent = false;
  }
}

// void middleLevelBottle()
// {
//   // Conta os pontos quando as duas chaves são pressionadas simultaneamente.
//   if (digitalRead(MID_START_KEY) == 1 && digitalRead(MID_END_KEY) == 1)
//   {
//     // return client.send(points);

//     Serial.print("Obrigado por reciclar");
//     Serial.println("Você ganhou 15 pontos");
//   }
//   // // Não conta os pontos se as duas chaves não acionarem ao mesmo tempo.
//   // } else if (digitalRead(chave3) == 0 && digitalRead(chave4) == 1 ){
//   //   Serial.print("Não acontece nada");

//   // } else if (digitalRead(chave3) == 1 && digitalRead(chave4) == 0 ){
//   //   Serial.print("Não acontece nada");

//   // } else if (digitalRead(chave3) == 1 && digitalRead(chave4) == 1 ){
//   //   Serial.print("Não acontece nada");
//   // }
// }

// void highLevelBottle(char *points)
// {
//   // Conta os pontos quando as duas chaves são pressionadas simultaneamente.
//   Serial.print("Obrigado por reciclar");
//   Serial.println("Você ganhou 20 pontos");
// }