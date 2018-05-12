# Arduino day 2018 - Arduino Cooling
**Sistema de enfriamiento controlado por Arduino utilizando una celda Peltier.**

Proyecto realizado para exposicion en el evento Arduino day 2018 en FCyT, UADER en Concepción del Uruguay, Entre Ríos, Argentina 

## Incluye
#### Codigo Arduino
- Probado en version Nano.
- Sensa la temperatura.
- Realiza control PID en base a la temperatrua actuando sobre una salida PWM.
- Envia estado y recibe comandos por puerto serial.

#### Servidor NodeJS
- Recibe estado y envia comandos por puerto serial al arduino.
- Brinda interfaz de websockets para comunicacion con el frontend.

#### Cliente Angular
- Brinda interfaz grafica con un grafico de temperaturas.
- Permite setear la temperatura a regular por la heladera.

## Mejoras.
- Implementar el servidor en una placa wifi.
- Mejorar interfaz gráfica.
- Mejorar PID (podrian probarse otras librerías).
