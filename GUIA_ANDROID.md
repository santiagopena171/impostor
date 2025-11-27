# Guía para generar APK de Android

Tu proyecto ya está configurado para Android con **Footy Games** (3 juegos incluidos).

## Requisitos Previos
- Tener instalado **Android Studio**.

## Pasos

### 1. Construir la aplicación web

Primero, construye la versión de producción:
```bash
npm run build
```

### 2. Sincronizar con Android

Copia los archivos actualizados a la carpeta Android:
```bash
npx cap sync android
```

### 3. Abrir el proyecto en Android Studio

```bash
npx cap open android
```

Esto abrirá Android Studio automáticamente con tu proyecto cargado.

### 4. Esperar la sincronización

Android Studio comenzará a indexar y descargar dependencias de Gradle. Espera a que la barra de progreso inferior termine.

### 5. Generar la APK

En el menú superior, ve a **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.

Espera a que termine el proceso.

### 6. Ubicar el archivo

Cuando termine, aparecerá una notificación abajo a la derecha. Haz clic en **"locate"**.

O navega manualmente a: `android/app/build/outputs/apk/debug/app-debug.apk`.

### 7. Instalar en tu celular

- Envía ese archivo `.apk` a tu celular (por WhatsApp, USB, Drive, etc.).
- Ábrelo e instálalo (tendrás que permitir "Orígenes desconocidos" si te lo pide).

¡Listo! Ya tienes **Footy Games** con sus 3 juegos como app nativa en Android:
- ⚽ Impostor Futbolero
- 🕵️ Adivina mi Jugador
- 🏗️ Torres Futboleras
