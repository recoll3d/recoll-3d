#ifndef FUNCTIONS_H
#define FUNCTIONS_H

#include <SocketIOclient.h>

extern SocketIOclient socketIO;

void socketIOEvent(socketIOmessageType_t type, uint8_t *payload, size_t length);
void sendEventName();
void sendMacAddress();
// void sendGetLed();
void handleRecycling();

// void handleBottle(int motionSensor, int limit, int level, int points);
// void handleBottle(int sensor, int minLimit, int maxLimit, int level, int points);
// void handleBottle2(int motionSensor, int level, int points);
void lowLevelBottle();
void middleLevelBottle();
void highLevelBottle();

#endif