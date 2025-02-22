CC = gcc
CFLAGS = -Wall -Wextra -std=c11

LIBRARY = libmySimpleComputer.a

# Исходники библиотеки
SRC = memory.c registers.c commands.c io.c

# Соответствующие объектные файлы
OBJECTS = $(SRC:.c=.o)

all: $(LIBRARY)

$(LIBRARY): $(OBJECTS)
	ar rcs $(LIBRARY) $(OBJECTS)

%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

clean:
	rm -f $(OBJECTS) $(LIBRARY)

.PHONY: all clean
