# Impostor Futbolero: guia de la aplicacion

**Impostor Futbolero** (tambien presentado como Footy Games) es una aplicacion de juegos sociales basados en el futbol. Permite organizar rondas presenciales con un solo dispositivo o jugar a distancia mediante salas online. Incluye juegos de roles ocultos, deduccion y trivia, con opciones casuales y competitivas.

## Modalidades principales

Antes de empezar se eligen dos aspectos: el tipo de partida y la forma de conexion.

### Modo casual

Es la opcion para jugar rondas independientes, sin tabla de posiciones ni puntos acumulados. Es adecuada para partidas rapidas o grupos que solo quieren jugar por diversion.

### Modo competitivo

Permite crear una partida con nombre y jugadores fijos. La aplicacion conserva un marcador global y muestra la clasificacion durante las rondas. En los juegos que reparten un ganador, el anfitrion o quien controla la partida asigna los puntos correspondientes.

Las partidas competitivas pueden guardarse para continuarlas mas adelante: en `localStorage` cuando son offline y en Firebase cuando son online.

### Offline

Todos juegan desde el mismo dispositivo. No requiere conexion a internet. En modo casual se accede directamente al menu de juegos; en competitivo se crea o se carga una partida guardada antes de elegir un juego.

### Online

Requiere iniciar sesion. Una persona crea una sala y recibe un codigo de seis caracteres para compartir con el resto, o cada participante se une con ese codigo y su nombre. El anfitrion inicia la partida, elige el juego y controla las acciones de administracion de cada ronda. Los roles, las rondas y el marcador se sincronizan en tiempo real mediante Firebase.

## Juegos disponibles

### 1. Impostor Futbolero

La aplicacion elige un futbolista secreto y lo reparte como rol a los jugadores que no son impostores. Uno o dos participantes reciben el rol `IMPOSTOR` y deben intentar pasar desapercibidos durante la conversacion. Al terminar la ronda, el grupo decide el ganador; en modo competitivo se concede 1 punto al jugador seleccionado.

Se necesitan al menos dos jugadores para iniciar una ronda. Para una partida competitiva, el menu exige al menos tres jugadores.

### 2. Impostor Multiclasificacion

Conserva la mecanica del impostor, pero permite elegir una categoria antes de repartir los roles. Los jugadores normales reciben el mismo elemento de la categoria seleccionada y los impostores solo conocen su condicion de impostor, sin pistas adicionales. Como en el modo anterior, el ganador elegido recibe 1 punto en una partida competitiva.

### 3. Adivina mi Jugador

Cada participante recibe un futbolista diferente. El objetivo es descubrir la identidad asignada a los demas mediante preguntas y deduccion. En online, la identidad propia se mantiene oculta para evitar revelar la respuesta.

En modo competitivo, quien administra la ronda elige al ganador y suma 1 punto. Tambien puede saltar una ronda sin asignar puntuacion.

### 4. Torres Futboleras

Cada jugador recibe una descripcion o desafio de una torre futbolera con una dificultad asociada. Los demas deben usar la informacion disponible para deducirla. En una partida online, cada persona ve las torres de los otros jugadores, mientras que la propia queda oculta.

En competitivo, los puntos del ganador dependen de la dificultad de la torre: facil suma 1, media 2, dificil 3 y extremo 4 puntos. Se puede omitir una ronda sin puntuar.

### 5. Adivina por Turnos

Los jugadores participan en orden rotativo. En cada turno se escoge un futbolista y la persona que adivina conoce desde el inicio su nacionalidad y cantidad de goles, pero no puede ver el nombre. El resto puede consultar el nombre para comprobar la respuesta.

Cada turno comienza con 10 puntos en juego. La persona activa puede pedir pistas, que reducen la recompensa: clubes resta 5 puntos, posicion resta 2 y palmares resta 3. Si acierta, suma los puntos que queden; si no, no recibe puntos y pasa el turno al siguiente jugador. Se necesitan al menos dos jugadores.

### 6. El Intruso por Turnos

En cada turno aparecen cinco futbolistas. Cuatro comparten una caracteristica concreta, como haber ganado un torneo, jugado en un club o recibido un premio, y uno no la cumple. La persona activa debe pulsar el futbolista intruso. Si acierta, suma 1 punto; si falla, se revela la respuesta y el turno pasa al siguiente jugador. Se necesitan al menos dos jugadores.

## Flujo recomendado

1. Elegir **Casual** o **Competitivo**.
2. Elegir **Offline** u **Online**.
3. En online, iniciar sesion y crear o unirse a una sala.
4. En competitivo, crear o cargar la partida con sus jugadores.
5. Seleccionar uno de los seis juegos y comenzar la ronda.
6. En competitivo, registrar el resultado para actualizar el marcador antes de iniciar la siguiente ronda.

## Plataformas y tecnologia

La aplicacion esta construida con React y Vite. Puede ejecutarse como aplicacion web y cuenta con integraciones para Android e iOS mediante Capacitor, ademas de una version de escritorio basada en Electron. El modo online utiliza Firebase Realtime Database para sincronizar salas y puntuaciones.