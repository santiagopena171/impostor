# 🌐 Configuración de Firebase para Modo Online

Este documento explica cómo configurar Firebase Realtime Database para habilitar el modo online en Footy Games.

## 📋 Requisitos Previos

- Cuenta de Google
- Acceso a Firebase Console

## 🚀 Pasos para Configurar Firebase

### 1. Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Agregar proyecto" o "Add project"
3. Ingresa un nombre para tu proyecto (ej: "footy-games")
4. Desactiva Google Analytics si no lo necesitas
5. Haz clic en "Crear proyecto"

### 2. Configurar Realtime Database

1. En el menú lateral, selecciona **"Realtime Database"** (bajo "Build")
2. Haz clic en **"Crear base de datos"** o **"Create Database"**
3. Selecciona una ubicación (ej: `us-central1`)
4. Elige **"Modo de prueba"** o **"Test mode"** para empezar
   - ⚠️ Esto permite lectura/escritura sin autenticación (solo para desarrollo)
5. Haz clic en "Habilitar"

### 3. Configurar Reglas de Seguridad (Opcional pero Recomendado)

Por defecto, el modo de prueba permite acceso completo durante 30 días. Para producción, usa estas reglas:

```json
{
  "rules": {
    "rooms": {
      "$roomCode": {
        ".read": true,
        ".write": true,
        ".indexOn": ["createdAt", "updatedAt"]
      }
    }
  }
}
```

### 4. Obtener Credenciales de Firebase

1. En Firebase Console, haz clic en el ícono de engranaje ⚙️ (arriba a la izquierda)
2. Selecciona **"Configuración del proyecto"** o **"Project settings"**
3. En la pestaña "General", desplázate hasta "Tus apps"
4. Haz clic en el ícono **"</>"** (Web)
5. Registra tu app con un nombre (ej: "Footy Games Web")
6. **NO** marques "Firebase Hosting"
7. Haz clic en "Registrar app"
8. Copia la configuración que aparece

### 5. Configurar las Credenciales en el Proyecto

Abre el archivo `src/services/firebaseService.js` y reemplaza la configuración:

```javascript
this.config = {
    apiKey: "TU_API_KEY_AQUI",
    authDomain: "tu-proyecto.firebaseapp.com",
    databaseURL: "https://tu-proyecto-default-rtdb.firebaseio.com",
    projectId: "tu-proyecto",
    storageBucket: "tu-proyecto.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abc123def456"
};
```

## 📦 Instalar Dependencias

Ejecuta el siguiente comando para instalar Firebase SDK:

```bash
npm install firebase
```

## 🧪 Probar la Configuración

1. Ejecuta tu aplicación: `npm run dev`
2. Selecciona modo Casual o Competitivo
3. Selecciona modo Online
4. Crea una partida
5. Verifica que se genere un código de sala
6. En Firebase Console, ve a Realtime Database y deberías ver los datos en `/rooms`

## 🔒 Seguridad para Producción

Para producción, considera implementar:

1. **Firebase Authentication**: Requiere que los usuarios inicien sesión
2. **Reglas de seguridad más estrictas**:

```json
{
  "rules": {
    "rooms": {
      "$roomCode": {
        ".read": "auth != null",
        ".write": "auth != null && (!data.exists() || data.child('host').val() === auth.uid)",
        "players": {
          "$playerId": {
            ".write": "auth != null"
          }
        }
      }
    }
  }
}
```

3. **Validación de servidor**: Usa Cloud Functions para validar datos

## 🌍 Estructura de Datos en Firebase

```
rooms/
  ABC123/                     # Código de sala
    code: "ABC123"
    host: "Santiago"
    status: "waiting"         # waiting, playing, finished
    createdAt: 1234567890
    updatedAt: 1234567890
    matchData:
      name: "Partida de Amigos"
      players: ["Santiago", "Mateo", "Lucas"]
      gameMode: "competitive"
    scores:
      Santiago: 0
      Mateo: 0
      Lucas: 0
    players:
      Santiago:
        name: "Santiago"
        connected: true
        joinedAt: 1234567890
      Mateo:
        name: "Mateo"
        connected: true
        joinedAt: 1234567890
    currentGame: null         # impostor, guess-player, torres
    gameState: null           # Estado específico del juego
```

## 📱 Usar en Capacitor (Android/iOS)

El código ya está listo para funcionar en Capacitor. Solo asegúrate de:

1. Tener conexión a internet en el dispositivo
2. Las reglas de Firebase permitan acceso desde cualquier origen
3. El dominio de tu app esté configurado en Firebase Authentication (si usas autenticación)

## 🆘 Solución de Problemas

### Error: "Permission denied"
- Verifica que las reglas de Firebase permitan lectura/escritura
- En desarrollo, usa modo de prueba

### Error: "Firebase not initialized"
- Asegúrate de haber ejecutado `npm install firebase`
- Verifica que las credenciales estén correctamente configuradas

### No se sincronizan los datos
- Verifica tu conexión a internet
- Abre la consola del navegador para ver errores
- Verifica en Firebase Console que los datos se están escribiendo

### Código de sala no funciona
- Los códigos son de 6 caracteres alfanuméricos
- Son case-insensitive (se convierten a mayúsculas)
- Tienen una validez según las reglas que configures

## 🎯 Próximos Pasos

Una vez configurado Firebase, puedes:

1. ✅ Crear partidas online
2. ✅ Unirte con códigos de sala
3. ✅ Sincronizar puntuaciones en tiempo real
4. ✅ Ver jugadores conectados
5. 🔄 Implementar sincronización de estado de juegos (opcional)

## 📚 Recursos Adicionales

- [Documentación de Firebase](https://firebase.google.com/docs)
- [Realtime Database Guide](https://firebase.google.com/docs/database)
- [Security Rules](https://firebase.google.com/docs/database/security)

---

¡Listo! Una vez configurado Firebase, tu aplicación estará lista para jugar online 🎮🌐
