CC = gcc
CFLAGS = -Wall -Wextra -std=c11 -I../src

TARGET = pr01_program

SRCS = pr01.c
OBJS = $(SRCS:.c=.o)

LIBS = ../src/libmySimpleComputer.a

# Цель по умолчанию
all: $(TARGET) run

# Компиляция и линковка
$(TARGET): $(OBJS) $(LIBS)
	@echo "Компиляция и линковка..."
	$(CC) $(CFLAGS) $(OBJS) $(LIBS) -o $(TARGET)

# Компиляция объектных файлов
%.o: %.c
	@echo "Компиляция: $<"
	$(CC) $(CFLAGS) -c $< -o $@

# Очистка файлов
clean:
	@echo "Очистка файлов..."
	rm -f $(OBJS) $(TARGET)

# Полная пересборка
rebuild: clean all

# Тестовая сборка
test_build: $(TARGET)
	@echo "Тестовая сборка завершена."

# Запуск программы
run: $(TARGET)
	@echo "Запуск программы..."
	./$(TARGET)

.PHONY: all clean rebuild test_build run
