# ⚽ Footy Games - Juegos de Fútbol Interactivos

Aplicación de juegos de fútbol interactivos con modos casual y competitivo, disponible tanto en modo **offline** como **online**.

## 🎮 Características Principales

### Modos de Juego

- **🎮 Modo Casual**: Juega sin puntuación, solo para divertirse
- **🏆 Modo Competitivo**: Con marcador, tabla de posiciones y seguimiento de puntos

### Modos de Conexión

- **📱 Modo Offline**: Juega localmente en el mismo dispositivo sin conexión a internet
- **🌐 Modo Online**: Crea salas y juega con amigos desde diferentes lugares en tiempo real

### Juegos Disponibles

1. **Impostor Futbolero** 🕵️
   - Asigna roles secretos a los jugadores
   - Algunos son impostores, otros conocen la palabra secreta
   - Ideal para jugar en grupos

2. **Adivina el Jugador** 🎯
   - Cada jugador recibe un futbolista único
   - Adivina los jugadores de los demás con preguntas
   - Gana puntos por respuestas correctas

3. **Torres** 🏰
   - Juego de trivia futbolístico
   - Responde preguntas y escala la torre
   - Múltiples niveles de dificultad

## 🚀 Inicio Rápido

### Instalación

```bash
# Clonar el repositorio
git clone [tu-repo]

# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run dev
```

### Configurar Firebase (para modo online)

Ver la guía completa en [FIREBASE_SETUP.md](FIREBASE_SETUP.md)

1. Crear proyecto en Firebase Console
2. Habilitar Realtime Database
3. Configurar credenciales en `src/services/firebaseService.js`
4. Instalar dependencias: `npm install firebase`

## 📱 Plataformas Soportadas

- ✅ Web (navegadores modernos)
- ✅ Android (vía Capacitor)
- ✅ iOS (vía Capacitor)

## 🛠️ Tecnologías

- **Frontend**: React 19 + Vite
- **Backend Online**: Firebase Realtime Database
- **Mobile**: Capacitor 7
- **Estilos**: CSS personalizado con variables

## 📖 Documentación

- [GUIA_ONLINE.md](GUIA_ONLINE.md) - Guía completa de uso del modo online
- [FIREBASE_SETUP.md](FIREBASE_SETUP.md) - Configuración de Firebase paso a paso
- [GUIA_ANDROID.md](GUIA_ANDROID.md) - Compilación para Android
- [GUIA_IOS.md](GUIA_IOS.md) - Compilación para iOS

## 🎯 Cómo Jugar

### Modo Offline

1. Selecciona modo Casual o Competitivo
2. Selecciona "Offline"
3. En competitivo: crea o carga una partida guardada
4. Selecciona un juego
5. ¡A jugar!

### Modo Online

#### Como Anfitrión:
1. Selecciona modo Casual o Competitivo
2. Selecciona "Online" → "Crear Partida"
3. Ingresa tu nombre y la lista de jugadores
4. Comparte el código de 6 dígitos con los demás
5. Espera a que todos se conecten
6. ¡Inicia la partida!

#### Como Participante:
1. Selecciona modo Casual o Competitivo  
2. Selecciona "Online" → "Unirse a Partida"
3. Ingresa el código que te compartieron
4. Ingresa tu nombre (debe estar en la lista)
5. Espera a que el anfitrión inicie

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint

# Sincronizar con Capacitor
npx cap sync

# Abrir en Android Studio
npx cap open android

# Abrir en Xcode
npx cap open ios
```

## 🌐 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── NetworkModeSelector.jsx
│   ├── OnlineMatchCreator.jsx
│   ├── OnlineMatchJoin.jsx
│   ├── OnlineRoomLobby.jsx
│   └── ...
├── games/              # Juegos individuales
│   ├── impostor/
│   ├── guess-player/
│   └── torres/
├── services/           # Servicios externos
│   └── firebaseService.js
├── utils/              # Utilidades
└── data/              # Datos estáticos
```

## 🔒 Seguridad

Para uso en producción:

1. **Implementar Firebase Authentication**
2. **Configurar reglas de seguridad estrictas**
3. **Validar datos en servidor con Cloud Functions**
4. **Limitar acceso por dominio**

Ver más en [FIREBASE_SETUP.md](FIREBASE_SETUP.md)

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 🆘 Soporte

Si tienes problemas:

1. Revisa la [Guía Online](GUIA_ONLINE.md)
2. Revisa la [Configuración de Firebase](FIREBASE_SETUP.md)
3. Abre un issue en GitHub

## 🎉 Créditos

Desarrollado con ❤️ para los amantes del fútbol.

---

## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
