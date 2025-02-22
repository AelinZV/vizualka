#include "io.h"
#include "commands.h"
#include "memory.h"
#include "registers.h"
#include <stddef.h>
#include <stdio.h>

// Печать содержимого ячейки памяти
void printCell(int address)
{
    // Для вывода просто берём значение из памяти и печатаем
    int val = 0;
    if (sc_memoryGet(address, &val) == -1)
    {
        printf("Invalid address: %d\n", address);
        return;
    }
    printf("Cell[%d]: %d\n", address, val);
}

// Печать флагов
void printFlags(void)
{
    int fz, fs;
    sc_regGet(FLAG_Z, &fz);
    sc_regGet(FLAG_S, &fs);

    printf("Flags: ");
    if (fz)
        printf("Z ");
    if (fs)
        printf("S ");
    printf("\n");
}

// Печать команды в разных системах счисления
void printDecodedCommand(int value)
{
    printf("Decoded Command:\n");
    printf("  Decimal: %d\n", value);
    printf("  Octal: %o\n", value);
    printf("  Hex: %X\n", value);
    printf("  Binary: ");
    for (int i = 15; i >= 0; i--)
    {
        printf("%d", (value >> i) & 1);
    }
    printf("\n");
}

// Печать аккумулятора
void printAccumulator(void)
{
    int val;
    if (sc_accumulatorGet(&val) == 0)
    {
        printf("Accumulator: %d\n", val);
    }
    else
    {
        printf("Error: accumulator get\n");
    }
}

// Печать счётчика команд
void printCounters(void)
{
    int val;
    if (sc_icounterGet(&val) == 0)
    {
        printf("ICounter: %d\n", val);
    }
    else
    {
        printf("Error: icounter get\n");
    }
}
