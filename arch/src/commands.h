#ifndef COMMANDS_H
#define COMMANDS_H

int sc_commandEncode(int sign, int command, int operand, int* value);
int sc_commandDecode(int value, int* sign, int* command, int* operand);
int sc_commandValidate(int command);

#endif  // COMMANDS_H
