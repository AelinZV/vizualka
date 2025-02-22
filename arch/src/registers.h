#ifndef REGISTERS_H
#define REGISTERS_H

// Определения для регистров флагов
#define FLAG_Z (1 << 0)  // флаг нулевого результата
#define FLAG_S (1 << 1)  // флаг знака

// Функции для работы с регистрами флагов
int sc_regInit(void);
int sc_regSet(int reg, int value);
int sc_regGet(int reg, int* value);

// Функции для работы с аккумулятором
int sc_accumulatorInit(void);
int sc_accumulatorSet(int value);
int sc_accumulatorGet(int* value);

// Функции для работы со счётчиком команд
int sc_icounterInit(void);
int sc_icounterSet(int value);
int sc_icounterGet(int* value);

#endif  // REGISTERS_H