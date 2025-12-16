# Guía de Debugging - Sistema de Partidas Online

## Problema Reportado
1. **Las partidas guardadas no aparecen después de reiniciar el servidor** - Aunque el usuario permanece autenticado, las partidas guardadas no se cargan en la lista.
2. **Al unirse por código, se olvida que es el admin** - Cuando se carga una partida guardada y se reconecta a la sala, el host status no se mantiene correctamente.

---

## Cambios Realizados para Debugging

### 1. **Carga de Partidas Después de Reiniciar** (`App.jsx`)

**Problema detectado:** Race condition donde `loadOnlineMatches()` podría ejecutarse antes de que `firebaseService.currentUser` esté actualizado.

**Solución aplicada:**
```javascript
// Agregado delay de 100ms en el auth listener
if (user) {
  console.log('👤 User logged in, loading matches...');
  setTimeout(() => {
    loadOnlineMatches();
  }, 100);
}
```

**Logs agregados:**
- `🔐 Auth changed: [email]` - Confirma que auth fue detectado
- `👤 User logged in, loading matches...` - Confirma que se intenta cargar partidas
- `🔄 Loading online matches...` - Confirma que la función se ejecuta
- `✅ Online matches loaded: X matches` - Muestra cuántas partidas se cargaron
- `❌ Error al cargar partidas online:` - Muestra errores si ocurren

---

### 2. **Filtrado de Partidas en Firebase** (`firebaseService.js`)

**Logs agregados en `loadOnlineMatches()`:**
```javascript
console.log('⚠️ No current user, cannot load matches'); // Si no hay usuario
console.log('📥 Loading matches for user:', this.currentUser.uid); // UID del usuario
console.log('📦 Total matches in DB:', snapshot.size); // Total en Firebase
console.log('🔍 Checking match:', match.id, {
  savedBy: match.savedBy,
  playerUids: match.playerUids,
  myUid: userId,
  isMatch: match.savedBy === userId || (match.playerUids && match.playerUids[userId])
}); // Evaluación de cada match
console.log('✅ Match included'); // Match agregado a la lista
console.log('❌ Match excluded'); // Match excluido
console.log('📊 Total matches for user:', matches.length); // Total para este usuario
```

---

### 3. **Reconexión a Salas y Verificación de Host** (`App.jsx`)

**Logs agregados en `handleSelectMatch()`:**
```javascript
console.log('📂 Loading match:', match); // Datos completos del match
console.log('🌐 Reconnecting to online room:', match.onlineRoomCode); // Código de sala
console.log('🔍 Host check:', {
  myName: match.onlinePlayerName,
  originalHost: originalHost,
  isOriginalHost: isOriginalHost,
  allPlayers: match.matchData.players
}); // Verificación de quién es el host original
console.log('📦 Room data from Firebase:', roomData); // Datos de la sala en Firebase
console.log('🏗️ Room not found, recreating as host...'); // Si se recrea la sala
console.log('✅ Room recreated, you are host'); // Confirmación de recreación
console.log('✅ Room exists, host status:', {
  roomHost: roomData.host,
  myName: match.onlinePlayerName,
  isHost: isHost
}); // Estado del host si la sala existe
console.log('📝 Updating room data as host...'); // Si actualiza como host
console.log('⚠️ Not original host and room does not exist'); // Error si no es host
console.log('🔗 Reconnecting player...'); // Al reconectar jugador
```

---

### 4. **Recreación de Salas** (`firebaseService.js`)

**Logs agregados en `recreateRoom()`:**
```javascript
console.log('🏗️ Recreating room:', {
  roomCode,
  hostPlayerName,
  matchDataPlayers: matchData.players
}); // Parámetros de entrada
console.log('👑 Original host determined:', originalHost); // Host detectado
console.log('✅ Room recreated successfully:', {
  host: originalHost,
  reconnectingPlayer: hostPlayerName,
  isReconnectingPlayerTheHost: originalHost === hostPlayerName
}); // Estado final
```

---

### 5. **Obtención de Datos de Sala** (`firebaseService.js`)

**Logs agregados en `getRoomData()`:**
```javascript
console.log('🔍 Getting room data for:', roomCode.toUpperCase()); // Código buscado
console.log('📦 Room found:', {
  code: roomCode.toUpperCase(),
  host: roomData.host,
  players: Object.keys(roomData.players || {}),
  status: roomData.status
}); // Si se encuentra la sala
console.log('❌ Room not found:', roomCode.toUpperCase()); // Si no existe
```

---

## Pasos para Debugging

### 1. **Abrir la Consola del Navegador**
- Presiona `F12` en el navegador
- Ve a la pestaña "Console"

### 2. **Recargar la Página**
- Presiona `F5` para recargar
- Observa los logs que aparecen

### 3. **Secuencia de Logs Esperada**

#### **A. Autenticación (al cargar la página)**
```
🔐 Auth changed: usuario@footygames.app
👤 User logged in, loading matches...
```
✅ **Si ves estos logs:** La autenticación está funcionando correctamente.
❌ **Si NO los ves:** Problema con Firebase Auth o la sesión no persiste.

---

#### **B. Carga de Partidas**
```
🔄 Loading online matches...
📥 Loading matches for user: abc123def456
📦 Total matches in DB: 5
🔍 Checking match: match1 {savedBy: "abc123", playerUids: {...}, myUid: "abc123", isMatch: true}
✅ Match included
🔍 Checking match: match2 {savedBy: "xyz789", playerUids: {...}, myUid: "abc123", isMatch: false}
❌ Match excluded
...
📊 Total matches for user: 3
✅ Online matches loaded: 3 matches
```

**Diagnóstico:**
- ✅ **"Total matches in DB: 0"** → No hay partidas guardadas en Firebase
- ✅ **"Total matches for user: 0"** pero "Total matches in DB: > 0" → Problema de filtrado o permisos
- ✅ **"⚠️ No current user, cannot load matches"** → `this.currentUser` no está establecido (race condition)
- ✅ **"❌ Error al cargar partidas online"** → Error en Firebase (verificar reglas)

---

#### **C. Seleccionar una Partida Guardada**
```
📂 Loading match: {id: "match1", networkMode: "online", ...}
🌐 Reconnecting to online room: ABC123
🔍 Host check: {myName: "Juan", originalHost: "Juan", isOriginalHost: true, allPlayers: ["Juan", "Pedro"]}
🔍 Getting room data for: ABC123
```

**Posibles escenarios:**

**Escenario 1: Sala NO existe y SOY el host original**
```
❌ Room not found: ABC123
🏗️ Room not found, recreating as host...
🏗️ Recreating room: {roomCode: "ABC123", hostPlayerName: "Juan", ...}
👑 Original host determined: Juan
✅ Room recreated successfully: {host: "Juan", reconnectingPlayer: "Juan", isReconnectingPlayerTheHost: true}
✅ Room recreated, you are host
```
✅ **Resultado esperado:** Deberías poder controlar la partida (seleccionar juegos, repartir, etc.)

---

**Escenario 2: Sala NO existe y NO SOY el host original**
```
❌ Room not found: ABC123
⚠️ Not original host and room does not exist
[ALERT: "La sala no existe. Solo el host puede recrearla."]
```
✅ **Resultado esperado:** Se muestra un error y se cambia a modo offline.

---

**Escenario 3: Sala existe y SOY el host**
```
📦 Room found: {code: "ABC123", host: "Juan", players: ["Juan", "Pedro"], status: "waiting"}
✅ Room exists, host status: {roomHost: "Juan", myName: "Juan", isHost: true}
📝 Updating room data as host...
🔗 Reconnecting player...
```
✅ **Resultado esperado:** Deberías poder controlar la partida.

---

**Escenario 4: Sala existe y NO SOY el host**
```
📦 Room found: {code: "ABC123", host: "Juan", players: ["Juan", "Pedro"], status: "waiting"}
✅ Room exists, host status: {roomHost: "Juan", myName: "Pedro", isHost: false}
🔗 Reconnecting player...
```
✅ **Resultado esperado:** NO deberías poder seleccionar juegos ni repartir.

---

## Problemas Conocidos y Soluciones

### Problema 1: "No se cargan las partidas después de reiniciar"

**Posibles causas:**
1. **Race condition:** `loadOnlineMatches()` se ejecuta antes de que `this.currentUser` esté disponible
2. **Reglas de Firebase:** Los permisos de lectura están bloqueando el acceso
3. **Estructura de datos:** `playerUids` no está guardado correctamente

**Verificación:**
```javascript
// En la consola, después de cargar:
// ¿Aparece este log?
"⚠️ No current user, cannot load matches"

// Si SÍ aparece:
// - El delay de 100ms no fue suficiente
// - this.currentUser no se está actualizando en firebaseService

// Si NO aparece pero "Total matches for user: 0":
// - Problema con las reglas de Firebase
// - playerUids no está guardado correctamente
// - savedBy no coincide con tu UID
```

**Soluciones:**
- Aumentar el delay a 200-300ms
- Usar `this.auth.currentUser` directamente en lugar de `this.currentUser`
- Verificar reglas de Firebase en Firebase Console → Realtime Database → Rules

---

### Problema 2: "Se olvida que soy el admin al cargar partida"

**Posibles causas:**
1. **Host detectado incorrectamente:** `match.matchData.players[0]` no es el host original
2. **Sala recreada con host incorrecto:** `recreateRoom()` está usando el jugador equivocado como host
3. **Estado de `isOnlineHost` no se actualiza:** El valor se queda en `false`

**Verificación:**
```javascript
// Busca estos logs al cargar la partida:
🔍 Host check: {
  myName: "TuNombre",
  originalHost: "OtroNombre",  // ← Si esto NO coincide con "myName", NO eres el host
  isOriginalHost: false,        // ← Este valor debe ser "true" para ser host
  allPlayers: ["OtroNombre", "TuNombre"]  // ← El primer nombre debe ser el tuyo
}

// Si originalHost NO eres tú pero DEBERÍAS ser el host:
// - El orden de jugadores en matchData.players está incorrecto
// - La partida fue guardada con los jugadores en orden equivocado
```

**Soluciones:**
- Verificar que al guardar la partida, el host esté primero en `matchData.players`
- En `recreateRoom()`, asegurar que `matchData.players[0]` sea el host correcto
- Si el problema persiste, agregar un campo `originalHost` al guardar partidas

---

## Verificación de Reglas de Firebase

### Reglas Actuales (`firebase-rules.json`)

```json
{
  "rules": {
    "rooms": {
      "$roomCode": {
        ".read": true,
        ".write": true
      }
    },
    "savedMatches": {
      "$matchId": {
        ".read": "auth != null && (data.child('savedBy').val() === auth.uid || data.child('playerUids').child(auth.uid).val() === true)",
        ".write": "auth != null && (data.child('savedBy').val() === auth.uid || !data.exists())"
      }
    },
    "users": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        ".write": "auth != null && auth.uid === $uid"
      }
    }
  }
}
```

### Verificar en Firebase Console
1. Ve a Firebase Console: https://console.firebase.google.com/
2. Selecciona tu proyecto "impostor-b32b5"
3. Ve a "Realtime Database" → "Rules"
4. Confirma que las reglas coinciden con las de arriba
5. Si no coinciden, copia y pega las reglas correctas y haz clic en "Publicar"

---

## Comandos Útiles para Debugging

### Ver todas las partidas en Firebase (desde consola del navegador)
```javascript
// Ejecuta esto en la consola del navegador después de cargar la página
const { ref, get } = window.firebaseImports;
const { db } = window.firebaseService;
const matchesRef = ref(db, 'savedMatches');
get(matchesRef).then(snapshot => {
  if (snapshot.exists()) {
    console.table(Object.values(snapshot.val()));
  } else {
    console.log('No hay partidas guardadas');
  }
});
```

### Ver datos de una sala específica
```javascript
// Reemplaza "ABC123" con tu código de sala
const roomCode = "ABC123";
const roomRef = ref(db, `rooms/${roomCode}`);
get(roomRef).then(snapshot => {
  if (snapshot.exists()) {
    console.log('Datos de la sala:', snapshot.val());
  } else {
    console.log('Sala no existe');
  }
});
```

### Ver tu UID actual
```javascript
console.log('Tu UID:', window.firebaseService.auth.currentUser?.uid);
```

---

## Próximos Pasos

1. **Recargar la página** y abrir la consola (F12)
2. **Copiar todos los logs** que aparecen
3. **Compartir los logs** para análisis
4. **Intentar cargar una partida guardada** y copiar los logs que aparecen
5. **Verificar las reglas de Firebase** en la consola

Con esta información podremos identificar exactamente dónde está el problema y aplicar la solución correcta.
