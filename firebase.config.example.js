// EJEMPLO: Configuración de Firebase
// Este archivo es solo un ejemplo. NO lo uses directamente.
// Debes obtener tus propias credenciales desde Firebase Console.

// 1. Ve a https://console.firebase.google.com/
// 2. Crea un nuevo proyecto o selecciona uno existente
// 3. Ve a Configuración del proyecto (ícono de engranaje)
// 4. En "Tus apps", agrega una app web (</> ícono)
// 5. Copia la configuración que aparece

// EJEMPLO DE CONFIGURACIÓN (REEMPLAZAR CON TUS VALORES REALES):

export const firebaseConfigExample = {
    apiKey: "AIzaSyA1234567890abcdefghijklmnopqrstuvw",
    authDomain: "tu-proyecto-12345.firebaseapp.com",
    databaseURL: "https://tu-proyecto-12345-default-rtdb.firebaseio.com",
    projectId: "tu-proyecto-12345",
    storageBucket: "tu-proyecto-12345.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abc123def456ghi789jkl"
};

// UBICACIÓN DONDE PEGAR ESTA CONFIGURACIÓN:
// src/services/firebaseService.js
// Busca el objeto "this.config" y reemplaza los valores

// EJEMPLO DE CÓMO SE VE EN firebaseService.js:
/*
class FirebaseService {
    constructor() {
        this.db = null;
        this.currentRoomRef = null;
        this.listeners = {};
        
        // REEMPLAZAR ESTE OBJETO CON TUS CREDENCIALES:
        this.config = {
            apiKey: "TU_API_KEY_AQUI",              // ← Cambiar
            authDomain: "tu-proyecto.firebaseapp.com", // ← Cambiar
            databaseURL: "https://tu-proyecto.firebaseio.com", // ← Cambiar
            projectId: "tu-proyecto",                // ← Cambiar
            storageBucket: "tu-proyecto.appspot.com", // ← Cambiar
            messagingSenderId: "123456789012",       // ← Cambiar
            appId: "1:123456789012:web:abc123"       // ← Cambiar
        };
    }
    // ... resto del código
}
*/

// IMPORTANTE: 
// - NO compartas estas credenciales públicamente en repositorios
// - Para producción, usa variables de entorno
// - Configura reglas de seguridad en Firebase Console
// - Habilita Realtime Database antes de usar la app

// REGLAS DE FIREBASE RECOMENDADAS PARA DESARROLLO:
/*
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
*/

// REGLAS DE FIREBASE RECOMENDADAS PARA PRODUCCIÓN:
/*
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
*/

// ¿NECESITAS AYUDA?
// Ver: FIREBASE_SETUP.md para guía paso a paso
