#include "registers.h"
#include <stddef.h>

// Глобальные регистры, недоступные за пределами registers.c
static int accumulator = 0;
static int icounter    = 0;
static int flags       = 0;

// Инициализация регистра флагов
int sc_regInit(void)
{
    flags = 0;
    return 0;
}

// Установка значения регистра флагов
int sc_regSet(int reg, int value)
{
    // В вашем коде проверяется, что рег либо FLAG_Z, либо FLAG_S
    if (reg != FLAG_Z && reg != FLAG_S)
    {
        return -1;
    }
    if (value == 0)
    {
        flags &= ~reg;
    }
    else
    {
        flags |= reg;
    }
    return 0;
}

// Получение значения регистра флагов
int sc_regGet(int reg, int* value)
{
    if ((reg != FLAG_Z && reg != FLAG_S) || value == NULL)
    {
        return -1;
    }
    *value = (flags & reg) ? 1 : 0;
    return 0;
}

// Инициализация аккумулятора
int sc_accumulatorInit(void)
{
    accumulator = 0;
    return 0;
}

// Установка значения аккумулятора
int sc_accumulatorSet(int value)
{
    if (value < -32768 || value > 32767)
    {
        return -1;
    }
    accumulator = value;
    return 0;
}

// Получение значения аккумулятора
int sc_accumulatorGet(int* value)
{
    if (value == NULL)
    {
        return -1;
    }
    *value = accumulator;
    return 0;
}

// Инициализация счётчика команд
int sc_icounterInit(void)
{
    icounter = 0;
    return 0;
}

// Установка значения счётчика команд
int sc_icounterSet(int value)
{
    icounter = value;  // В исходном коде не было ограничений
    return 0;
}

// Получение значения счётчика команд
int sc_icounterGet(int* value)
{
    if (value == NULL)
    {
        return -1;
    }
    *value = icounter;
    return 0;
}
