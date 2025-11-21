# Guía para generar APK de Android

Tu proyecto ya está configurado para Android. Sigue estos pasos para crear el archivo instalable (`.apk`).

## Requisitos Previos
- Tener instalado **Android Studio**.

## Pasos

1.  **Abrir el proyecto en Android Studio:**
    - Abre una terminal en la carpeta del proyecto (`c:\Users\Santiago Peña\Desktop\impostor`).
    - Ejecuta el comando:
        ```bash
        npx cap open android
        ```
    - Esto abrirá Android Studio automáticamente con tu proyecto cargado.

2.  **Esperar la sincronización:**
    - Android Studio comenzará a indexar y descargar dependencias de Gradle. Espera a que la barra de progreso inferior termine.

3.  **Generar la APK:**
    - En el menú superior, ve a **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
    - Espera a que termine el proceso.

4.  **Ubicar el archivo:**
    - Cuando termine, aparecerá una notificación abajo a la derecha. Haz clic en **"locate"**.
    - O navega manualmente a: `android/app/build/outputs/apk/debug/app-debug.apk`.

5.  **Instalar en tu celular:**
    - Envía ese archivo `.apk` a tu celular (por WhatsApp, USB, Drive, etc.).
    - Ábrelo e instálalo (tendrás que permitir "Orígenes desconocidos" si te lo pide).

¡Listo! Ya tienes "Impostor Futbolero" como una app nativa en tu Android.
