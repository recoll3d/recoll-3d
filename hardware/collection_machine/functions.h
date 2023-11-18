#ifndef FUNCTIONS_H
#define FUNCTIONS_H

#include <SocketIOclient.h>

extern SocketIOclient socketIO;

void socketIOEvent(socketIOmessageType_t type, uint8_t *payload, size_t length);
void sendEventName();
void sendMacAddress();
void handleRecycling();

// void handleBottle(int motionSensor, int limit, int level, int points);
void handleBottle(int lowSensor, int limit, int level, int points);
// void middleLevelBottle(char* points);
// void highLevelBottle(char* points);

#endif