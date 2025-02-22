#ifndef IO_H
#define IO_H
#include <stddef.h>

void printCell(int address);
void printFlags(void);
void printDecodedCommand(int value);
void printAccumulator(void);
void printCounters(void);

#endif  // IO_H
