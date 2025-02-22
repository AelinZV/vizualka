#include "commands.h"
#include <stddef.h>

// Кодирование команды
int sc_commandEncode(int sign, int command, int operand, int* value)
{
    // Проверки: sign (0..1), command (0..31), operand (0..127)
    if (sign < 0 || sign > 1 || command < 0 || command > 31 || operand < 0 ||
        operand >= 128)
    {
        return -1;
    }
    // Формат (пример): sign в бите 15, команда в битах [7..11], operand в
    // [0..6] Но вы в исходнике делали (sign << 15) | (command << 7) | operand
    *value = (sign << 15) | (command << 7) | (operand & 0x7F);
    return 0;
}

// Декодирование команды
int sc_commandDecode(int value, int* sign, int* command, int* operand)
{
    if (sign == NULL || command == NULL || operand == NULL)
    {
        return -1;
    }
    *sign    = (value >> 15) & 1;
    *command = (value >> 7) & 0x1F;  // 5 бит
    *operand = value & 0x7F;         // 7 бит
    return 0;
}

// Проверка команды на корректность
int sc_commandValidate(int command)
{
    return (command >= 0 && command <= 31) ? 0 : -1;
}
