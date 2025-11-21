# Guía para generar App de iOS

Tu proyecto ya está configurado para iOS con Capacitor. Sin embargo, **para generar la aplicación final (.ipa) necesitas obligatoriamente una computadora Mac con Xcode instalado**, ya que Apple no permite compilar apps de iOS en Windows.

## Requisitos Previos
- Una computadora **Mac**.
- Tener instalado **Xcode** (descárgalo gratis desde la App Store en la Mac).
- Una cuenta de Apple ID (gratuita para probar, de pago para subir a la tienda).

## Pasos para compilar en Mac

1.  **Lleva tu proyecto a la Mac:**
    - Copia toda la carpeta del proyecto `impostor` a tu Mac o clónalo desde GitHub si lo subiste.

2.  **Instala las dependencias:**
    - Abre la terminal en la carpeta del proyecto en tu Mac.
    - Ejecuta:
        ```bash
        npm install
        ```

3.  **Sincroniza el proyecto:**
    - Asegúrate de que la carpeta `ios` tenga los últimos cambios de tu código web:
        ```bash
        npm run build
        npx cap sync ios
        ```

4.  **Abrir en Xcode:**
    - Ejecuta el siguiente comando para abrir el proyecto nativo:
        ```bash
        npx cap open ios
        ```
    - Esto abrirá Xcode automáticamente.

5.  **Configurar la firma (Signing):**
    - En Xcode, haz clic en el icono azul del proyecto (App) en la barra lateral izquierda.
    - Ve a la pestaña **"Signing & Capabilities"**.
    - En la sección **"Team"**, selecciona tu cuenta de Apple ID (si no aparece, agrégala en *Xcode > Settings > Accounts*).
    - Asegúrate de que el "Bundle Identifier" sea `com.impostorfutbolero.app`.

6.  **Ejecutar en Simulador o Dispositivo:**
    - **Simulador:** Selecciona un iPhone (ej. iPhone 15) en el menú superior y dale al botón de **Play** (triángulo).
    - **Dispositivo real:** Conecta tu iPhone por USB, selecciónalo en el menú superior y dale a **Play**.

## ¿No tienes Mac?
Si no tienes acceso a una Mac, no puedes generar el archivo `.ipa` localmente. Tus opciones son:
- Usar un servicio de compilación en la nube como **Ionic Appflow**.
- Pedir prestada una Mac solo para el paso de compilación.
- Instalar una máquina virtual de macOS (Hackintosh), aunque es complejo y lento.
