#ifndef MEMORY_H
#define MEMORY_H
#include <stddef.h>

#define MEMORY_SIZE 128

// Функции для работы с памятью
int sc_memoryInit(void);
int sc_memorySet(int address, int value);
int sc_memoryGet(int address, int* value);
int sc_memorySave(const char* filename);
int sc_memoryLoad(const char* filename);

#endif  // MEMORY_H
