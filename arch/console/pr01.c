#include "mySimpleComputer.h"
#include <stddef.h>
#include <stdio.h>
int main(void)
{
    // Инициализация
    sc_memoryInit();
    sc_accumulatorInit();
    sc_icounterInit();
    sc_regInit();

    // Установка значений памяти
    sc_memorySet(0, 100);
    sc_memorySet(1, 200);

    // Вывод содержимого памяти
    for (int i = 0; i < 128; i++)
    {
        printCell(i);
    }

    // Установка флагов
    sc_regSet(FLAG_Z, 1);
    sc_regSet(FLAG_S, 0);
    printFlags();

    // Установка и вывод аккумулятора
    sc_accumulatorSet(123);
    printAccumulator();

    // Установка и вывод счётчика команд
    sc_icounterSet(42);
    printCounters();

    // Кодирование и декодирование команды
    int command;
    sc_commandEncode(1, 30, 5, &command);
    printDecodedCommand(command);

    return 0;
}
